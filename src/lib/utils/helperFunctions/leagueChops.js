import { getLeagueData } from "./leagueData";
import { leagueID } from "$lib/utils/leagueInfo";
import { getNflState } from "./nflState";
import { waitForAll } from "./multiPromise";
import { get } from "svelte/store";
import { matchupsStore } from "$lib/stores";
import { getStarterPositions } from "$lib/utils/helperFunctions/predictOptimalScore.js";
import { setBestBallLineups } from "$lib/utils/helperFunctions/leagueMatchups.js";

export const getLeagueChops = async (period, startWeek, playersData) => {
  // todo: new store for caching
  // if(get(matchupsStore).matchupWeeks) {
  // 	return get(matchupsStore);
  // }

  const [nflState, leagueData] = await waitForAll(
    getNflState(),
    getLeagueData()
  ).catch((err) => {
    console.error(err);
  });

  let week = 1;
  if (nflState.season_type == "regular") {
    week = nflState.display_week;
  } else if (nflState.season_type == "post") {
    week = 18;
  }
  const year = leagueData.season;
  const numChopPeriods = (leagueData.settings.playoff_week_start - 1) / period;

  // pull in all matchup data for the season
  const matchupsPromises = [];
  for (let i = 1; i < leagueData.settings.playoff_week_start; i++) {
    matchupsPromises.push(
      fetch(`https://api.sleeper.app/v1/league/${leagueID}/matchups/${i}`, {
        compress: true,
      })
    );
  }
  const matchupsRes = await waitForAll(...matchupsPromises);

  // convert the json matchup responses
  const matchupsJsonPromises = [];
  for (const matchupRes of matchupsRes) {
    const data = matchupRes.json();
    matchupsJsonPromises.push(data);
    if (!matchupRes.ok) {
      throw new Error(data);
    }
  }
  const matchupsData = await waitForAll(...matchupsJsonPromises)
    .catch((err) => {
      console.error(err);
    })
    .catch((err) => {
      console.error(err);
    });

  const playersMap = await playersData;

  // todo: can we get the projections here, so we can sort by them
  const newMatchupsData = setBestBallLineups(
    matchupsData,
    playersMap,
    await getStarterPositions(leagueData),
    week
  );

  // newMatchupsData.map((week) => {
  // 	return week.sort((teamA, teamB) => {
  // 		// First, compare by points
  // 		if (teamA.points !== teamB.points) {
  // 			return teamB.points - teamA.points; // Sort by points descending
  // 		}
  //
  // 		// If points are the same, compare by projected_points
  // 		return teamB.projected_points - teamA.projected_points; // Sort by projected points descending
  // 	});
  // });
  // todo: this sorts by week though? we need to do two week pairs. Should we sort after the chopPeriods instead?

  const chopPeriods = [];
  // process all the matchups
  let periodCounter = 1;
  // todo: we need to fix this loop up, its not right
  for (let i = startWeek - 1; periodCounter <= numChopPeriods; i += period) {
    // iterating each chop period
    const processed = processChops(
      newMatchupsData[i],
      newMatchupsData[i + 1],
      periodCounter
    );
    if (processed) {
      chopPeriods.push({
        teams: processed.teams,
        chopNumber: processed.chopNumber,
        weekA: i,
        weekB: i + 1,
        // todo: add more params here, then sort on them
      });
    }
    periodCounter++;
  }

  const matchupsResponse = {
    chopPeriods,
    year,
    numChopPeriods,
  };

  matchupsStore.update(() => matchupsResponse);

  return matchupsResponse;
};

const processChops = (weekA, weekB, chopNumber) => {
  if (!weekA || weekA.length == 0 || !weekB || weekB.length == 0) {
    return false;
  }

  const teams = [];
  for (const teamA of weekA) {
    // Find the corresponding team in weekB by roster_id
    const teamB = weekB.find((team) => team.roster_id === teamA.roster_id);

    // TODO: sort with these
    const totalProjectedPoints =
      teamA.projected_points + teamB.projected_points;
    const totalPoints =
      teamA.starters_points.reduce((a, b) => a + b, 0) +
      teamB.starters_points.reduce((a, b) => a + b, 0);

    // Ensure the team exists in both weeks
    if (teamB) {
      const totalProjectedPoints =
        teamA.projected_points + teamB.projected_points;
      const totalPointsA = teamA.starters_points.reduce((a, b) => a + b, 0);
      const totalPointsB = teamB.starters_points.reduce((a, b) => a + b, 0);
      const totalPoints = totalPointsA + totalPointsB;

      teams.push({
        roster_id: teamA.roster_id,
        startersA: teamA.starters,
        startersB: teamB.starters, // Use starters from weekB
        pointsA: teamA.starters_points,
        pointsB: teamB.starters_points, // Use points from weekB
        totalPoints: totalPoints, // Store totalPoints
        totalProjectedPoints: totalProjectedPoints, // Store totalProjectedPoints
      });
    }

    // Sort teams based on totalPoints first, if equal or 0, then totalProjectedPoints
    teams.sort((a, b) => {
      if (a.totalPoints !== b.totalPoints) {
        return b.totalPoints - a.totalPoints; // Sort by totalPoints descending
      } else {
        return b.totalProjectedPoints - a.totalProjectedPoints; // Sort by totalProjectedPoints descending
      }
    });
  }
  return { teams, chopNumber };
};

import { getLeagueData } from "./leagueData";
import { leagueID } from "$lib/utils/leagueInfo";
import { getNflState } from "./nflState";
import { waitForAll } from "./multiPromise";
import { get } from "svelte/store";
import { matchupsStore } from "$lib/stores";
import { getStarterPositions } from "$lib/utils/helperFunctions/predictOptimalScore.js";

export const setBestBallLineups = (
  matchupsData,
  playersMap,
  starterPositions,
  weekNumber
) => {
  // players[string-id], players_points{id: pts} starters[string-id], starter_points[scores]
  // starter data sometimes not there, so check for null
  /*
	- array of nfl weeks
	- each week has an array of teams
	- ech team has an array of {players[string-id], players_points{id: pts} starters[string-id], starter_points[scores]}
	 */

  let localMatchupsData = structuredClone(matchupsData);

  // for (const week of matchupsData) {
  for (let weekIdx = 0; weekIdx < matchupsData.length; weekIdx++) {
    const week = matchupsData[weekIdx];
    // for (const team of week) {
    for (let teamIdx = 0; teamIdx < week.length; teamIdx++) {
      let totalProjectedPoints = 0;
      const team = week[teamIdx];
      // todo: team.starters no longer null anywhere?
      // try instead comparing current week with index
      // todo: check >= - and check week 8 to be sure
      if (
        (!team.starters || weekIdx + 1 > weekNumber) &&
        team.players &&
        team.players_points
      ) {
        let newStarters = new Array(starterPositions.length).fill(0);
        // positionsTracker looks like this at start ['QB', 'RB', 'RB', 'WR', 'WR', 'TE', 'FLEX', 'FLEX']
        let positionsTracker = Array.from(starterPositions);
        const teamPlayers = team.players
          .map((playerId) => {
            if (playersMap.players[playerId].wi) {
              return {
                player: playersMap.players[playerId],
                playerId,
                projectedPoints: Number(
                  playersMap.players[playerId].wi[weekIdx + 1].p
                ),
              };
            }
          })
          .sort((a, b) => b.projectedPoints - a.projectedPoints); // sort by points descending

        teamPlayers.forEach((player) => {
          if (player) {
            const playerPositionIdx = positionsTracker.indexOf(
              player.player.pos
            );

            if (
              playerPositionIdx !== -1 &&
              newStarters[playerPositionIdx] === 0
            ) {
              // Fill in the core position (QB, RB, WR, TE)
              newStarters[playerPositionIdx] = player.playerId;
              positionsTracker[playerPositionIdx] = null; // Mark the position as filled
              totalProjectedPoints += player.projectedPoints;
            } else if (["RB", "WR", "TE"].includes(player.player.pos)) {
              // If core position is filled, try to fill a FLEX spot
              const flexPositionIdx = positionsTracker.indexOf("FLEX");
              if (
                flexPositionIdx !== -1 &&
                newStarters[flexPositionIdx] === 0
              ) {
                // Fill in the FLEX position
                newStarters[flexPositionIdx] = player.playerId;
                positionsTracker[flexPositionIdx] = null; // Mark the FLEX spot as filled
                totalProjectedPoints += player.projectedPoints;
              }
            }
          }
        });

        localMatchupsData[weekIdx][teamIdx].starters = newStarters;
        localMatchupsData[weekIdx][teamIdx].starters_points = new Array(
          newStarters.length
        ).fill(0);
        localMatchupsData[weekIdx][
          teamIdx
        ].projected_points = totalProjectedPoints;
      } else if (team.starters && team.players && team.players_points) {
        // Start with a fresh new starters array
        let newStarters = new Array(starterPositions.length).fill(null);
        let totalPoints = 0;

        // Create a copy of the positions tracker to track available starter spots
        let positionsTracker = Array.from(starterPositions);

        const teamPlayers = team.players
            .map((playerId) => {
              const actualPoints = team.players_points[playerId] || 0;
              const projectedPoints =
                  playersMap.players[playerId]?.wi?.[weekIdx + 1]?.p || 0;
              return {
                player: playersMap.players[playerId],
                actualPoints,
                projectedPoints,
                playerId,
              };
            })
            .sort((a, b) => {
              // Sort by actual points first, then fallback to projected points
              if (b.actualPoints !== a.actualPoints) {
                return b.actualPoints - a.actualPoints; // Prioritize actual points
              }
              return b.projectedPoints - a.projectedPoints; // Fall back to projections
            });

        // Iterate through the sorted team players and assign starters
        teamPlayers.forEach((player) => {
          const playerPosIdx = positionsTracker.indexOf(player.player.pos);

          // Fill core positions (QB, RB, WR, TE) if they are not already filled
          if (playerPosIdx !== -1 && !newStarters[playerPosIdx]) {
            newStarters[playerPosIdx] = player.playerId;
            positionsTracker[playerPosIdx] = null; // Mark the position as filled
            totalPoints += player.actualPoints || player.projectedPoints; // Add points
          } else if (["RB", "WR", "TE"].includes(player.player.pos)) {
            // Try to fill a FLEX position if the player doesn't fit into a core spot
            const flexPosIdx = positionsTracker.indexOf("FLEX");
            if (flexPosIdx !== -1 && !newStarters[flexPosIdx]) {
              newStarters[flexPosIdx] = player.playerId;
              positionsTracker[flexPosIdx] = null; // Mark the FLEX spot as filled
              totalPoints += player.actualPoints || player.projectedPoints; // Add points
            }
          }
        });

        // After processing all players, update the starters and their points in the local data
        localMatchupsData[weekIdx][teamIdx].starters = newStarters;
        localMatchupsData[weekIdx][teamIdx].starters_points = newStarters.map(
            (starterId) => (starterId ? team.players_points[starterId] || 0 : 0)
        );
        localMatchupsData[weekIdx][teamIdx].total_points = totalPoints;
      }

    }
  }

  return localMatchupsData;
};

export const getLeagueMatchups = async (playersData) => {
  if (get(matchupsStore).matchupWeeks) {
    return get(matchupsStore);
  }

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
  const regularSeasonLength = leagueData.settings.playoff_week_start - 1;

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

  // const newMatchupsData = setBestBallLineups(
  //   matchupsData,
  //   playersMap,
  //   await getStarterPositions(leagueData),
  //   week
  // );

  const newMatchupsData = matchupsData;

  const matchupWeeks = [];
  // process all the matchups
  for (let i = 1; i < newMatchupsData.length + 1; i++) {
    const processed = processMatchups(newMatchupsData[i - 1], i);
    if (processed) {
      matchupWeeks.push({
        matchups: processed.matchups,
        week: processed.week,
      });
    }
  }

  const matchupsResponse = {
    matchupWeeks,
    year,
    week,
    regularSeasonLength,
  };

  matchupsStore.update(() => matchupsResponse);

  return matchupsResponse;
};

const processMatchups = (inputMatchups, week) => {
  if (!inputMatchups || inputMatchups.length == 0) {
    return false;
  }
  const matchups = {};
  for (const match of inputMatchups) {
    if (!matchups[match.matchup_id]) {
      matchups[match.matchup_id] = [];
    }
    matchups[match.matchup_id].push({
      roster_id: match.roster_id,
      starters: match.starters,
      points: match.starters_points,
    });
  }
  return { matchups, week };
};

import { leagueID, managers } from "$lib/utils/leagueInfo";
import { get } from "svelte/store";
import { teamManagersStore } from "$lib/stores";
import { waitForAll } from "./multiPromise";
import { getManagers, getTeamData } from "./universalFunctions";
import { getLeagueData } from "./leagueData";
import { timeoutSignal } from "./fetchTimeout";

export const getLeagueTeamManagers = async () => {
  if (get(teamManagersStore) && get(teamManagersStore).currentSeason) {
    return get(teamManagersStore);
  }

  // walk the previous_league_id chain to find every season's league ID.
  // this part has to be sequential (each season's ID is only known once the
  // previous one is fetched), but getLeagueData caches its result, so the
  // per-season users/rosters fetch below doesn't repeat this work.
  const leagueIDs = [];
  let currentLeagueID = leagueID;
  const seasonLeagueData = [];
  while (currentLeagueID && currentLeagueID != 0) {
    leagueIDs.push(currentLeagueID);
    const leagueData = await getLeagueData(currentLeagueID);
    seasonLeagueData.push(leagueData);
    currentLeagueID = leagueData.previous_league_id;
  }

  // now that every season's ID is known, fetch all of their users/rosters concurrently
  const seasons = await waitForAll(
    ...leagueIDs.map(async (id, ix) => {
      const [usersRaw, rostersRaw] = await waitForAll(
        fetch(`https://api.sleeper.app/v1/league/${id}/users`, {
          compress: true,
          signal: timeoutSignal(),
        }),
        fetch(`https://api.sleeper.app/v1/league/${id}/rosters`, {
          compress: true,
          signal: timeoutSignal(),
        })
      );
      const [users, rosters] = await waitForAll(
        usersRaw.json(),
        rostersRaw.json()
      );
      return { users, rosters, leagueData: seasonLeagueData[ix] };
    })
  );

  let teamManagersMap = {};
  let finalUsers = {};
  let currentSeason = null;

  // process seasons in order (most recent first) so the dedup below keeps the newest data
  for (const { users, rosters, leagueData } of seasons) {
    const year = parseInt(leagueData.season);
    if (!currentSeason) {
      currentSeason = year;
    }
    teamManagersMap[year] = {};
    const processedUsers = processUsers(users);

    // in order to not overwrite most recent data, only add new entries to finalUsers
    for (const processedUserKey in processedUsers) {
      if (finalUsers[processedUserKey]) continue;
      finalUsers[processedUserKey] = processedUsers[processedUserKey];
    }

    for (const roster of rosters) {
      teamManagersMap[year][roster.roster_id] = {
        team: getTeamData(processedUsers, roster.owner_id),
        managers: getManagers(roster, processedUsers),
        isEliminated: !!roster.settings.locked || !roster.owner_id,
      };
    }
  }
  const response = {
    currentSeason,
    teamManagersMap,
    users: finalUsers,
  };
  teamManagersStore.update(() => response);
  return response;
};

const processUsers = (rawUsers) => {
  let finalUsers = {};
  for (const user of rawUsers) {
    user.user_name = user.user_name ?? user.display_name;
    finalUsers[user.user_id] = user;
    const manager = managers.find((m) => m.managerID === user.user_id);
    if (manager) {
      finalUsers[user.user_id].display_name = manager.name;
    }
  }
  return finalUsers;
};

import {
  getBrackets,
  getLeagueChops,
  getLeagueMatchups, getLeagueRosters,
  getLeagueTeamManagers,
  loadPlayers,
} from "$lib/utils/helper";

export async function load({ url, fetch }) {
  const queryWeek = url?.searchParams?.get("week");

  const playersData = loadPlayers(fetch);

  const matchupsData = getLeagueMatchups(playersData);
  // matchupsData knows the week

  // being set incorrectly by the nav

  return {
    queryWeek: isNaN(queryWeek) ? null : queryWeek,
    matchupsData,
    chopsData: getLeagueChops(2, 1, playersData),
    // bracketsData: getBrackets(),
    leagueTeamManagersData: getLeagueTeamManagers(),
    // leagueRosters: getLeagueRosters(), // todo: use this to put fab on the page
    playersData,
  };
}

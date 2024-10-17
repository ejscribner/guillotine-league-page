import {
  getBrackets,
  getLeagueChops,
  getLeagueMatchups,
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
    chopsData: getLeagueChops(2, 2, playersData),
    bracketsData: getBrackets(),
    leagueTeamManagersData: getLeagueTeamManagers(),
    playersData,
  };
}

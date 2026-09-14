import {
  getBrackets,
  getLeagueChops,
  getLeagueRosters,
  getLeagueTeamManagers,
  loadPlayers,
} from "$lib/utils/helper";

export async function load({ url, fetch }) {
  const queryWeek = url?.searchParams?.get("week");

  const playersData = loadPlayers(fetch);

  return {
    queryWeek: isNaN(queryWeek) ? null : queryWeek,
    chopsData: getLeagueChops(2, 1, playersData),
    // bracketsData: getBrackets(),
    leagueTeamManagersData: getLeagueTeamManagers(),
    // leagueRosters: getLeagueRosters(), // todo: use this to put fab on the page
    playersData,
  };
}

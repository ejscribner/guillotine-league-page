import {getBrackets, getLeagueChops, getLeagueMatchups, getLeagueTeamManagers, loadPlayers} from '$lib/utils/helper';

export async function load({ url, fetch }) {
    const queryWeek = url?.searchParams?.get('week');

    const playersData = loadPlayers(fetch);

    const matchupsData = getLeagueMatchups(playersData);

    // todo: we need to fix the rosters upstream of this
    return {
        queryWeek: isNaN(queryWeek) ? null : queryWeek,
        matchupsData,
        // chopsData: getLeagueChops(2, 2),
        bracketsData: getBrackets(),
        leagueTeamManagersData: getLeagueTeamManagers(),
        playersData,
    };
}

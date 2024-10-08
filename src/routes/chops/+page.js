import {getBrackets, getLeagueChops, getLeagueMatchups, getLeagueTeamManagers, loadPlayers} from '$lib/utils/helper';

export async function load({ url, fetch }) {
    const queryWeek = url?.searchParams?.get('week');

    const playersData = loadPlayers(fetch);

    const matchupsData = getLeagueMatchups(playersData);
    // being set incorrectly by the nav
    // console.log('8989898')
    // console.log(queryWeek)
    
    return {
        queryWeek: isNaN(queryWeek) ? null : queryWeek,
        matchupsData,
        chopsData: getLeagueChops(2, 2, playersData),
        bracketsData: getBrackets(),
        leagueTeamManagersData: getLeagueTeamManagers(),
        playersData,
    };
}

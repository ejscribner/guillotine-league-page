import {getBrackets, getLeagueChops, getLeagueMatchups, getLeagueTeamManagers, loadPlayers} from '$lib/utils/helper';

export async function load({ url, fetch }) {
    const queryWeek = url?.searchParams?.get('week');


    // being set incorrectly by the nav
    // console.log('8989898')
    // console.log(queryWeek)
    
    return {
        queryWeek: isNaN(queryWeek) ? null : queryWeek,
        matchupsData: getLeagueMatchups(),
        chopsData: getLeagueChops(2, 2),
        bracketsData: getBrackets(),
        leagueTeamManagersData: getLeagueTeamManagers(),
        playersData: loadPlayers(fetch),
    };
}

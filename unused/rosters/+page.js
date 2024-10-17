import { getLeagueData, getLeagueRosters, getLeagueTeamManagers, loadPlayers, waitForAll } from '$lib/utils/helper';

export async function load({fetch}) {
    const rostersInfo = waitForAll(
        getLeagueData(),
        getLeagueRosters(),
        getLeagueTeamManagers(),
        loadPlayers(fetch),
    )

    // todo: getleaguerosters returns some empty players and leaves more on the bench

    return {
        rostersInfo
    };
}

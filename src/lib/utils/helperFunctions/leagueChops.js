import { getLeagueData } from "./leagueData"
import { leagueID } from '$lib/utils/leagueInfo';
import { getNflState } from "./nflState"
import { waitForAll } from './multiPromise';
import { get } from 'svelte/store';
import {matchupsStore} from '$lib/stores';

export const getLeagueChops = async (period, startWeek) => {
	// if(get(matchupsStore).matchupWeeks) {
	// 	return get(matchupsStore);
	// }

	const [nflState, leagueData] = await waitForAll(
		getNflState(),
		getLeagueData(),
	).catch((err) => { console.error(err); });

	let week = 1;
	if(nflState.season_type == 'regular') {
		week = nflState.display_week;
	} else if(nflState.season_type == 'post') {
		week = 18;
	}
	const year = leagueData.season;
	const numChopPeriods = (leagueData.settings.playoff_week_start - 1) / period;

	// pull in all matchup data for the season
	const matchupsPromises = [];
	for(let i = 1; i < leagueData.settings.playoff_week_start; i++) {
		matchupsPromises.push(fetch(`https://api.sleeper.app/v1/league/${leagueID}/matchups/${i}`, {compress: true}))
	}
	const matchupsRes = await waitForAll(...matchupsPromises);

	// convert the json matchup responses
	const matchupsJsonPromises = [];
	for(const matchupRes of matchupsRes) {
		const data = matchupRes.json();
		matchupsJsonPromises.push(data)
		if (!matchupRes.ok) {
			throw new Error(data);
		}
	}
	const matchupsData = await waitForAll(...matchupsJsonPromises).catch((err) => { console.error(err); }).catch((err) => { console.error(err); });

	// console.log(matchupsData);

	const chopPeriods = [];
	// process all the matchups
	let periodCounter = 1;
	// todo: we need to fix this loop up, its not right
	for(let i = startWeek - 1; periodCounter <= numChopPeriods; i += period) { // iterating each chop period
		const processed = processChops(matchupsData[i], matchupsData[i + 1], periodCounter);
		if(processed) {
			chopPeriods.push({
				teams: processed.teams,
				chopNumber: processed.chopNumber
			});
		}
		periodCounter++;
	}

	const matchupsResponse = {
		chopPeriods,
		year,
		numChopPeriods
	}

	matchupsStore.update(() => matchupsResponse);

	// console.log(matchupsResponse)

	return matchupsResponse;
}

const processChops = (weekA, weekB, chopNumber) => {
	if(!weekA || weekA.length == 0 || !weekB || weekB.length == 0) {
		return false;
	}


	// console.log('weekA')
	// console.log(weekA)
	// console.log('weekB')
	// console.log(weekB)

	const teams = [];
	for (const teamA of weekA) {
		// Find the corresponding team in weekB by roster_id
		const teamB = weekB.find(team => team.roster_id === teamA.roster_id);

		// Ensure the team exists in both weeks
		if (teamB) {
			teams.push({
				roster_id: teamA.roster_id,
				startersA: teamA.starters,
				startersB: teamB.starters, // Use starters from weekB
				pointsA: teamA.starters_points,
				pointsB: teamB.starters_points, // Use points from weekB
			});
		}
	}
	return {teams, chopNumber};
}

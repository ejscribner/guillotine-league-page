import { getLeagueData } from "./leagueData"
import { leagueID } from '$lib/utils/leagueInfo';
import { getNflState } from "./nflState"
import { waitForAll } from './multiPromise';
import { get } from 'svelte/store';
import {matchupsStore} from '$lib/stores';
import {getStarterPositions} from '$lib/utils/helperFunctions/predictOptimalScore.js';

export const setBestBallLineups = (matchupsData, playersMap, starterPositions) => {
	// players[string-id], players_points{id: pts} starters[string-id], starter_points[scores]
	// starter data sometimes not there, so check for null
	/*
	- array of nfl weeks
	- each week has an array of teams
	- ech team has an array of {players[string-id], players_points{id: pts} starters[string-id], starter_points[scores]}
	 */
	// console.log(matchupsData)
	// map all players by id to their profile {fn: string, ln: string, pos: string, t: string-team, wi: {p: string(proj), o: string(opponent)}[]}
	// console.log(playersMap)

	console.log(starterPositions)
	let localMatchupsData = structuredClone(matchupsData);

	// for (const week of matchupsData) {
	for (let weekIdx = 0; weekIdx < matchupsData.length; weekIdx++) {
		const week = matchupsData[weekIdx];
		console.log(week)
		// for (const team of week) {
		for (let teamIdx = 0; teamIdx < week.length; teamIdx++) {
			const team = week[teamIdx];
			if (!team.starters && team.players && team.players_points) {
				let newStarters = new Array(starterPositions.length).fill(0);
				// positionsTracker looks like this at start ['QB', 'RB', 'RB', 'WR', 'WR', 'TE', 'FLEX', 'FLEX']
				let positionsTracker = Array.from(starterPositions);
				const teamPlayers = team.players.map((playerId) => {
					if (playersMap.players[playerId].wi) {
						return {
							player: playersMap.players[playerId],
							playerId,
							projectedPoints: Number(playersMap.players[playerId].wi[weekIdx + 1].p)
						}
						// console.log(playersMap.players[playerId])
						// console.log(playersMap.players[playerId].wi[i + 1])
					}

				}).sort((a, b) => b.projectedPoints - a.projectedPoints); // sort by points descending

				console.log(teamPlayers)
				teamPlayers.forEach((player) => {
					if (player) {
						const playerPositionIdx = positionsTracker.indexOf(player.player.pos);

						if (playerPositionIdx !== -1 && newStarters[playerPositionIdx] === 0) {
							// Fill in the core position (QB, RB, WR, TE)
							newStarters[playerPositionIdx] = player.playerId;
							positionsTracker[playerPositionIdx] = null; // Mark the position as filled
						} else if (['RB', 'WR', 'TE'].includes(player.player.pos)) {
							// If core position is filled, try to fill a FLEX spot
							const flexPositionIdx = positionsTracker.indexOf('FLEX');
							if (flexPositionIdx !== -1 && newStarters[flexPositionIdx] === 0) {
								// Fill in the FLEX position
								newStarters[flexPositionIdx] = player.playerId;
								positionsTracker[flexPositionIdx] = null; // Mark the FLEX spot as filled
							}
						}
					}

				})
				console.log(newStarters)

				localMatchupsData[weekIdx][teamIdx].starters = newStarters;
				localMatchupsData[weekIdx][teamIdx].starters_points = new Array(newStarters.length).fill(0);

			} else if (team.starters && team.players && team.players_points) { // todo: better logic here
				// HANDLE THE CASE WHERE THE STARTERS ARE ALREADY SET, not use proj
				let newStarters = team.starters;
				const teamPlayers = team.players.map((playerId) => {
					return {
						player: playersMap.players[playerId],
						points: team.players_points[playerId]
					}
					// console.log(playersMap.players[playerId])
					// console.log(team.players_points[playerId])
				}).sort((a, b) => b.points - a.points); // sort by points descending

				// console.log(teamPlayers)
				teamPlayers.forEach((player) => {
					// console.log(player.points)
					// console.log(player.player.pos)
					// console.log(newStarters[starterPositions.indexOf(player.player.pos)])
					if (newStarters[starterPositions.indexOf(player.player.pos)] === 0) {
						console.log('start')
						// todo: check this once we have some data for the week
						// todo: handle starter_pointsf
						newStarters[starterPositions.indexOf(player.player.pos)] = player.player.id;
					}
				})
			}
		}
		console.log('---')
	}

	return localMatchupsData;

}


export const getLeagueMatchups = async (playersData) => {
	if(get(matchupsStore).matchupWeeks) {
		return get(matchupsStore);
	}

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
	const regularSeasonLength = leagueData.settings.playoff_week_start - 1;

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

	const playersMap = await playersData;

	const newMatchupsData = setBestBallLineups(matchupsData, playersMap, await getStarterPositions(leagueData));
	console.log('ABCDEFG')
	console.log(matchupsData)
	console.log(newMatchupsData)
	console.log('HIJKLMNOP')


	const matchupWeeks = [];
	// process all the matchups
	for(let i = 1; i < newMatchupsData.length + 1; i++) {
		const processed = processMatchups(newMatchupsData[i - 1], i);
		if(processed) {
			matchupWeeks.push({
				matchups: processed.matchups,
				week: processed.week
			});
		}
	}

	const matchupsResponse = {
		matchupWeeks,
		year,
		week,
		regularSeasonLength
	}
	
	matchupsStore.update(() => matchupsResponse);

	return matchupsResponse;
}

const processMatchups = (inputMatchups, week) => {
	if(!inputMatchups || inputMatchups.length == 0) {
		return false;
	}
	const matchups = {};
	for(const match of inputMatchups) {
		if(!matchups[match.matchup_id]) {
			matchups[match.matchup_id] = [];
		}
		matchups[match.matchup_id].push({
			roster_id: match.roster_id,
			starters: match.starters,
			points: match.starters_points,
		})
	}
	return {matchups, week};
}

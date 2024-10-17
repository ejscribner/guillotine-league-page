<script>
	import { MatchupsAndBrackets } from '$lib/components';

	export let data;
	const {queryWeek, matchupsData, bracketsData, playersData, leagueTeamManagersData} = data;
  // console.log(matchupsData) // includes lineups already with starters and bench, which are incorrect
  // todo: we need to fix the data upstream so that the starters and bench are correct
  // console.log(playersData) // array mapping player ids to their names, teams, positions, and projected scores
</script>

<style>
    #main {
        position: relative;
        z-index: 1;
    }
</style>

<div id="main">
    <MatchupsAndBrackets {queryWeek} {matchupsData} {bracketsData} {playersData} {leagueTeamManagersData} />
</div>

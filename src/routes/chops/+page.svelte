<script>
	import { MatchupsAndBrackets } from '$lib/components';
  import Chops from '$lib/Chops/Chops.svelte';

	export let data;
	const {queryWeek, matchupsData, chopsData, bracketsData, playersData, leagueTeamManagersData} = data;
</script>

<style>
    #main {
        position: relative;
        z-index: 1;
    }
</style>

<div id="main">
    <Chops {queryWeek} {chopsData} {matchupsData} {bracketsData} {playersData} {leagueTeamManagersData} />
</div>

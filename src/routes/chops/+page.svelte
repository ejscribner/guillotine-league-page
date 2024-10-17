<script>
  import { MatchupsAndBrackets } from "$lib/components";
  import Chops from "$lib/Chops/Chops.svelte";

  export let data;
  const {
    queryWeek,
    matchupsData,
    chopsData,
    bracketsData,
    playersData,
    leagueTeamManagersData,
  } = data;
</script>

<div id="main">
  <Chops
    {queryWeek}
    {chopsData}
    {matchupsData}
    {bracketsData}
    {playersData}
    {leagueTeamManagersData}
  />
</div>

<style>
  #main {
    position: relative;
    z-index: 1;
  }
</style>

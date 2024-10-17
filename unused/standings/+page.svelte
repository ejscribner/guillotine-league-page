<script>
  import { Standings } from "$lib/components";

  export let data;
  const { standingsData, leagueTeamManagersData } = data;
</script>

<div class="holder">
  <Standings {standingsData} {leagueTeamManagersData} />
</div>

<style>
  .holder {
    position: relative;
    z-index: 1;
    text-align: center;
  }
</style>

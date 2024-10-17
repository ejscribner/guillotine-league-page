<script>
  import { Drafts } from "$lib/components";

  export let data;
  const {
    upcomingDraftData,
    previousDraftsData,
    leagueTeamManagersData,
    playersData,
  } = data;
</script>

<div id="main">
  <Drafts
    {upcomingDraftData}
    {previousDraftsData}
    {leagueTeamManagersData}
    {playersData}
  />
</div>

<style>
  #main {
    position: relative;
    z-index: 1;
  }
</style>

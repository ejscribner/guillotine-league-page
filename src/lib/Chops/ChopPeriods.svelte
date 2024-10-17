<script>
  import { Icon } from "@smui/tab";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import TeamEntry from "$lib/Chops/TeamEntry.svelte";

  export let queryWeek,
    players,
    chopPeriods,
    matchupWeeks,
    year,
    week,
    regularSeasonLength,
    selection,
    leagueTeamManagers;

  let displayWeek = queryWeek * 1 || 1;

  onMount(() => {
    if (!queryWeek || queryWeek < 1) {
      queryWeek = week;
      displayWeek = queryWeek * 1;
      goto(`/chops?week=${queryWeek}`, { noscroll: true });
      if (queryWeek > regularSeasonLength) {
        selection = "champions";
        return;
      }
      // processDisplayMatchup(queryWeek)
      processDisplayChop(queryWeek);
      return;
    }
    if (queryWeek > regularSeasonLength) {
      selection = "champions";
      return;
    }
    // processDisplayMatchup(displayWeek)
    processDisplayChop(displayWeek);
  });

  let matchupArray = [];
  let teamArray = [];
  let weekA, weekB;

  // rand is used as a hacky way to make sure that the each block re-renders when the matchupArray changes
  // the new arrays are too similar to the old ones for Svelte to pick up the difference
  let rand;

  const processDisplayMatchup = (newWeek) => {
    const matchup = matchupWeeks[newWeek - 1];
    const allMatchups = matchup.matchups;
    matchupArray = [];
    for (const key in allMatchups) {
      matchupArray.push(allMatchups[key]);
    }
    rand = Math.random();
  };

  const processDisplayChop = (newWeek) => {
    const chop = chopPeriods[newWeek - 1];

    weekA = chop.weekA;
    weekB = chop.weekB;

    teamArray = chop.teams;

    // teamArray.sort((a, b) => {
    //     // Ensure eliminated teams are always at the end
    //     if (a.isEliminated && !b.isEliminated) return 1;
    //     if (!a.isEliminated && b.isEliminated) return -1;
    //
    //
    //     // Now handle the points comparison
    //     const totalA = a.pointsA.reduce((acc, cur) => acc + cur, 0) + a.pointsB.reduce((acc, cur) => acc + cur, 0);
    //     const totalB = b.pointsA.reduce((acc, cur) => acc + cur, 0) + b.pointsB.reduce((acc, cur) => acc + cur, 0);
    //     return totalB - totalA;
    // });

    rand = Math.random();
  };

  let active;

  const changeWeek = (newWeek) => {
    displayWeek = newWeek;
    // processDisplayMatchup(displayWeek);
    processDisplayChop(displayWeek);
    active = null;
    goto(`/chops?week=${displayWeek}`, { noscroll: true });
  };
</script>

<div class="matchups">
  <div class="weekContainer">
    {#if displayWeek > 1}
      <Icon
        class="material-icons changeWeek"
        on:click={() => changeWeek(displayWeek - 1)}>chevron_left</Icon
      >
    {:else}
      <span class="spacer" />
    {/if}
    <h3 class="weekText">{year} - Chop #{displayWeek}</h3>
    {#if displayWeek < matchupWeeks.length}
      <Icon
        class="material-icons changeWeek"
        on:click={() => changeWeek(displayWeek + 1)}>chevron_right</Icon
      >
    {:else}
      <span class="spacer" />
    {/if}
  </div>
  <div class="chopHeader">
    <div class="weekLabels">
      <p class="teamNameLabel">Team Name</p>
      <p class="weekLabel">Week {weekA}</p>
      <p class="weekLabel">Week {weekB}</p>
      <p class="weekLabel">Total</p>
    </div>
  </div>
  {#each teamArray as team, ix (rand * (ix + 1))}
    <TeamEntry
      {ix}
      {team}
      {players}
      {displayWeek}
      bind:active
      {leagueTeamManagers}
      {weekA}
      {weekB}
    />
  {/each}
</div>

<style>
  .matchups {
    margin: 2em 0 6em;
  }
  .weekContainer {
    display: flex;
    width: 95%;
    max-width: 600px;
    margin: 0 auto;
    align-items: center;
  }

  :global(.changeWeek) {
    font-size: 3em;
    cursor: pointer;
    color: #888;
  }

  :global(.changeWeek:hover) {
    color: #00316b;
  }

  .spacer {
    width: 48px;
  }

  .weekText {
    flex-grow: 1;
    text-align: center;
    font-size: 2em;
  }

  @media (max-width: 800px) {
    .weekText {
      font-size: 1.6em;
    }
  }

  @media (max-width: 400px) {
    .weekText {
      font-size: 1.3em;
    }
  }

  @media (max-width: 350px) {
    .weekText {
      font-size: 1.2em;
    }
  }

  .chopHeader {
    display: flex;
    flex-direction: column;
    width: 95%;
    max-width: 600px;
    margin: 0 auto;
  }

  .weekLabels {
    display: flex;
    gap: 20px;
    padding: 1px 2%;
  }

  .weekLabel {
    width: 68px;
    text-align: right;
  }

  .teamNameLabel {
    flex-grow: 1;
  }
</style>

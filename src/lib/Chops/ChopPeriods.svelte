<script>
  import { Icon } from "@smui/tab";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import TeamEntry from "$lib/Chops/TeamEntry.svelte";

  export let queryWeek,
    players,
    chopPeriods,
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
      processDisplayChop(queryWeek);
      return;
    }
    if (queryWeek > regularSeasonLength) {
      selection = "champions";
      return;
    }
    processDisplayChop(displayWeek);
  });

  let teamArray = [];
  let weekA, weekB;

  // rand is used as a hacky way to make sure that the each block re-renders when the teamArray changes
  // the new arrays are too similar to the old ones for Svelte to pick up the difference
  let rand;

  // "actual" once real scores exist, teams are tied at 0 beforehand so this
  // already falls back to projected order (see sortTeams) - no separate state needed pre-kickoff
  let sortBy = "actual";

  // the matchup data's own totalProjectedPoints is only populated for weeks
  // that haven't been played yet (see setBestBallLineups), so it's NaN for
  // any already-played week - recompute it here instead. This mirrors
  // TeamEntry's own per-player display total (actual points once a player
  // has scored, their weekly projection otherwise) so the sort/diff always
  // agree with the number already on screen instead of silently swapping it
  // for a different "pure pre-game projection" figure.
  const sumBlendedPoints = (starters, points, week) =>
    (starters || []).reduce((sum, playerId, i) => {
      if (!playerId || playerId == 0) return sum;
      const actual = points?.[i] || 0;
      if (actual !== 0) return sum + actual;
      const proj = players?.[playerId]?.wi?.[week]?.p;
      return sum + (proj ? parseFloat(proj) : 0);
    }, 0);

  const sortTeams = (teams) => {
    const sorted = [...teams];
    sorted.sort((a, b) => {
      if (sortBy === "projected") {
        return b.projectedTotal - a.projectedTotal;
      }
      if (a.totalPoints !== b.totalPoints) {
        return b.totalPoints - a.totalPoints;
      }
      return b.projectedTotal - a.projectedTotal;
    });
    return sorted;
  };

  const processDisplayChop = (newWeek) => {
    const chop = chopPeriods[newWeek - 1];

    weekA = chop.weekA;
    weekB = chop.weekB;

    const teamsWithProjections = chop.teams.map((team) => ({
      ...team,
      projectedTotal:
        sumBlendedPoints(team.startersA, team.pointsA, weekA) +
        sumBlendedPoints(team.startersB, team.pointsB, weekB),
    }));

    teamArray = sortTeams(teamsWithProjections);

    rand = Math.random();
  };

  const toggleSort = () => {
    sortBy = sortBy === "actual" ? "projected" : "actual";
    teamArray = sortTeams(teamArray);
    rand = Math.random();
  };

  // once any real points are in, let the user compare against the gap to the team above them
  $: hasActualPoints = teamArray.some((team) => team.totalPoints > 0);

  $: sortMetric = sortBy === "projected" ? "projectedTotal" : "totalPoints";
  $: diffs = teamArray.map((team, ix) =>
    ix === 0 ? null : Math.max(0, teamArray[ix - 1][sortMetric] - team[sortMetric])
  );

  let active;

  const changeWeek = (newWeek) => {
    displayWeek = newWeek;
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
    {#if displayWeek < chopPeriods.length}
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
      <p class="teamNameLabel">
        Team Name
        {#if hasActualPoints}
          <span class="sortToggle" on:click={toggleSort}>
            <Icon class="material-icons sortIcon">swap_vert</Icon>
            Sort: {sortBy === "actual" ? "Actual" : "Projected"}
          </span>
        {/if}
      </p>
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
      diff={hasActualPoints ? diffs[ix] : null}
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
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .sortToggle {
    display: flex;
    align-items: center;
    font-size: 0.85em;
    font-weight: normal;
    text-transform: none;
    color: #888;
    cursor: pointer;
  }

  .sortToggle:hover {
    color: #00316b;
  }

  :global(.sortIcon) {
    font-size: 1.2em;
    height: 18px;
    width: 18px;
  }
</style>

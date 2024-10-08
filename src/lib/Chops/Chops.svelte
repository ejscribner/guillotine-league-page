
<script>
	import LinearProgress from '@smui/linear-progress';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { loadPlayers } from '$lib/utils/helper';
  import ChopPeriods from '$lib/Chops/ChopPeriods.svelte';

	export let queryWeek, leagueTeamManagersData, matchupsData, chopsData, playersData;

    let players, matchupWeeks, chopPeriods, year, week, regularSeasonLength, leagueTeamManagers;

    let loading = true;

  // console.log(chopsData)

    onMount(async () => {
        const matchupsInfo = await matchupsData;
        leagueTeamManagers = await leagueTeamManagersData;
        matchupWeeks = matchupsInfo.matchupWeeks;
        chopPeriods = chopsData.chopPeriods;
        year = matchupsInfo.year;
        week = matchupsInfo.week;
        regularSeasonLength = matchupsInfo.regularSeasonLength;
        const playersInfo = await playersData;
        players = playersInfo.players;
        loading = false;

        if(playersInfo.stale) {
            const newPlayersInfo = await loadPlayers(null, true);
            players = newPlayersInfo.players;
        }
    });

    const changeSelection = (s) => {
        if(s == 'regular') {
            queryWeek = 1;
            goto(`/chops?week=1`, {noscroll: true});
        } else if(selection == 'regular') {
            queryWeek = 99;
            goto(`/chops?week=99`, {noscroll: true});
        }
        selection = s;
    }

    let selection = 'regular';
</script>

<style>
    .message {
        display: block;
        width: 85%;
        max-width: 500px;
        margin: 80px auto;
    }

    .buttonHolder {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 3em 0;
    }
</style>



{#if loading}
    <!-- promise is pending -->
    <div class="message">
        <p>Loading chop periods...</p>
        <LinearProgress indeterminate />
    </div>
{:else}
    {#if matchupWeeks.length}
        <ChopPeriods {players} {queryWeek} {chopPeriods} {matchupWeeks} {regularSeasonLength} {year} {week} bind:selection={selection} {leagueTeamManagers} />
    {:else}
        <div class="message">
            <p>No upcoming chops...</p>
        </div>
    {/if}
{/if}

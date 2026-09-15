import { leagueID, regularSeasonLength } from "$lib/utils/leagueInfo";
import { round } from "$lib/utils/helperFunctions/universalFunctions";
import { waitForAll } from "$lib/utils/helperFunctions/multiPromise";
import { timeoutSignal } from "$lib/utils/helperFunctions/fetchTimeout";
import { json, error } from "@sveltejs/kit";

// This endpoint fans out 20+ requests to Sleeper (the full player list plus a
// projections call per week), so it's cached both here (to survive reuse of a
// warm serverless instance) and via the Cache-Control header below (so
// Vercel's edge serves repeat requests without invoking the function at all).
const CACHE_TTL_MS = 30 * 60 * 1000;
const CACHE_CONTROL = "public, max-age=0, s-maxage=1800, stale-while-revalidate=3600";
let cachedPlayers = null;
let cachedAt = 0;

export async function GET() {
  if (cachedPlayers && Date.now() - cachedAt < CACHE_TTL_MS) {
    return json(cachedPlayers, { headers: { "Cache-Control": CACHE_CONTROL } });
  }

  // get NFL state from sleeper (week and year)
  const [nflStateRes, leagueDataRes] = await waitForAll(
    fetch(`https://api.sleeper.app/v1/state/nfl`, {
      compress: true,
      signal: timeoutSignal(),
    }),
    fetch(`https://api.sleeper.app/v1/league/${leagueID}`, {
      compress: true,
      signal: timeoutSignal(),
    })
  );

  const [nflState, leagueData] = await waitForAll(
    nflStateRes.json(),
    leagueDataRes.json()
  );

  let year = nflState.league_season;

  const resPromises = [
    fetch(`https://api.sleeper.app/v1/players/nfl`, {
      compress: true,
      signal: timeoutSignal(20000),
    }),
  ];

  for (let week = 1; week <= regularSeasonLength + 3; week++) {
    resPromises.push(
      fetch(
        `https://api.sleeper.app/projections/nfl/${year}/${week}?season_type=regular&position[]=DB&position[]=DEF&position[]=DL&position[]=FLEX&position[]=IDP_FLEX&position[]=K&position[]=LB&position[]=QB&position[]=RB&position[]=REC_FLEX&position[]=SUPER_FLEX&position[]=TE&position[]=WR&position[]=WRRB_FLEX&order_by=ppr`,
        { compress: true, signal: timeoutSignal() }
      )
    );
  }

  const responses = await waitForAll(...resPromises);

  const resJSONs = [];
  for (const res of responses) {
    if (!res.ok) {
      throw error(500, "No luck");
    }
    resJSONs.push(res.json());
  }

  const weeklyData = await waitForAll(...resJSONs);

  const playerData = weeklyData.shift(); // first item is all player data, remaining items are weekly data for projections

  const scoringSettings = leagueData.scoring_settings;

  const computedPlayers = computePlayers(playerData, weeklyData, scoringSettings);

  cachedPlayers = computedPlayers;
  cachedAt = Date.now();

  return json(computedPlayers, { headers: { "Cache-Control": CACHE_CONTROL } });
}

const computePlayers = (playerData, weeklyData, scoringSettings) => {
  const computedPlayers = {};

  // create non weekly dependent player info
  for (const id in playerData) {
    const projPlayer = playerData[id];
    const player = {
      // injury_notes: projPlayer.injury_notes,
      fn: projPlayer.first_name,
      ln: projPlayer.last_name,
      pos: projPlayer.position,
    };
    if (projPlayer.team) {
      player.t = projPlayer.team;
      player.wi = {};
    }
    if (projPlayer.team && projPlayer.injury_status) {
      player.is = projPlayer.injury_status;
    }

    computedPlayers[id] = player;
  }

  // add weekly projections
  for (let week = 1; week <= weeklyData.length; week++) {
    for (const player of weeklyData[week - 1]) {
      const id = player.player_id;

      // check if the player is active in the NFL
      if (computedPlayers[id] == null || !computedPlayers[id].wi) continue;

      computedPlayers[id].wi[week] = {
        p: calculateProjection(player.stats, scoringSettings),
        o: player.opponent,
      };
    }
  }

  computedPlayers["OAK"] = computedPlayers["LV"];
  return computedPlayers;
};

const calculateProjection = (projectedStats, scoreSettings) => {
  let score = 0;
  for (const stat in projectedStats) {
    const multiplier = scoreSettings[stat] ? scoreSettings[stat] : 0;
    score += projectedStats[stat] * multiplier;
  }
  return round(score);
};

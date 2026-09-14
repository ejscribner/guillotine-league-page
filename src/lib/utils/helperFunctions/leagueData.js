import { get } from "svelte/store";
import { leagueData } from "$lib/stores";
import { leagueID } from "$lib/utils/leagueInfo";
import { timeoutSignal } from "./fetchTimeout";

export const getLeagueData = async (queryLeagueID = leagueID) => {
  if (get(leagueData)[queryLeagueID]) {
    return get(leagueData)[queryLeagueID];
  }
  const res = await fetch(
    `https://api.sleeper.app/v1/league/${queryLeagueID}`,
    { compress: true, signal: timeoutSignal() }
  );
  const data = await res.json();

  if (res.ok) {
    leagueData.update((ld) => {
      ld[queryLeagueID] = data;
      return ld;
    });
    return data;
  } else {
    throw new Error(data);
  }
};

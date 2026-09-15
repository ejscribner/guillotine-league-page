import { get } from "svelte/store";
import { nflState } from "$lib/stores";
import { timeoutSignal } from "./fetchTimeout";

export const getNflState = async () => {
  if (get(nflState).season) {
    return get(nflState);
  }
  const res = await fetch(`https://api.sleeper.app/v1/state/nfl`, {
    compress: true,
    signal: timeoutSignal(),
  });
  const data = await res.json();

  if (res.ok) {
    nflState.update(() => data);
    return data;
  } else {
    throw new Error(data);
  }
};

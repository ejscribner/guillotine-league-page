// Sleeper's API has no SLA, and a hung request otherwise stalls the whole
// page load indefinitely. Aborting turns a silent hang into a catchable error.
export const DEFAULT_TIMEOUT_MS = 10000;

export const timeoutSignal = (ms = DEFAULT_TIMEOUT_MS) => AbortSignal.timeout(ms);

// Pin trailing-slash handling for every route so client-side navigation and
// server-rendered requests always agree on the canonical URL form. Without
// this, the root route's implicit trailing slash was leaking into
// client-side goto() calls to sibling routes (e.g. /chops -> /chops/),
// which the server then 308-redirected away from - a redirect SvelteKit's
// client-side data fetch doesn't always follow the same way a full page
// navigation does, surfacing as a failed navigation on some deployments.
export const trailingSlash = "never";

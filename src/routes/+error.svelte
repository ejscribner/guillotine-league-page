<script>
  import { page } from "$app/stores";
</script>

<div class="main">
  {#if $page.status === 404}
    <h4>Hut, Hut, Blue 404!</h4>
    <div class="footballHolder">
      <img
        class="football"
        src="/deflated-football.png"
        alt="deflated football"
      />
    </div>
    <h5>Nothing Here... Try Another Page!</h5>
  {:else}
    <h4>Something Went Wrong ({$page.status})</h4>
    <div class="footballHolder">
      <img
        class="football"
        src="/deflated-football.png"
        alt="deflated football"
      />
    </div>
    <h5>{$page.error?.message ?? "Please try refreshing the page."}</h5>
  {/if}
</div>

<style>
  .main {
    position: relative;
    z-index: 1;
  }

  h4,
  h5 {
    text-align: center;
  }

  .footballHolder {
    text-align: center;
    padding: 2em 0;
  }

  h4 {
    color: var(--blueOne);
    font-weight: 700;
    margin: 3em 0 1em;
  }

  .football {
    width: 80%;
    max-width: 300px;
    height: auto;
  }
</style>

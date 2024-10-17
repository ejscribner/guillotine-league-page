<script>
  import Drawer, { Content, Header, Title } from "@smui/drawer";
  import { Icon } from "@smui/tab";
  import List, { Item, Text, Graphic, Separator, Subheader } from "@smui/list";
  import { goto, preloadData } from "$app/navigation";
  import { leagueName } from "$lib/utils/helper";
  import { enableBlog, managers } from "$lib/utils/leagueInfo";

  export let active, tabs;

  let open = false;

  const selectTab = (tab) => {
    open = false;
    goto(tab.dest);
  };
</script>

<Icon class="material-icons menuIcon" on:click={() => (open = true)}>menu</Icon>

<div
  class="nav-back"
  style="pointer-events: {open ? 'visible' : 'none'}; opacity: {open ? 1 : 0};"
  on:click={() => (open = false)}
/>

<Drawer variant="modal" class="nav-drawer" fixed={true} bind:open>
  <Header>
    <Title>{leagueName}</Title>
  </Header>
  <Content>
    <List>
      {#each tabs as tab}
        {#if !tab.nest && (tab.label != "Blog" || (tab.label == "Blog" && enableBlog))}
          <Item
            href="javascript:void(0)"
            on:click={() => selectTab(tab)}
            on:touchstart={() => preloadData(tab.dest)}
            on:mouseover={() => preloadData(tab.dest)}
            activated={active == tab.dest}
          >
            {#if tab.icon === "custom-guillotine"}
              <Graphic
                class="material-icons{active == tab.dest ? '' : ' nav-item'}"
                aria-hidden="true"
              >
                <svg
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  width="24"
                  height="24"
                  ><defs /><title>guillotine-glyph</title><path
                    d="M435.2,512A12.8,12.8,0,0,0,448,499.2V76.8h25.6A12.8,12.8,0,0,0,486.4,64V12.8A12.8,12.8,0,0,0,473.6,0H38.4A12.8,12.8,0,0,0,25.6,12.8V64A12.8,12.8,0,0,0,38.4,76.8H64V499.2A12.8,12.8,0,0,0,76.8,512ZM140.8,76.8H243.2v44.8h-64a12.8,12.8,0,0,0-12.8,12.8v51.2a12.8,12.8,0,0,0,8.75,12.14l153.6,51.2A12.8,12.8,0,0,0,345.6,236.8V134.4a12.8,12.8,0,0,0-12.8-12.8h-64V76.8H371.2V384h-64a12.8,12.8,0,0,0-12.8,12.8,38.4,38.4,0,1,1-76.8,0A12.8,12.8,0,0,0,204.8,384h-64Z"
                  /></svg
                >
              </Graphic>
            {:else}
              <Graphic
                class="material-icons{active == tab.dest ? '' : ' nav-item'}"
                aria-hidden="true">{tab.icon}</Graphic
              >
            {/if}

            <Text class={active == tab.dest ? "" : "nav-item"}>{tab.label}</Text
            >
          </Item>
        {/if}
      {/each}
      {#each tabs as tab}
        {#if tab.nest}
          <Separator />
          <Subheader>{tab.label}</Subheader>
          {#each tab.children as subTab}
            {#if subTab.label == "Managers"}
              {#if managers.length}
                <Item
                  href="javascript:void(0)"
                  on:click={() => selectTab(subTab)}
                  activated={active == subTab.dest}
                  on:touchstart={() => preloadData(subTab.dest)}
                  on:mouseover={() => preloadData(subTab.dest)}
                >
                  <Graphic
                    class="material-icons{active == subTab.dest
                      ? ''
                      : ' nav-item'}"
                    aria-hidden="true">{subTab.icon}</Graphic
                  >
                  <Text class={active == subTab.dest ? "" : "nav-item"}
                    >{subTab.label}</Text
                  >
                </Item>
              {/if}
            {:else}
              <Item
                href="javascript:void(0)"
                on:click={() => selectTab(subTab)}
                activated={active == subTab.dest}
                on:touchstart={() => {
                  if (subTab.label != "Go to Sleeper") preloadData(subTab.dest);
                }}
                on:mouseover={() => {
                  if (subTab.label != "Go to Sleeper") preloadData(subTab.dest);
                }}
              >
                <Graphic
                  class="material-icons{active == subTab.dest
                    ? ''
                    : ' nav-item'}"
                  aria-hidden="true">{subTab.icon}</Graphic
                >
                <Text class={active == subTab.dest ? "" : "nav-item"}
                  >{subTab.label}</Text
                >
              </Item>
            {/if}
          {/each}
        {/if}
      {/each}
    </List>
  </Content>
</Drawer>

<style>
  :global(.menuIcon) {
    position: absolute;
    top: 15px;
    left: 15px;
    font-size: 2em;
    color: #888;
    padding: 6px;
    cursor: pointer;
  }

  :global(.menuIcon:hover) {
    color: #00316b;
  }

  :global(.nav-drawer) {
    z-index: 5;
    top: 0;
    left: 0;
  }

  :global(.nav-item) {
    color: #858585 !important;
  }

  .nav-back {
    position: fixed;
    z-index: 4;
    width: 100%;
    width: 100vw;
    height: 100%;
    height: 100vh;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.32);
    transition: all 0.7s;
  }
</style>

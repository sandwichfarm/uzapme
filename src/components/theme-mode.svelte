<script lang="ts">
  import { onMount } from 'svelte';
  import { theme } from '../stores/theme';
  import { browser } from '$app/environment';

  let darkMode = true;

  // Toggle theme function
  function handleSwitchDarkMode() {
    darkMode = !darkMode;
    const newTheme = darkMode ? 'dark' : 'light';
    theme.setTheme(newTheme);
  }

  // Initialize the darkMode variable
  onMount(() => {
    if (browser) {
      darkMode = $theme === 'dark';
    }
  });

  // Subscribe to theme changes
  $: $theme;
</script>


<div class={$$props.class}>
  <input
    checked={darkMode}
    on:change={handleSwitchDarkMode}
    type="checkbox"
    id="theme-toggle"
  />
  <label for="theme-toggle" />
</div>

<style lang="postcss">
  #theme-toggle {
    @apply invisible;
  }

  #theme-toggle + label {
    @apply inline-block cursor-pointer h-8 w-8 rounded-full duration-300;
  }

  #theme-toggle:not(:checked) + label {
    @apply bg-amber-400;
  }

  #theme-toggle:checked + label {
    @apply bg-transparent;
    box-shadow: inset -12px -10px 1px 1px #ddd;
  }
</style>
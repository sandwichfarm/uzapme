<script>
  import '../app.css';
  import { onMount } from 'svelte';
  import { theme } from '../stores/theme';
  import ThemeSwitcher from '../components/theme-mode.svelte';

  onMount(() => {
    theme.initTheme();
  });
</script>

<div class="min-h-screen bg-gray-100 dark:bg-gray-900">
  <div class="container mx-auto p-4">
    <div class="flex justify-end">
      <ThemeSwitcher />
    </div>
    <div class="bg-white dark:bg-gray-800 rounded-lg mt-4 p-6 shadow-md">
      <slot />
    </div>
  </div>
</div>

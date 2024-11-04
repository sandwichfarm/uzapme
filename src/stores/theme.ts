import { writable } from 'svelte/store';
import { browser } from '$app/environment';

function createThemeStore() {
  const defaultTheme = 'light';
  const { subscribe, set } = writable(defaultTheme);

  const setTheme = (value: string) => {
    set(value);
    if (browser) {
      localStorage.setItem('theme', value);
      if (value === 'dark') {
        document.documentElement.classList.add('dark');
        document.body.classList.add('theme-dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('theme-dark');
      }
    }
  };

  const initTheme = () => {
    if (browser) {
      const storedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');
      setTheme(initialTheme);
    }
  };

  return {
    subscribe,
    setTheme,
    initTheme,
  };
}

export const theme = createThemeStore();
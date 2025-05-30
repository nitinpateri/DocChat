// src/utils/theme.js
export function setThemeOnLoad() {
  const theme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (theme === 'dark' || (!theme && prefersDark)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

export function setTheme(mode) {
  if (mode === 'system') {
    localStorage.removeItem('theme');
  } else {
    localStorage.setItem('theme', mode);
  }
  setThemeOnLoad(); // Re-apply immediately after changing
}

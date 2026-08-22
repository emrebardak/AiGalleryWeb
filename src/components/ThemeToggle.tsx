import { useState } from 'react';
import { Sun, Moon } from 'lucide-react';

function getInitialDark() {
  return document.documentElement.classList.contains('dark');
}

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(getInitialDark);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className="fixed right-4 top-4 z-50 rounded-full bg-zinc-50/90 p-2 text-zinc-950 shadow-lg backdrop-blur-sm transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-zinc-950/90 dark:text-zinc-50"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

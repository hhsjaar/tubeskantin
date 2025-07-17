'use client';
import { useTheme } from '@/context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      style={{
        backgroundColor: isDarkMode ? '#479c26' : '#E5E7EB'
      }}
      aria-label="Toggle theme"
    >
      <span
        className={`${isDarkMode ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ease-in-out relative overflow-hidden shadow-md flex items-center justify-center`}
      >
        {isDarkMode ? (
          <Moon className="h-3 w-3 text-gray-800 absolute" />
        ) : (
          <Sun className="h-3 w-3 text-yellow-500 absolute" />
        )}
      </span>
    </button>
  );
};

export default ThemeToggle;
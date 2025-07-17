'use client';
import { useState, useRef, useEffect } from 'react';
import { UserButton } from '@clerk/nextjs';
import { useTheme } from '@/context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

const UserMenuWithTheme = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Tutup menu saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar button yang bisa diklik */}
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        <UserButton afterSignOutUrl="/" />
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
          {/* Toggle tema dengan tampilan switch */}
          <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between">
            <span>{isDarkMode ? 'Mode Terang' : 'Mode Gelap'}</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                toggleTheme();
              }}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isDarkMode ? 'bg-green-500' : 'bg-gray-300'}`}
            >
              <span 
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}`}
              >
                {isDarkMode ? (
                  <Sun className="h-3 w-3 text-yellow-500 m-1" />
                ) : (
                  <Moon className="h-3 w-3 text-gray-600 m-1" />
                )}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenuWithTheme;
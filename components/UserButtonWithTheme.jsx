'use client';
import { UserButton } from '@clerk/nextjs';
import { useAppContext } from '@/context/AppContext';
import { Moon, Sun } from 'lucide-react';

// ... existing code ...
const UserButtonWithTheme = () => {
  const { isDarkMode, toggleTheme } = useAppContext();

  return (
    <UserButton afterSignOutUrl="/">
      <UserButton.Action
        label={isDarkMode ? "Mode Terang" : "Mode Gelap"}
        labelIcon={isDarkMode ? <Sun className="w-4 h-4 text-yellow-500" /> : <Moon className="w-4 h-4 text-gray-600" />}
        onClick={toggleTheme}
      />
    </UserButton>
  );
};
// ... existing code ...
export default UserButtonWithTheme;
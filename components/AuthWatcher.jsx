'use client';
import { useEffect } from 'react';
import { useClerk } from '@clerk/nextjs';

const AuthWatcher = () => {
  const { clerk } = useClerk();

  useEffect(() => {
    if (!clerk) return;

    const removeListener = clerk.addListener(({ user }) => {
      if (!user && typeof window !== 'undefined') {
        console.log("User logged out — refreshing page...");
        window.location.reload(); // atau arahkan: window.location.href = "/";
      }
    });

    return () => {
      removeListener?.(); // pastikan removeListener tersedia
    };
  }, [clerk]);

  return null;
};

export default AuthWatcher;

'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';
import { useClerk, UserButton } from '@clerk/nextjs';
import NotificationBell from './NotificationBeli';
import { Menu, X } from 'lucide-react';
import {
  assets,
  BagIcon,
  BoxIcon,
  CartIcon,
  HomeIcon,
} from '@/assets/assets';

const Navbar = () => {
  const {
    isSeller,
    isBem,
    isKandok,
    router,
    user
  } = useAppContext();

  const { openSignIn } = useClerk();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileOpen(false);
    }
  };

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Image
            onClick={() => router.push('/')}
            src={assets.logo}
            alt="logo"
            className="w-28 md:w-32 cursor-pointer"
          />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/">Beranda</Link>
          <Link href="/menu">Menu</Link>
          <Link href="/my-orders">Pesanan</Link>
          <Link href="/trashback">TrashBack</Link>

          {isSeller && (
            <button onClick={() => router.push('/seller')} className="border text-xs px-3 py-1 rounded-full">
              Admin
            </button>
          )}
          {isBem && (
            <button onClick={() => router.push('/bem-dashboard')} className="border text-xs px-3 py-1 rounded-full">
              BEM
            </button>
          )}
          {isKandok && (
            <button onClick={() => router.push('/kandok')} className="border text-xs px-3 py-1 rounded-full">
              Kandok
            </button>
          )}
        </div>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-4">
          <NotificationBell />
          <form onSubmit={handleSearch} className="flex border rounded px-2 py-1 items-center">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="text-sm outline-none w-32"
            />
            <button type="submit">
              <Image src={assets.search_icon} alt="search" className="w-4 h-4" />
            </button>
          </form>
          {user ? (
            <UserButton />
          ) : (
            <button onClick={openSignIn}>
              <Image src={assets.user_icon} alt="user icon" />
            </button>
          )}
        </div>

        {/* Mobile Right (Notification + Hamburger) */}
        <div className="flex items-center gap-3 md:hidden">
          <NotificationBell />
          <button onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden px-6 pb-6 space-y-3 text-sm font-medium border-t bg-white">
          <Link href="/" onClick={() => setMobileOpen(false)} className="block py-2 border-b">Beranda</Link>
          <Link href="/menu" onClick={() => setMobileOpen(false)} className="block py-2 border-b">Menu</Link>
          <Link href="/my-orders" onClick={() => setMobileOpen(false)} className="block py-2 border-b">Pesanan</Link>
          <Link href="/trashback" onClick={() => setMobileOpen(false)} className="block py-2 border-b">TrashBack</Link>

          {(isSeller || isBem || isKandok) && <hr className="my-3" />}

          {isSeller && (
            <button onClick={() => { router.push('/seller'); setMobileOpen(false); }} className="block text-left w-full py-2 border-b">
              Admin Dashboard
            </button>
          )}
          {isBem && (
            <button onClick={() => { router.push('/bem-dashboard'); setMobileOpen(false); }} className="block text-left w-full py-2 border-b">
              BEM Dashboard
            </button>
          )}
          {isKandok && (
            <button onClick={() => { router.push('/kandok'); setMobileOpen(false); }} className="block text-left w-full py-2 border-b">
              Kandok Dashboard
            </button>
          )}

          <form onSubmit={handleSearch} className="flex border rounded px-2 py-1 items-center mt-2">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="text-sm outline-none w-full"
            />
            <button type="submit">
              <Image src={assets.search_icon} alt="search" className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-4">
            {user ? (
              <UserButton />
            ) : (
              <button onClick={openSignIn} className="flex items-center gap-2">
                <Image src={assets.user_icon} alt="user icon" />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

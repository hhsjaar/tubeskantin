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
            className="w-28 md:w-32 cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out"
          />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/" className="text-gray-700 hover:text-[#479c26] transition-colors duration-200 relative group">
            <span>Beranda</span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#479c26] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/menu" className="text-gray-700 hover:text-[#479c26] transition-colors duration-200 relative group">
            <span>Menu</span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#479c26] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/my-orders" className="text-gray-700 hover:text-[#479c26] transition-colors duration-200 relative group">
            <span>Pesanan</span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#479c26] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/trashback" className="text-gray-700 hover:text-[#479c26] transition-colors duration-200 relative group">
            <span>TrashBack</span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#479c26] transition-all duration-300 group-hover:w-full"></span>
          </Link>

          {isSeller && (
            <button 
              onClick={() => router.push('/seller')} 
              className="bg-white text-[#479c26] border border-[#479c26] hover:bg-[#479c26]/10 transition-all duration-300 text-xs px-4 py-2 rounded-full shadow-sm hover:shadow-md"
            >
              Admin
            </button>
          )}
          {isBem && (
            <button 
              onClick={() => router.push('/bem-dashboard')} 
              className="bg-white text-[#479c26] border border-[#479c26] hover:bg-[#479c26]/10 transition-all duration-300 text-xs px-4 py-2 rounded-full shadow-sm hover:shadow-md"
            >
              BEM
            </button>
          )}
          {isKandok && (
            <button 
              onClick={() => router.push('/kandok')} 
              className="bg-white text-[#479c26] border border-[#479c26] hover:bg-[#479c26]/10 transition-all duration-300 text-xs px-4 py-2 rounded-full shadow-sm hover:shadow-md"
            >
              Kandok
            </button>
          )}
        </div>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-4">
          <NotificationBell />
          <form onSubmit={handleSearch} className="flex border border-gray-200 hover:border-[#479c26] rounded-full px-4 py-2 items-center transition-colors duration-300 group">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="text-sm outline-none w-32 text-gray-600 placeholder-gray-400"
            />
            <button type="submit" className="group-hover:scale-110 transition-transform duration-200">
              <Image src={assets.search_icon} alt="search" className="w-4 h-4" />
            </button>
          </form>
          {user ? (
            <UserButton />
          ) : (
            <button 
              onClick={openSignIn}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-300"
            >
              <Image src={assets.user_icon} alt="user icon" />
            </button>
          )}
        </div>

        {/* Mobile Right */}
        <div className="flex items-center gap-3 md:hidden">
          <NotificationBell />
          <button 
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors duration-300"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden px-6 pb-6 space-y-4 text-sm font-medium border-t bg-white shadow-lg">
          <Link 
            href="/" 
            onClick={() => setMobileOpen(false)} 
            className="block py-3 border-b border-gray-100 text-gray-700 hover:text-[#479c26] transition-colors duration-300"
          >
            Beranda
          </Link>
          <Link 
            href="/menu" 
            onClick={() => setMobileOpen(false)} 
            className="block py-3 border-b border-gray-100 text-gray-700 hover:text-[#479c26] transition-colors duration-300"
          >
            Menu
          </Link>
          <Link 
            href="/my-orders" 
            onClick={() => setMobileOpen(false)} 
            className="block py-3 border-b border-gray-100 text-gray-700 hover:text-[#479c26] transition-colors duration-300"
          >
            Pesanan
          </Link>
          <Link 
            href="/trashback" 
            onClick={() => setMobileOpen(false)} 
            className="block py-3 border-b border-gray-100 text-gray-700 hover:text-[#479c26] transition-colors duration-300"
          >
            TrashBack
          </Link>

          {(isSeller || isBem || isKandok) && <hr className="my-4 border-gray-100" />}

          {isSeller && (
            <button 
              onClick={() => { router.push('/seller'); setMobileOpen(false); }} 
              className="block text-left w-full py-3 border-b border-gray-100 text-gray-700 hover:text-[#479c26] transition-colors duration-300"
            >
              Admin Dashboard
            </button>
          )}
          {isBem && (
            <button 
              onClick={() => { router.push('/bem-dashboard'); setMobileOpen(false); }} 
              className="block text-left w-full py-3 border-b border-gray-100 text-gray-700 hover:text-[#479c26] transition-colors duration-300"
            >
              BEM Dashboard
            </button>
          )}
          {isKandok && (
            <button 
              onClick={() => { router.push('/kandok'); setMobileOpen(false); }} 
              className="block text-left w-full py-3 border-b border-gray-100 text-gray-700 hover:text-[#479c26] transition-colors duration-300"
            >
              Kandok Dashboard
            </button>
          )}

          <form onSubmit={handleSearch} className="flex border border-gray-200 hover:border-[#479c26] rounded-full px-4 py-2 items-center mt-4 transition-colors duration-300 group">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="text-sm outline-none w-full text-gray-600 placeholder-gray-400"
            />
            <button type="submit" className="group-hover:scale-110 transition-transform duration-200">
              <Image src={assets.search_icon} alt="search" className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-4">
            {user ? (
              <UserButton />
            ) : (
              <button 
                onClick={openSignIn} 
                className="flex items-center gap-2 w-full justify-center bg-white text-[#479c26] border border-[#479c26] hover:bg-[#479c26]/10 transition-all duration-300 px-4 py-2 rounded-full shadow-sm hover:shadow-md"
              >
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

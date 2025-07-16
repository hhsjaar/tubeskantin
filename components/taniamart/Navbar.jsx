'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';
import { useClerk, UserButton } from '@clerk/nextjs';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
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
    isTaniamart,
    router,
    user
  } = useAppContext();

  const { openSignIn } = useClerk();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileOpen(false);
    }
  };

  // Function to check if a menu item is active
  const isActiveMenu = (path) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  // Function to get menu item classes
  const getMenuClasses = (path) => {
    const baseClasses = "transition-colors duration-200 relative group";
    const activeClasses = "text-[#479c26] font-semibold";
    const inactiveClasses = "text-gray-700 hover:text-[#479c26]";
    
    return `${baseClasses} ${isActiveMenu(path) ? activeClasses : inactiveClasses}`;
  };

  // Function to get underline classes
  const getUnderlineClasses = (path) => {
    const baseClasses = "absolute -bottom-1 left-0 h-0.5 bg-[#479c26] transition-all duration-300";
    const activeClasses = "w-full";
    const inactiveClasses = "w-0 group-hover:w-full";
    
    return `${baseClasses} ${isActiveMenu(path) ? activeClasses : inactiveClasses}`;
  };

  // Function to get mobile menu classes
  const getMobileMenuClasses = (path) => {
    const baseClasses = "block py-3 border-b border-gray-100 transition-colors duration-300";
    const activeClasses = "text-[#479c26] font-semibold bg-[#479c26]/5";
    const inactiveClasses = "text-gray-700 hover:text-[#479c26]";
    
    return `${baseClasses} ${isActiveMenu(path) ? activeClasses : inactiveClasses}`;
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
          <Link href="/" className={getMenuClasses('/')}>
            <span>Beranda</span>
            <span className={getUnderlineClasses('/')}></span>
          </Link>
          <Link href="/menu" className={getMenuClasses('/menu')}>
            <span>Menu</span>
            <span className={getUnderlineClasses('/menu')}></span>
          </Link>
          <Link href="/my-orders" className={getMenuClasses('/my-orders')}>
            <span>Pesanan</span>
            <span className={getUnderlineClasses('/my-orders')}></span>
          </Link>
          <Link href="/trashback" className={getMenuClasses('/trashback')}>
            <span>TrashBack</span>
            <span className={getUnderlineClasses('/trashback')}></span>
          </Link>

          {isSeller && (
            <button 
              onClick={() => router.push('/seller')} 
              className={`border border-[#479c26] transition-all duration-300 text-xs px-4 py-2 rounded-full shadow-sm hover:shadow-md ${
                isActiveMenu('/seller') 
                  ? 'bg-[#479c26] text-white' 
                  : 'bg-white text-[#479c26] hover:bg-[#479c26]/10'
              }`}
            >
              Admin
            </button>
          )}
          {isBem && (
            <button 
              onClick={() => router.push('/bem-dashboard')} 
              className={`border border-[#479c26] transition-all duration-300 text-xs px-4 py-2 rounded-full shadow-sm hover:shadow-md ${
                isActiveMenu('/bem-dashboard') 
                  ? 'bg-[#479c26] text-white' 
                  : 'bg-white text-[#479c26] hover:bg-[#479c26]/10'
              }`}
            >
              BEM
            </button>
          )}
          {isTaniamart && (
            <button 
              onClick={() => router.push('/taniamart')} 
              className={`border border-[#479c26] transition-all duration-300 text-xs px-4 py-2 rounded-full shadow-sm hover:shadow-md ${
                isActiveMenu('/taniamart') 
                  ? 'bg-[#479c26] text-white' 
                  : 'bg-white text-[#479c26] hover:bg-[#479c26]/10'
              }`}
            >
              Tania Mart
            </button>
          )}
        </div>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-4">
          
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
            className={getMobileMenuClasses('/')}
          >
            Beranda
          </Link>
          <Link 
            href="/menu" 
            onClick={() => setMobileOpen(false)} 
            className={getMobileMenuClasses('/menu')}
          >
            Menu
          </Link>
          <Link 
            href="/my-orders" 
            onClick={() => setMobileOpen(false)} 
            className={getMobileMenuClasses('/my-orders')}
          >
            Pesanan
          </Link>
          <Link 
            href="/trashback" 
            onClick={() => setMobileOpen(false)} 
            className={getMobileMenuClasses('/trashback')}
          >
            TrashBack
          </Link>

          {(isSeller || isBem || isTaniamart) && <hr className="my-4 border-gray-100" />}

          {isSeller && (
            <button 
              onClick={() => { router.push('/seller'); setMobileOpen(false); }} 
              className={getMobileMenuClasses('/seller')}
            >
              Admin Dashboard
            </button>
          )}
          {isBem && (
            <button 
              onClick={() => { router.push('/bem-dashboard'); setMobileOpen(false); }} 
              className={getMobileMenuClasses('/bem-dashboard')}
            >
              BEM Dashboard
            </button>
          )}
          {isTaniamart && (
            <button 
              onClick={() => { router.push('/taniamart'); setMobileOpen(false); }} 
              className={getMobileMenuClasses('/taniamart')}
            >
              Tania Mart Dashboard
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
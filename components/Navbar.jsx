'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';
import { useClerk, UserButton } from '@clerk/nextjs';
import NotificationBell from './NotificationBeli';
import ThemeToggle from './ThemeToggle'; // Tambahkan import
import { Menu, X } from 'lucide-react';
import { usePathname, useRouter as useNextRouter } from 'next/navigation';
import { useDebounce } from 'use-debounce';
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
    isKantek,
    isKandok,
    isKantel,
    isKansip,
    isBerkah,
    isKantintn,
    isTaniamart,
    router,
    user,
    products
  } = useAppContext();

  const nextRouter = useNextRouter();
  const { openSignIn } = useClerk();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const pathname = usePathname();

  // Pencarian real-time
  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      const results = products.filter(product => 
        product.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase()))
      ).slice(0, 5); // Batasi hasil pencarian
      
      setSearchResults(results);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [debouncedSearchQuery, products]);

  // Tutup hasil pencarian saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.search-container')) {
        setShowResults(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/menu?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowResults(false);
      setMobileOpen(false);
    }
  };

  const handleProductClick = (productName) => {
    router.push(`/menu?search=${encodeURIComponent(productName)}`);
    setSearchQuery('');
    setShowResults(false);
    setMobileOpen(false);
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
    <nav className="bg-white dark:bg-gray-900 border-b dark:border-gray-700 shadow-sm sticky top-0 z-50">
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
          <Link href="/" className="text-gray-700 dark:text-gray-200 hover:text-[#479c26] dark:hover:text-[#479c26] transition-colors duration-200">
            Beranda
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
          {isKandok && (
            <button 
              onClick={() => router.push('/kandok')} 
              className={`border border-[#479c26] transition-all duration-300 text-xs px-4 py-2 rounded-full shadow-sm hover:shadow-md ${
                isActiveMenu('/kandok') 
                  ? 'bg-[#479c26] text-white' 
                  : 'bg-white text-[#479c26] hover:bg-[#479c26]/10'
              }`}
            >
              Kandok
            </button>
          )}
          {isKantek && (
            <button 
              onClick={() => router.push('/kantek')} 
              className={`border border-[#479c26] transition-all duration-300 text-xs px-4 py-2 rounded-full shadow-sm hover:shadow-md ${
                isActiveMenu('/kantek') 
                  ? 'bg-[#479c26] text-white' 
                  : 'bg-white text-[#479c26] hover:bg-[#479c26]/10'
              }`}
            >
              Kantek
            </button>
          )}
          {isKansip && (
            <button 
              onClick={() => router.push('/kansip')} 
              className={`border border-[#479c26] transition-all duration-300 text-xs px-4 py-2 rounded-full shadow-sm hover:shadow-md ${
                isActiveMenu('/kansip') 
                  ? 'bg-[#479c26] text-white' 
                  : 'bg-white text-[#479c26] hover:bg-[#479c26]/10'
              }`}
            >
              Kansip
            </button>
          )}
          {isKantel && (
            <button 
              onClick={() => router.push('/kantel')} 
              className={`border border-[#479c26] transition-all duration-300 text-xs px-4 py-2 rounded-full shadow-sm hover:shadow-md ${
                isActiveMenu('/kantel') 
                  ? 'bg-[#479c26] text-white' 
                  : 'bg-white text-[#479c26] hover:bg-[#479c26]/10'
              }`}
            >
              Kantel
            </button>
          )}
          {isBerkah && (
            <button 
              onClick={() => router.push('/berkah')} 
              className={`border border-[#479c26] transition-all duration-300 text-xs px-4 py-2 rounded-full shadow-sm hover:shadow-md ${
                isActiveMenu('/berkah') 
                  ? 'bg-[#479c26] text-white' 
                  : 'bg-white text-[#479c26] hover:bg-[#479c26]/10'
              }`}
            >
              Kantin Berkah
            </button>
          )}
          {isKantintn && (
            <button 
              onClick={() => router.push('/kantintn')} 
              className={`border border-[#479c26] transition-all duration-300 text-xs px-4 py-2 rounded-full shadow-sm hover:shadow-md ${
                isActiveMenu('/kantintn') 
                  ? 'bg-[#479c26] text-white' 
                  : 'bg-white text-[#479c26] hover:bg-[#479c26]/10'
              }`}
            >
              Kantin TN
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
          {/* <ThemeToggle /> Tambahkan toggle theme */}
          <NotificationBell />
          <div className="relative search-container">
            <form onSubmit={handleSearch} className="flex border border-gray-200 hover:border-[#479c26] rounded-full px-4 py-2 items-center transition-colors duration-300 group">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchResults.length > 0 && setShowResults(true)}
                placeholder="Cari..."
                className="text-sm outline-none w-40 text-gray-600 placeholder-gray-400"
              />
              <button type="submit" className="group-hover:scale-110 transition-transform duration-200">
                <Image src={assets.search_icon} alt="search" className="w-4 h-4" />
              </button>
            </form>

            {/* Hasil pencarian real-time */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg overflow-hidden z-50 border border-gray-100">
                <ul>
                  {searchResults.map((product, index) => (
                    <li 
                      key={index} 
                      className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2 border-b border-gray-100 last:border-b-0"
                      onClick={() => handleProductClick(product.name)}
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                        {product.image && product.image[0] ? (
                          <Image src={product.image[0]} alt={product.name} width={32} height={32} className="object-cover" />
                        ) : (
                          <span className="text-xs text-gray-400">No img</span>
                        )}
                      </div>
                      <div className="flex-1 truncate">
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-gray-500 truncate">{product.kantin}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
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
          <ThemeToggle /> {/* Tambahkan toggle theme untuk mobile */}
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

          {(isSeller || isBem || isKantek || isKandok || isKantel || isKansip || isBerkah || isKantintn || isTaniamart) && <hr className="my-4 border-gray-100" />}

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
          {isKandok && (
            <button 
              onClick={() => { router.push('/kandok'); setMobileOpen(false); }} 
              className={getMobileMenuClasses('/kandok')}
            >
              Kandok Dashboard
            </button>
          )}
          {isKantek && (
            <button 
              onClick={() => { router.push('/kantek'); setMobileOpen(false); }} 
              className={getMobileMenuClasses('/kantek')}
            >
              Kantek Dashboard
            </button>
          )}
          {isKansip && (
            <button 
              onClick={() => { router.push('/kansip'); setMobileOpen(false); }} 
              className={getMobileMenuClasses('/kansip')}
            >
              Kansip Dashboard
            </button>
          )}
          {isKantel && (
            <button 
              onClick={() => { router.push('/kantel'); setMobileOpen(false); }} 
              className={getMobileMenuClasses('/kantel')}
            >
              Kantel Dashboard
            </button>
          )}
          {isBerkah && (
            <button 
              onClick={() => { router.push('/berkah'); setMobileOpen(false); }} 
              className={getMobileMenuClasses('/berkah')}
            >
              Berkah Dashboard
            </button>
          )}
          {isKantintn && (
            <button 
              onClick={() => { router.push('/kantintn'); setMobileOpen(false); }} 
              className={getMobileMenuClasses('/kantintn')}
            >
              Kantintn Dashboard
            </button>
          )}
          {isTaniamart && (
            <button 
              onClick={() => { router.push('/taniamart'); setMobileOpen(false); }} 
              className={getMobileMenuClasses('/taniamart')}
            >
              Taniamart Dashboard
            </button>
          )}

          <div className="relative search-container">
            <form onSubmit={handleSearch} className="flex border border-gray-200 hover:border-[#479c26] rounded-full px-4 py-2 items-center mt-4 transition-colors duration-300 group">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchResults.length > 0 && setShowResults(true)}
                placeholder="Cari makanan..."
                className="text-sm outline-none w-full text-gray-600 placeholder-gray-400"
              />
              <button type="submit" className="group-hover:scale-110 transition-transform duration-200">
                <Image src={assets.search_icon} alt="search" className="w-4 h-4" />
              </button>
            </form>

            {/* Hasil pencarian real-time mobile */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-white rounded-lg shadow-lg overflow-hidden z-50 border border-gray-100">
                <ul>
                  {searchResults.map((product, index) => (
                    <li 
                      key={index} 
                      className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2 border-b border-gray-100 last:border-b-0"
                      onClick={() => handleProductClick(product.name)}
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                        {product.images && product.images[0] ? (
                          <Image src={product.images[0]} alt={product.name} width={32} height={32} className="object-cover" />
                        ) : (
                          <span className="text-xs text-gray-400">No img</span>
                        )}
                      </div>
                      <div className="flex-1 truncate">
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-gray-500 truncate">{product.kantin}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

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

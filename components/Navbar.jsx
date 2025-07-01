"use client";
import React, { useState } from "react";
import { assets, BagIcon, BoxIcon, CartIcon, HomeIcon } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";
import NotificationBell from "./NotificationBeli";

const Navbar = () => {
  const {
    isSeller,
    isBem,
    router,
    user,
    isKantek,
    isKandok,
    isKantel,
    isKansip,
    isKantinTN1,
    isKantinTN2,
    isKantinTN3
  } = useAppContext();

  const { openSignIn } = useClerk();

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };


  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700">
      <Image
        className="cursor-pointer w-28 md:w-32"
        onClick={() => router.push("/")}
        src={assets.logo}
        alt="logo"
      />

      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        <Link href="/" className="hover:text-gray-900 transition">Beranda</Link>
        <Link href="/menu" className="hover:text-gray-900 transition">Menu</Link>
        <Link href="/my-orders" className="hover:text-gray-900 transition">Pesanan</Link>
        <Link href="/trashback" className="hover:text-gray-900 transition">TrashBack</Link>

        {isSeller && (
          <button onClick={() => router.push("/seller")} className="text-xs border px-4 py-1.5 rounded-full">
            Admin Dashboard
          </button>
        )}

        {isBem && (
          <button onClick={() => router.push("/bem-dashboard")} className="text-xs border px-4 py-1.5 rounded-full">
            BEM Dashboard
          </button>
        )}

        {isKandok && (
          <button onClick={() => router.push("/kandok")} className="text-xs border px-4 py-1.5 rounded-full">
            Kandok Dashboard
          </button>
        )}
      </div>

      <ul className="hidden md:flex items-center gap-4">
                  <NotificationBell />

        <form onSubmit={handleSearch} className="flex items-center border rounded px-2 py-1 gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="outline-none text-sm"
          />
          <button type="submit">
            <Image className="w-4 h-4" src={assets.search_icon} alt="search icon" />
          </button>
        </form>

        {user ? (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action label="Cart" labelIcon={<CartIcon />} onClick={() => router.push("/cart")} />
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action label="My Orders" labelIcon={<BagIcon />} onClick={() => router.push("/my-orders")} />
            </UserButton.MenuItems>
            {isBem && (
              <UserButton.MenuItems>
                <UserButton.Action label="BEM Dashboard" labelIcon={<HomeIcon />} onClick={() => router.push("/bem-dashboard")} />
              </UserButton.MenuItems>
            )}
            {isKandok && (
              <UserButton.MenuItems>
                <UserButton.Action label="Kandok Dashboard" labelIcon={<HomeIcon />} onClick={() => router.push("/kandok")} />
              </UserButton.MenuItems>
            )}
          </UserButton>
        ) : (
          <button onClick={openSignIn} className="flex items-center gap-2 hover:text-gray-900 transition">
            <Image src={assets.user_icon} alt="user icon" />
            
          </button>
        )}
      </ul>

      {/* Mobile */}
      <div className="flex items-center md:hidden gap-3">
        {isSeller && (
          <button onClick={() => router.push("/seller")} className="text-xs border px-4 py-1.5 rounded-full">
            Admin Dashboard
          </button>
        )}
        {isBem && (
          <button onClick={() => router.push("/bem-dashboard")} className="text-xs border px-4 py-1.5 rounded-full">
            BEM Dashboard
          </button>
        )}
        {isKandok && (
          <button onClick={() => router.push("/kandok")} className="text-xs border px-4 py-1.5 rounded-full">
            Kandok Dashboard
          </button>
        )}
        {user ? (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action label="Home" labelIcon={<HomeIcon />} onClick={() => router.push("/")} />
              <UserButton.Action label="Products" labelIcon={<BoxIcon />} onClick={() => router.push("/all-products")} />
              <UserButton.Action label="Cart" labelIcon={<CartIcon />} onClick={() => router.push("/cart")} />
              <UserButton.Action label="My Orders" labelIcon={<BagIcon />} onClick={() => router.push("/my-orders")} />
              {isBem && (
                <UserButton.Action label="BEM Dashboard" labelIcon={<HomeIcon />} onClick={() => router.push("/bem-dashboard")} />
              )}
              {isKandok && (
                <UserButton.Action label="Kandok Dashboard" labelIcon={<HomeIcon />} onClick={() => router.push("/kandok")} />
              )}
            </UserButton.MenuItems>
          </UserButton>
        ) : (
          <button onClick={openSignIn} className="flex items-center gap-2 hover:text-gray-900 transition">
            <Image src={assets.user_icon} alt="user icon" />
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

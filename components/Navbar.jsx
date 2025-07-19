"use client";
import React from "react";
import { assets, BagIcon, BoxIcon, CartIcon, HomeIcon } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";

const Navbar = () => {
  const { isSeller, router, user } = useAppContext();
  const { openSignIn } = useClerk();
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/all-products", label: "Shop" },
    { href: "/", label: "About Us" },
    { href: "/", label: "Contact" },
  ];

  const userMenuItems = [
    { label: "Home", icon: <HomeIcon />, path: "/" },
    { label: "Products", icon: <BoxIcon />, path: "/all-products" },
    { label: "Cart", icon: <CartIcon />, path: "/cart" },
    { label: "My Orders", icon: <BagIcon />, path: "/my-orders" },
  ];

  const renderUserMenu = () => (
    <UserButton>
      {userMenuItems.map(({ label, icon, path }) => (
        <UserButton.MenuItems key={label}>
          <UserButton.Action
            label={label}
            labelIcon={icon}
            onClick={() => router.push(path)}
          />
        </UserButton.MenuItems>
      ))}
    </UserButton>
  );

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700">
      <Image
        className="cursor-pointer w-28 md:w-32"
        onClick={() => router.push("/")}
        src={assets.logo}
        alt="logo"
      />
      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        {navLinks.map(({ href, label }) => (
          <Link
            key={label}
            href={href}
            className="hover:text-gray-900 transition"
          >
            {label}
          </Link>
        ))}
        {isSeller && (
          <button
            onClick={() => router.push("/seller")}
            className="text-xs border px-4 py-1.5 rounded-full"
          >
            Seller Dashboard
          </button>
        )}
      </div>

      <ul className="hidden md:flex items-center gap-4">
        <Image className="w-4 h-4" src={assets.search_icon} alt="search icon" />
        {user ? (
          renderUserMenu()
        ) : (
          <button
            onClick={openSignIn}
            className="flex items-center gap-2 hover:text-gray-900 transition"
          >
            <Image src={assets.user_icon} alt="user icon" />
            Account
          </button>
        )}
      </ul>

      <div className="flex items-center md:hidden gap-3">
        {isSeller && (
          <button
            onClick={() => router.push("/seller")}
            className="text-xs border px-4 py-1.5 rounded-full"
          >
            Seller Dashboard
          </button>
        )}
        {user ? (
          renderUserMenu()
        ) : (
          <button
            onClick={openSignIn}
            className="flex items-center gap-2 hover:text-gray-900 transition"
          >
            <Image src={assets.user_icon} alt="user icon" />
            Account
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

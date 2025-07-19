"use client";

import * as React from "react";

import Link from "next/link";

import { useCartStore } from "@/hooks";

import { Img, Container } from "@/components";

import { navLists } from "@/static/navigation";

const navFeatureLists = [
  { name: "My Lindway", href: "/my-lindway" },
  { name: "Simply Lindway", href: "/simply-lindway" },
  { name: "Lure by Lindway", href: "/lure-by-lindway" },
];

export const Header = ({ isDark }: { isDark?: boolean }) => {
  const { getCartItemByProduct } = useCartStore();
  return (
    <>
      {/* Logo Header */}
      <header className={`w-full transition-all duration-300 ${isDark ? "text-gray bg-light" : "bg-transparent text-light"}`}>
        <Container className="flex items-center justify-between h-24 gap-8">
          <menu className="flex items-center gap-4 list-none">
            <li>
              <a href="https://maps.app.goo.gl/2pUxXSh99bSCWTtd6" target="_blank" rel="noopener noreferrer">
                <Img src={isDark ? "/icons/location-grey.svg" : "/icons/location-light.svg"} alt="location icons" className="size-7" />
              </a>
            </li>
            <li>
              <a href="https://api.whatsapp.com/send?phone=6282339936682" target="_blank" rel="noopener noreferrer">
                <Img src={isDark ? "/icons/whatsapp-grey.svg" : "/icons/whatsapp-light.svg"} alt="whatsapp icons" className="size-7" />
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/mylindway" target="_blank" rel="noopener noreferrer">
                <Img src={isDark ? "/icons/instagram-grey.svg" : "/icons/instagram-light.svg"} alt="instagram icons" className="size-7" />
              </a>
            </li>
            <li>
              <a href="https://www.facebook.com/mylindwaybrand" target="_blank" rel="noopener noreferrer">
                <Img src={isDark ? "/icons/facebook-grey.svg" : "/icons/facebook-light.svg"} alt="facebook icons" className="size-7" />
              </a>
            </li>
          </menu>
          <div className="absolute transform -translate-x-1/2 left-1/2">
            <Link href="/">
              <Img src={isDark ? "/icons/dark-logo.png" : "/icons/light-logo.png"} alt="lindway logo" className="mx-auto h-14 min-w-36 max-w-36" cover />
            </Link>
          </div>
          <menu className="flex items-center justify-center gap-6 list-none">
            {navFeatureLists.map((item, index) => (
              <li key={index} className="relative group">
                <Link href={item.href}>{item.name}</Link>
                <span className={`absolute h-0.5 transition-all -bottom-1.5 left-1/2 ${isDark ? "bg-gray" : "bg-light"} w-0 group-hover:w-10`}></span>
                <span className={`absolute h-0.5 transition-all -bottom-1.5 right-1/2 ${isDark ? "bg-gray" : "bg-light"} w-0 group-hover:w-10`}></span>
              </li>
            ))}
            <li className="relative">
              <Link href="/cart" className="block">
                <Img src={isDark ? "/icons/cart-dark.svg" : "/icons/cart-light.svg"} alt="cart icons" className="size-7" />
              </Link>
              {getCartItemByProduct() > 0 && <span className="absolute text-xs text-center rounded-full -top-2 -right-2 bg-gray text-light size-4">{getCartItemByProduct()}</span>}
            </li>
          </menu>
        </Container>
      </header>

      {/* Navigation Bar - Independent from header and sticks to top */}
      <nav className={`w-full flex items-center h-12 border-t ${isDark ? "bg-light text-gray border-gray shadow-md" : "bg-transparent text-light"}`}>
        <Container className="flex items-center justify-center">
          <menu className="flex items-center justify-center gap-6 list-none">
            {navLists.map((item, index) => (
              <li key={index} className="relative text-sm group">
                <Link href={item.href}>{item.name}</Link>
                <span className={`absolute h-0.5 transition-all -bottom-1.5 left-1/2 ${isDark ? "bg-gray" : "bg-light"} w-0 group-hover:w-8`}></span>
                <span className={`absolute h-0.5 transition-all -bottom-1.5 right-1/2 ${isDark ? "bg-gray" : "bg-light"} w-0 group-hover:w-8`}></span>
              </li>
            ))}
          </menu>
        </Container>
      </nav>
    </>
  );
};

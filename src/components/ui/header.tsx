"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import { Img, Container } from "@/components";

const navLists = [
  { name: "About us", href: "#about-us" },
  { name: "Collection", href: "#collection" },
  { name: "Size Guide", href: "#size-guide" },
  { name: "Moment", href: "#moment" },
  { name: "Contact us", href: "#contact-us" },
];

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = React.useState<boolean>(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string): void => {
    e.preventDefault();
    const sectionId = href.substring(1);

    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      window.history.pushState({}, "", `${pathname}${href}`);
    }
  };

  return (
    <>
      {/* Logo Header */}
      <header className={`fixed z-10 w-full transition-all duration-300 ${isScrolled ? "-translate-y-full" : "translate-y-0"}`}>
        <Container className="flex items-center justify-center h-24 gap-8">
          <div className="opacity-0"></div>
          <div>
            <Img src="/icons/logo.png" alt="lindway logo" className="h-12 mx-auto min-w-32 max-w-32" />
          </div>
          <menu className="absolute flex items-center gap-4 list-none -translate-y-1/2 top-1/2 right-4 sm:right-8">
            <li>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <Img src="/icons/shopee-light.svg" alt="shopee icons" className="size-7" />
              </a>
            </li>
            <li>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <Img src="/icons/whatsapp-light.svg" alt="whatsapp icons" className="size-7" />
              </a>
            </li>
            <li>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <Img src="/icons/instagram-light.svg" alt="instagram icons" className="size-7" />
              </a>
            </li>
            <li>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <Img src="/icons/facebook-light.svg" alt="facebook icons" className="size-7" />
              </a>
            </li>
          </menu>
        </Container>
        <hr className="text-light" />
      </header>

      {/* Navigation Bar - Independent from header and sticks to top */}
      <nav className={`fixed z-100 w-full transition-all duration-300 py-4 ${isScrolled ? "top-0 bg-light text-gray" : "top-24 bg-transparent text-light"}`}>
        <Container className="flex items-center justify-center">
          <ul className="flex items-center justify-center gap-4 list-none">
            {navLists.map((item, index) => (
              <li key={index} className="text-lg">
                <a href={item.href} onClick={(e) => scrollToSection(e, item.href)}>
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </nav>
    </>
  );
};

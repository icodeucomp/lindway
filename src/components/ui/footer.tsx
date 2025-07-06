import Link from "next/link";

import { Container, Img } from "@/components";

import { navLists } from "@/static/navigation";

const featureLists = [
  {
    title: "My Lindway",
    href: "/my-lindway",
    menus: ["Pre-Order", "Everyday kebaya"],
  },
  {
    title: "Simply Lindway",
    href: "/simply-lindway",
    menus: ["Shop Now"],
  },
  {
    title: "Lure by Lindway",
    href: "/lure-by-lindway",
    menus: ["Discover the Brand"],
  },
];

export const Footer = () => {
  return (
    <footer className="mt-8 shadow-footer text-gray">
      <Container className="grid grid-cols-2 gap-8 py-8">
        <div className="flex flex-col justify-between">
          <Link href="/" className="w-max">
            <Img src="/icons/dark-logo.png" alt="lindway logo" className="h-14 min-w-36 max-w-36" cover />
          </Link>
          <p className="text-sm">© 2025 Lindway. Jalan Hayam Wuruk Gang XVII No. 36 Denpasar Timur, Bali 80239, Indonesia</p>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {featureLists.map((item, i) => (
              <div key={i} className="space-y-2 text-sm">
                <Link href={item.href} className="font-medium">
                  {item.title}
                </Link>
                {item.menus.map((menu, j) => (
                  <p key={j}>{menu}</p>
                ))}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {navLists.map((item, index) => (
              <Link href={item.href} key={index} className="text-sm font-medium">
                {item.name}
              </Link>
            ))}
          </div>
          <div className="space-y-1">
            <p className="font-bold">Reach out and follow us at</p>
            <menu className="flex items-center gap-4 list-none">
              <li>
                <a href="https://maps.app.goo.gl/2pUxXSh99bSCWTtd6" target="_blank" rel="noopener noreferrer">
                  <Img src="/icons/location-grey.svg" alt="location icons" className="size-7" />
                </a>
              </li>
              <li>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <Img src="/icons/whatsapp-grey.svg" alt="whatsapp icons" className="size-7" />
                </a>
              </li>
              <li>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <Img src="/icons/instagram-grey.svg" alt="instagram icons" className="size-7" />
                </a>
              </li>
              <li>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <Img src="/icons/facebook-grey.svg" alt="facebook icons" className="size-7" />
                </a>
              </li>
            </menu>
          </div>
        </div>
      </Container>
      <div className="w-full h-4 bg-gray"></div>
    </footer>
  );
};

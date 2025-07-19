import Link from "next/link";

import { Background, Motion } from "@/components";

export const CuratedCollection = () => {
  return (
    <Background src="/images/contact-us-header-background.webp" alt="contact us background" className="flex justify-center items-center min-h-500 bg-light/20">
      <Motion tag="div" initialX={0} animateX={0} duration={0.3} className="w-full space-y-8 max-w-screen-xl px-4 sm:px-8">
        <div className="space-y-8">
          <div className="space-y-4 text-center">
            <Motion tag="h3" initialY={50} animateY={0} duration={0.3} className="text-lg sm:text-xl md:text-3xl font-semibold">
              Curated Collection
            </Motion>
            <Motion tag="p" initialY={50} animateY={0} duration={0.3} delay={0.3}>
              Each piece in our collection is thoughtfully curated to celebrate the richness of Indonesia&apos;s cultural heritage. Crafted on a made-to-order basis, our flagship designs embrace the
              art of slow fashion—honoring quality, individuality, and intentionality. From intricate embroidery and hand-painted fabrics to delicate sequin artistry, every My Lindway creation is a
              personal expression of elegance.
            </Motion>
          </div>
          <Motion tag="div" initialY={50} animateY={0} duration={0.3} delay={0.6} className="block pb-2 border-b border-light w-max mx-auto font-medium">
            <Link href="/curated-collections">Discover Collections</Link>
          </Motion>
        </div>
      </Motion>
    </Background>
  );
};

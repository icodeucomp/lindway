import { Background, Img, Motion } from "@/components";
import { Header } from "../header";

export const Hero = () => {
  return (
    <Background src="/images/about-lindway-header-background.webp" alt="hero background" className="flex flex-col items-center min-h-700 bg-dark/30">
      <Header />
      <div className="w-full flex items-center gap-16 py-20 max-w-screen-xl px-4 sm:px-8">
        <Img src="/images/about-lindway-header-artisan-journey.webp" alt="hero image" className="w-full max-w-xs min-h-400" cover />
        <div className="space-y-4 text-sm text-justify">
          <Motion tag="div" initialY={30} animateY={0} duration={1} className="space-y-1">
            <h4 className="text-2xl font-semibold">Artisan Journey</h4>
            <h5 className="text-lg">A Celebration of Craftsmanship and Culture</h5>
          </Motion>
          <Motion tag="p" initialY={30} animateY={0} duration={1} delay={0.2}>
            At Lindway, every piece tells a story—of heritage, artistry, and heartfelt creation. Crafted with great care and love, our collections are brought to life through the hands of local
            artisans, each product embodying the essence of Indonesian tradition with a modern twist.
          </Motion>
          <Motion tag="p" initialY={30} animateY={0} duration={1} delay={0.4}>
            From the refined beauty of manual and hand-guided embroidery to the expressive charm of hand-painted designs and the radiant sparkle of sequins, every Lindway creation is a tribute to
            traditional techniques.
          </Motion>
          <Motion tag="p" initialY={30} animateY={0} duration={1} delay={0.8}>
            Our menswear line showcases the timeless elegance of contemporary style, ornament, and the rich tradition of Bali, interpreted by local artisans. These pieces offer a fresh, sophisticated
            expression of cultural heritage—blending tradition with modern sensibility.
          </Motion>
          <Motion tag="p" initialY={30} animateY={0} duration={1} delay={0.9}>
            We embrace patch art using leftover materials, breathing new life into fabric remnants while committing to sustainability and honoring Indonesia&apos;s rich batik legacy.
          </Motion>
          <Motion tag="p" initialY={30} animateY={0} duration={1} delay={1}>
            Comfort and craftsmanship go hand in hand in our collections. Every stitch, brushstroke, and detail is infused with passion and purpose. Step into our world and discover the quiet luxury
            of slow fashion—where each thread carries the soul of its maker.
          </Motion>
        </div>
      </div>
    </Background>
  );
};

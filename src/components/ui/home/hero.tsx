import { Background, Motion } from "@/components";
import { Header } from "../header";

export const Hero = () => {
  return (
    <Background src="/images/my-lindway-header-background.webp" alt="hero background" className="flex flex-col items-center min-h-600 bg-filter">
      <Header />
      <div className="w-full text-center space-y-8 pt-40 max-w-screen-xl px-4 sm:px-8">
        <Motion tag="h1" initialY={50} animateX={0} duration={0.3} className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-medium">
          Celebrating Indonesian Craftsmanship, <br /> From Heritage to Everyday Art.
        </Motion>
        <Motion tag="p" initialY={50} animateX={0} duration={0.6} delay={0.3} className="text-sm sm:text-base md:text-xl font-light">
          Timeless designs, crafted by artisans and inspired by Bali&apos;s living culture.
        </Motion>
      </div>
    </Background>
  );
};

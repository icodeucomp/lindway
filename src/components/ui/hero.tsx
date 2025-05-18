import { Background, Motion } from "@/components";

export const Hero = () => {
  return (
    <Background src="/images/hero.png" alt="hero background" className="flex justify-center items-center min-h-600 bg-dark/30">
      <div className="w-full space-y-8 pt-48 max-w-screen-xl px-4 sm:px-8">
        <div className="space-y-1 ">
          <Motion tag="p" initialX={-50} animateX={0} duration={0.3} className="text-lg md:text-xl">
            Sustainability Celebration of Indonesia&apos;s Rich Artistry
          </Motion>
          <Motion tag="p" initialX={-50} animateX={0} duration={0.6} delay={0.3} className="text-xl font-medium md:text-2xl">
            A tribute to Indonesia&apos;s heritage, crafted with passion and precision.
          </Motion>
        </div>
        <Motion tag="div" initialX={-50} animateX={0} duration={0.9} delay={0.3}>
          <span className="border-b border-light pb-2.5">Discover our collections</span>
        </Motion>
      </div>
    </Background>
  );
};

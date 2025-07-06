import { Background, Container, Motion } from "@/components";
import { Header } from "../header";

export const Hero = () => {
  return (
    <Background src="/images/hero-about.jpg" alt="hero background" className="flex flex-col items-center min-h-600 bg-dark/30">
      <Header />
      <Container className="space-y-4 pt-24 text-justify">
        <Motion tag="h3" initialY={50} animateY={0} duration={0.3} className="text-lg md:text-xl lg:text-2xl font-semibold">
          Size Guide
        </Motion>
        <Motion tag="p" initialY={50} animateY={0} duration={0.6} delay={0.3} className="font-medium text-lg">
          At Lindway, we believe every piece should feel like it was made just for you. Whether you&apos;re dressing in our intricately crafted kebaya, effortless everyday wear, or charming tees, the
          right fit brings comfort, confidence, and beauty to life.
        </Motion>
        <Motion tag="p" initialY={50} animateY={0} duration={0.6} delay={0.3} className="font-medium text-lg">
          Explore our guide below to help you choose the size that fits you best—or reach out for a custom fit designed with you in mind.
        </Motion>
      </Container>
    </Background>
  );
};

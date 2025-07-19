import { Background, Container, Motion } from "@/components";
import { Header } from "../header";

interface HeroProps {
  imagePath: string;
  title: string;
  description: string;
}

export const Hero = ({ description, title, imagePath }: HeroProps) => {
  return (
    <Background src={imagePath} alt="hero background" className="flex items-center flex-col min-h-600 bg-filter">
      <Header />
      <Container className="pt-32 space-y-2 text-justify">
        <Motion tag="h3" initialY={50} animateY={0} duration={0.2} className="text-lg font-semibold md:text-xl lg:text-2xl">
          {title}
        </Motion>
        <Motion tag="p" initialY={50} animateY={0} duration={0.4} delay={0.2} className="text-lg font-medium">
          {description}
        </Motion>
        <div className="pt-4">
          <Motion tag="button" initialY={50} animateY={0} duration={0.6} delay={0.2} className="block pb-2 border-b border-light w-max">
            Discover the Collection
          </Motion>
        </div>
      </Container>
    </Background>
  );
};

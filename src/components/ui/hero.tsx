import { Background, Container, Motion } from "@/components";
import { Header } from "./header";

interface HeroProps {
  imagePath: string;
  title: string;
  description: string;
}

export const Hero = ({ description, title, imagePath }: HeroProps) => {
  return (
    <Background src={imagePath} alt="hero background" className="flex flex-col items-center min-h-600 bg-filter">
      <Header />
      <Container className="space-y-4 pt-32 text-justify">
        <Motion tag="h3" initialY={50} animateY={0} duration={0.3} className="text-lg md:text-xl lg:text-2xl font-semibold">
          {title}
        </Motion>
        <Motion tag="p" initialY={50} animateY={0} duration={0.6} delay={0.3} className="font-medium text-lg">
          {description}
        </Motion>
      </Container>
    </Background>
  );
};

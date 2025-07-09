import { Background, Container, Motion } from "@/components";

const sizeGuides = [
  {
    name: "baby & Child Measurement",
    image: "/images/size-guide-find-your-perfect-fit-baby-measurement.webp",
  },
  {
    name: "Women's Measurement",
    image: "/images/size-guide-find-your-perfect-fit-women-measurement.webp",
  },
  {
    name: "Men's Measurement",
    image: "/images/size-guide-find-your-perfect-fit-men-measurement.webp",
  },
];

export const SizeGuide = () => {
  return (
    <Container className="pt-16 space-y-6">
      <Motion tag="h3" initialY={0} animateY={0} duration={0.3} className="text-center heading">
        Size Guide
      </Motion>
      <Motion tag="p" initialY={0} animateY={0} duration={0.3} className="text-sm text-center md:text-base">
        All Lindway products are having standard sizes and take time to design
      </Motion>
      <div className="grid grid-cols-3">
        {sizeGuides.map((sizeGuide, index) => (
          <Background key={sizeGuide.name} src={sizeGuide.image} alt="hero background" className="flex items-end justify-center min-h-600 bg-dark/30">
            <Motion tag="div" initialX={-50} animateX={0} duration={0.3} delay={index * 0.1} className="p-6 space-y-4 text-center">
              <h3 className="text-lg font-bold">{sizeGuide.name}</h3>
              <a href="#" className="block pb-2 mx-auto border-b border-light w-max">
                See details
              </a>
            </Motion>
          </Background>
        ))}
      </div>
    </Container>
  );
};

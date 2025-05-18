import React from "react";
import { Container, Motion } from "@/components";

export const AboutUs = () => {
  return (
    <Container className="flex items-center pt-16 text-gray">
      <Motion tag="h1" initialX={-50} animateX={0} duration={0.2} className="heading min-w-96">
        Lindway
      </Motion>
      <div className="space-y-4 text-justify">
        <Motion tag="p" initialX={50} animateX={0} duration={0.4} delay={0.2}>
          Lindway is a lifestyle brand and self-manufactured based in Denpasar, Bali, Indonesia, owned and crafted by the local community. The aim is to share our passion and creativity through our
          way and style. It highlights creativity through its colors, patterns, textures, and designs in an elegant look.
        </Motion>
        <Motion tag="p" initialX={50} animateX={0} duration={0.6} delay={0.2}>
          Our purpose is to bring high quality of products, and it gives good impact to the community, the environment, the earth and as much as possible to be an agent of positive change. Every piece
          made thoughtfully to ensure perfection, bring the elegance statement, and manufactured suits the demand.
        </Motion>
        <Motion tag="p" initialX={50} animateX={0} duration={0.8} delay={0.2}>
          All fabrics are selected carefull, we only choose the best quality and crafted to minimise the fabric waste by maximising the usage of its fabric cloth through all Lindway brands.
        </Motion>
      </div>
    </Container>
  );
};

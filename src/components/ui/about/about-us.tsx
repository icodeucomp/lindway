import { Motion, Container, Img } from "@/components";

export const AboutUs = () => {
  return (
    <Container className="py-16 space-y-24 text-gray">
      <div className="flex items-center gap-8">
        <Img src="/icons/dark-logo.png" alt="lindway logo" className="h-40 mx-auto min-w-80 max-w-80" cover />
        <div className="space-y-4 text-justify text-sm">
          <Motion tag="div" initialY={30} animateY={0} duration={1} className="space-y-1">
            <h4 className="text-2xl font-semibold">About Lindway</h4>
            <h5 className="text-lg font-light italic">Rooted in Bali, Inspired by Purpose</h5>
          </Motion>
          <Motion tag="p" initialY={30} animateY={0} duration={1} delay={0.2}>
            Lindway is more than a brand—it&apos;s a lifestyle shaped by passion, purpose, and the vibrant soul of Bali. Based in Denpasar and proudly self-manufactured, Lindway is built by the hands
            of local artisans, blending creativity and community into every thread.
          </Motion>
          <Motion tag="p" initialY={30} animateY={0} duration={1} delay={0.4}>
            Our vision is to express beauty through thoughtful design—where color, pattern, texture, and form come together in refined harmony. Each creation is a reflection of our commitment to
            elegance, craftsmanship, and authentic storytelling.
          </Motion>
          <Motion tag="p" initialY={30} animateY={0} duration={1} delay={0.8}>
            We believe in fashion with intention. That means producing high-quality pieces that not only elevate personal style but also make a positive impact on our community, our environment, and
            the planet. Every product is made with care—thoughtfully designed, responsibly crafted, and tailored to meet both aesthetic and ethical standards.
          </Motion>
          <Motion tag="p" initialY={30} animateY={0} duration={1} delay={0.9}>
            At Lindway, fabric is treated as both material and muse. We carefully select only the finest textiles and ensure minimal waste by thoughtfully repurposing leftover fabric across our
            collections. It&apos;s a quiet nod to sustainability—woven into the essence of our brand.
          </Motion>
          <Motion tag="p" initialY={30} animateY={0} duration={1} delay={1} className="font-semibold italic">
            With every piece, Lindway invites you to experience fashion that feels meaningful, mindful, and timeless.
          </Motion>
        </div>
      </div>
      <div className="w-full flex gap-8 min-h-700">
        <Img src="/images/about-lindway-lindway-philosophy-kiri.webp" alt="hero image" className="w-full max-w-sm min-h-500 max-h-fit" cover />
        <div className="text-sm text-justify">
          <h4 className="text-xl font-semibold pt-8 pb-16 text-center">
            “Whether you&apos;re seeking a handcrafted statement piece, everyday comfort for your family, or refined modern wear inspired by tradition—Lindway offers a curated universe where heritage
            meets innovation.”
          </h4>
          <Motion tag="div" initialY={30} animateY={0} duration={1} className="flex items-center justify-between gap-16">
            <Img src="/images/about-lindway-lindway-philosophy-kanan.webp" alt="hero image" className="w-full max-w-sm min-h-500" cover />
            <div className="space-y-2 text-center">
              <h5 className="text-2xl font-semibold">Lindway Philosophy: </h5>
              <hr className="text-gray" />
              <h6 className="text-xl font-medium">Custom. Cultural. Conscious.</h6>
            </div>
          </Motion>
        </div>
      </div>
    </Container>
  );
};

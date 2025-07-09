import { Container, Img, Motion } from "@/components";

export const MyLindway = () => {
  return (
    <Container className="pt-16 text-gray space-y-14">
      <div className="flex items-center gap-24">
        <Motion tag="div" initialX={-50} animateX={0} duration={0.3} className="w-full max-w-96">
          <Img src="/images/people-13.webp" alt="people 13" className="w-full min-h-600" cover />
        </Motion>
        <Motion tag="div" initialX={50} animateX={0} duration={0.6} delay={0.3} className="space-y-4 text-justify">
          <h4 className="heading">My Lindway</h4>
          <p>Flagship brand of Lindway. Embrace Indonesian culture and tradition. Hand-crafted with love with a touch of understated elegance.</p>
          <div className="grid grid-cols-3 gap-4">
            <Img src="/images/clothes-16.webp" alt="clothes 16" className="w-full min-h-80" cover />
            <Img src="/images/clothes-17.webp" alt="clothes 17" className="w-full min-h-80" cover />
            <Img src="/images/clothes-18.webp" alt="clothes 18" className="w-full min-h-80" cover />
          </div>
          <a href="#" className="block pb-1 text-lg font-semibold border-b border-gray w-max">
            Shop Now
          </a>
        </Motion>
      </div>
      <div className="space-y-6">
        <h4 className="text-center heading">The Collections of My Lindway</h4>
        <div className="grid grid-cols-3 gap-x-4 gap-y-8"></div>
        <div className="flex justify-center">
          <a href="#" className="block pb-1 text-lg font-semibold border-b border-gray w-max">
            Shop Now
          </a>
        </div>
      </div>
      <Motion tag="div" initialX={0} animateX={0} duration={0.8} delay={0.4} className="relative flex-1 h-full gap-4">
        <div className="relative w-full h-auto">
          <video src="villa.mp4" className="w-full h-auto" autoPlay muted loop controls />
        </div>
      </Motion>
    </Container>
  );
};

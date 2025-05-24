import { Img, Motion } from "@/components";

const everySnap = ["/images/people-9.png", "/images/people-10.png", "/images/people-11.png", "/images/people-12.png", "/images/people-13.png"];

export const EverySnap = () => {
  return (
    <div className="py-16 space-y-6">
      <Motion tag="h3" initialY={0} animateY={0} duration={0.3} className="text-center heading">
        Style & Heritage in Every Snap
      </Motion>
      <Motion tag="div" initialY={0} animateY={0} duration={0.3} className="text-sm text-center md:text-base text-gray">
        <p>Celebrating timeless elegance and cultural craftsmanship in every moment.</p>
        <p>Follow us on Instagram @mylindway to explore more.</p>
      </Motion>
      <div className="grid grid-cols-5 gap-4">
        {everySnap.map((snap, index) => (
          <Motion key={index} tag="div" initialY={50} animateY={0} duration={0.3} delay={index * 0.1}>
            <Img src={snap} alt={`every snap ${index + 1}`} className="object-cover w-full min-h-400" cover />
          </Motion>
        ))}
      </div>
    </div>
  );
};

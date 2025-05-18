import { Img, Motion } from "@/components";

export const Characteristics = () => {
  return (
    <div className="pt-16 space-y-6">
      <Motion tag="h3" initialY={0} animateY={0} duration={0.3} className="text-center heading">
        Fabric Cloth Characteristics
      </Motion>
      <Motion tag="div" initialY={0} animateY={0} duration={0.3} className="text-sm text-center md:text-base text-gray">
        <p>Comfort and safety are our utmost priorities;</p>
        <p>We carefully select all our fabric clothes and choose the best quality.</p>
      </Motion>
      <div className="text-gray">
        <div className="grid grid-cols-2">
          <Motion tag="div" initialX={-50} animateX={0} duration={0.3} className="p-16 space-y-2">
            <h3 className="text-xl font-semibold">Garmen Care Instructions</h3>
            <menu className="text-sm list-disc">
              <li>Wash before the first wear Wash inside out</li>
              <li>Gentle cold water</li>
              <li>Hand wash only</li>
              <li>Avoid detergents with fragrances or dyes</li>
              <li>Do not bleach</li>
              <li>Do not tumble dry</li>
              <li>Warm iron</li>
              <li>Do not dry clean</li>
            </menu>
          </Motion>
          <Motion tag="div" initialX={50} animateX={0} duration={0.3}>
            <Img src="/images/people-7.png" alt="women's people 1" className="min-h-400" cover />
          </Motion>
        </div>
        <div className="grid grid-cols-2">
          <Motion tag="div" initialX={50} animateX={0} duration={0.3}>
            <Img src="/images/people-16.png" alt="women's people 2" className="min-h-400" cover />
          </Motion>
          <Motion tag="div" initialX={50} animateX={0} duration={0.3} className="p-16 space-y-2">
            <h3 className="text-xl font-semibold">Returns and Exchanges Policies</h3>
            <div className="space-y-1">
              <h3 className="text-lg font-medium">All items are final sale, not eligible for return</h3>
              <menu className="text-sm list-disc">
                <li>Non-refundable</li>
                <li>Non-modifiable</li>
                <li>Non-cashable</li>
                <li>Non-exchangeable</li>
                <li>Non-transferable</li>
              </menu>
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-medium">Special Conditions</h3>
              <p className="text-sm">Returned or exchanged may be provided; the items have to be in the same condition as when it is purchased. Items that include a bag must be returned with it.</p>
            </div>
          </Motion>
        </div>
      </div>
    </div>
  );
};

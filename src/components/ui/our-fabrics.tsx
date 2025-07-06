import { Container, Img } from "@/components";

import { fabricsLists } from "@/static/our-fabrics";

export const OurFabrics = () => {
  return (
    <div className="pt-16">
      <div className="space-y-8">
        <h3 className="text-center heading">Our Fabrics</h3>
        <div className="grid grid-cols-4 gap-4 mx-auto max-w-screen-2xl">
          {[...Array(4)].map((_, index) => (
            <div key={index} className={` relative`}>
              <Img src={`/images/our-fabric-category-image-${index + 1}.png`} alt={`our fabrics image ${index}`} className="w-full min-h-200" cover />
            </div>
          ))}
        </div>
      </div>
      <Container className="grid grid-cols-2 gap-8 py-8">
        {fabricsLists.map((fabric, index) => (
          <div key={index} className="space-y-2 text-gray">
            <h4 className="text-2xl font-medium">{fabric.name}</h4>
            <p className="text-sm leading-relaxed">{fabric.description}</p>
          </div>
        ))}
      </Container>
      <div className="max-w-4xl px-4 py-8 mx-auto space-y-8 text-center">
        <div className="space-y-2">
          <h3 className="text-2xl font-medium">Crafted by Hand</h3>
          <p className="text-sm leading-relaxed text-gray">
            Our fabrics often become the canvas for traditional techniques like hand embroidery, hand-painting, and sequin work. Every detail is created by skilled artisans who bring life to each
            piece through time-honored craftsmanship.
          </p>
        </div>
        <div className="grid max-w-xl grid-cols-3 gap-4 mx-auto">
          <Img src="/images/our-fabric-crafted-by-hand-image-1.png" alt="crafted image 1" className="w-full min-h-300" cover />
          <Img src="/images/our-fabric-crafted-by-hand-image-2.png" alt="crafted image 2" className="w-full min-h-300" cover />
          <Img src="/images/our-fabric-crafted-by-hand-image-3.png" alt="crafted image 3" className="w-full min-h-300" cover />
        </div>
      </div>

      <div className="space-y-8">
        <div className="max-w-4xl px-4 pt-8 mx-auto space-y-2 text-center">
          <h3 className="text-2xl font-medium">Thoughtfully Sourced</h3>
          <p className="text-sm leading-relaxed text-gray">
            We partner with local suppliers and small-scale producers to support ethical practices and celebrate Indonesian textile heritage. It&apos;s our way of ensuring quality — and preserving
            tradition — from the source.
          </p>
        </div>
        <div className="grid grid-cols-2">
          <Img src="/images/our-fabric-thoughtfully-image-1.png" alt="Thoughtfully image 1" className="w-full min-h-400" cover />
          <Img src="/images/our-fabric-thoughtfully-image-2.png" alt="Thoughtfully image 2" className="w-full min-h-400" cover />
        </div>
      </div>
    </div>
  );
};

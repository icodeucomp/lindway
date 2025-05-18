import { Background, Motion } from "@/components";

const initiatives = [
  {
    name: "Fair Business Practices",
    description: "We are committed to having fair business with all our suppliers and business partners by implementing purchasing practices and fair wages.",
    image: "/images/clothes-8.png",
  },
  {
    name: "Slow Fashion Movement",
    description: "Every piece made thoughtfully and manufactured suits the demand.",
    image: "/images/people-17.png",
  },
  {
    name: "Reducing Fabric Cloth Waste",
    description: "Maximizing the usage of the fabric cloth through all Lindway brands to minimize fabric-cloth waste.",
    image: "/images/clothes-7.png",
  },
  {
    name: "Upcycling, Reducing and Giving Back",
    description:
      "Keep continuing to reduce fabric cloth waste by collecting your baby's and kids' unused clothes, which still in good condition for us to upcycle. For any items purchased, 100% of the net profit will be donated, please keep updated with our future activities.",
    image: "/images/clothes-9.png",
  },
];

export const Initiative = () => {
  return (
    <div className="pt-16 space-y-6">
      <Motion tag="h3" initialY={0} animateY={0} duration={0.3} className="text-center heading">
        Conscious Initiatives
      </Motion>
      <div className="grid grid-cols-2">
        {initiatives.map((initiative, index) => (
          <Background key={initiative.name} src={initiative.image} alt="hero background" className="flex items-end min-h-300 bg-dark/30">
            <Motion tag="div" initialX={-50} animateX={0} duration={0.3} delay={index * 0.1} className="p-6 space-y-2 text-justify">
              <h3 className="text-lg font-bold">{initiative.name}</h3>
              <p className="text-sm text-gray-600">{initiative.description}</p>
            </Motion>
          </Background>
        ))}
      </div>
    </div>
  );
};

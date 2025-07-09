import { Img } from "../image";

export const CareInstructions = () => {
  return (
    <div className="grid grid-cols-2 py-16 mx-auto max-w-screen-2xl">
      <div className="p-16 space-y-4 text-gray">
        <h4 className="heading">Garment Care Instructions</h4>
        <ul className="pl-6 space-y-1 list-disc">
          <li>Wash before the first wear</li>
          <li>Wash inside out</li>
          <li>Gentle cold water</li>
          <li>Hand wash only</li>
          <li>Avoid detergents with fragrances or dyes</li>
          <li>Do not bleach</li>
          <li>Do not tumble dry</li>
          <li>Warm iron</li>
          <li>Do not dry clean</li>
        </ul>
      </div>
      <Img src="/images/care-instructions-garmen-image.webp" alt="image return exhanges" className="w-full min-h-500" />
    </div>
  );
};

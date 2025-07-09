import { Img } from "../image";

export const ReturnExchanges = () => {
  return (
    <div className="py-16 grid grid-cols-2 max-w-screen-2xl mx-auto">
      <Img src="/images/return-&-exchanges-policies-image.webp" alt="image return exhanges" className="w-full min-h-500" />
      <div className="space-y-4 p-16 text-gray">
        <h4 className="heading">Return and Exchanges Policies</h4>
        <ul className="list-disc pl-6 space-y-1">
          <li>All items are final sale, not eligible fo return</li>
          <li>Non-refundable</li>
          <li>Non-modifiable</li>
          <li>Non-cashable</li>
          <li>Non-exchangeable</li>
          <li>Non-transferable</li>
        </ul>
        <div className="space-y-1">
          <h5 className="text-xl font-medium">Special Conditions</h5>
          <p>Returned or exchanged may be provided; the items have to be in the same condition as when it is purchased. Items that include a bag must be returned with it.</p>
        </div>
      </div>
    </div>
  );
};

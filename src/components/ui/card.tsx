import { ImageSlider } from "@/components";
import { Product } from "@/types";

import { formatIDR, formatLowerKebabCase } from "@/utils";
import Link from "next/link";

import { PiWarningCircleLight } from "react-icons/pi";

type exception = "createdAt" | "updatedAt" | "isActive" | "discount" | "image" | "size" | "sku" | "stock" | "description";

export const CardProduct = ({ discountedPrice, images, name, price, notes, productionNotes, isPreOrder, category, id }: Omit<Product, exception>) => {
  return (
    <div className="space-y-2">
      <ImageSlider images={images.map((image) => image.url)} alt={name} showProgressBar={false} showCounter={false} autoPlay={false}>
        {isPreOrder && <div className="absolute top-0 left-0 py-2 px-4 bg-gray text-light text-sm">Pre Order</div>}
      </ImageSlider>
      <div className="space-y-4 text-gray">
        <div className="space-y-2">
          <Link href={`/product/${formatLowerKebabCase(category)}/${id}`} className="block w-max text-xl font-medium hover:text-darker-gray hover:font-semibold">
            {name}
          </Link>
          <div className="flex items-center justify-between font-light">
            <p className="text-xl">{formatIDR(+discountedPrice)}</p>
            <p className="text-xl line-through text-gray/50">{formatIDR(+price)}</p>
          </div>
        </div>
        <p className="text-sm">*{notes}</p>
        <div className="flex gap-2">
          <PiWarningCircleLight size={22} className="text-gray" />
          <p className="text-sm">
            {productionNotes} <br />{" "}
            <Link href="/shop" className="underline w-max">
              Learn how to shop
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

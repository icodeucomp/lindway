"use client";

import * as React from "react";

import { Container, Img, Motion } from "@/components";

const MyLindwayCollections = [
  { name: "Products", image: "/images/clothes-23.png", discountedPrice: "249000", price: "299000" },
  { name: "Products", image: "/images/clothes-24.png", discountedPrice: "199000", price: "499000" },
  { name: "Products", image: "/images/clothes-25.png", discountedPrice: "419000", price: "469000" },
  { name: "Products", image: "/images/clothes-26.png", discountedPrice: "419000", price: "600000" },
  { name: "Products", image: "/images/clothes-27.png", discountedPrice: "1999000", price: "2149000" },
  { name: "Products", image: "/images/clothes-28.png", discountedPrice: "999000", price: "1299000" },
];

export const LindwaySimply = () => {
  return (
    <Container className="pt-16 text-gray space-y-14">
      <div className="flex items-center gap-24">
        <Motion tag="div" initialX={-50} animateX={0} duration={0.6} delay={0.3} className="space-y-4 text-justify">
          <h4 className="heading">My Simply Lindway</h4>
          <p>
            It is part of Lindway brand, a home of our everyday wear that is designed for babies and children made from 100% cotton. All of our products are carefully crafted to ensure the comfort of
            your little ones.
          </p>
          <div className="grid grid-cols-3 gap-4">
            <Img src="/images/clothes-12.png" alt="clothes 12" className="w-full min-h-80" cover />
            <Img src="/images/clothes-13.png" alt="clothes 13" className="w-full min-h-80" cover />
            <Img src="/images/clothes-14.png" alt="clothes 14" className="w-full min-h-80" cover />
          </div>
          <a href="#" className="block pb-1 text-lg font-semibold border-b border-gray w-max">
            Shop Now
          </a>
        </Motion>
        <Motion tag="div" initialX={50} animateX={0} duration={0.3} className="w-full max-w-96">
          <Img src="/images/clothes-22.png" alt="clothes 22" className="w-full min-h-600" cover />
        </Motion>
      </div>
      <div className="space-y-6">
        <h4 className="text-center heading">
          The Collections <i>of</i> Simply by Lindway
        </h4>
        <div className="grid grid-cols-3 gap-x-4 gap-y-8">
          {MyLindwayCollections.map((item, index) => (
            <Motion key={`simply-${index}`} tag="div" initialY={50} animateY={0} duration={0.3} delay={index * 0.1} className="space-y-2">
              <Img src={item?.image || ""} alt={item?.name || ""} className="w-full min-h-500" cover />
              <div>
                <h5 className="text-lg font-semibold">{`${item?.name} ${index + 1}`}</h5>
                <div className="flex items-center justify-between font-medium">
                  <p>{item?.discountedPrice}</p>
                  <p className="line-through text-gray/50">{item?.price}</p>
                </div>
              </div>
            </Motion>
          ))}
        </div>
        <div className="flex justify-center">
          <a href="#" className="block pb-1 text-lg font-semibold border-b border-gray w-max">
            Shop Now
          </a>
        </div>
      </div>
      <Motion tag="div" initialX={0} animateX={0} duration={0.8} delay={0.4} className="relative flex-1 h-full gap-4">
        <Img src="/images/clothes-1.png" alt="clothes 1" className="w-full min-h-300" cover />
      </Motion>
    </Container>
  );
};

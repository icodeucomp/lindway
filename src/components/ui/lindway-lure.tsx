"use client";

import * as React from "react";

import { Container, Img, Motion } from "@/components";

const MyLindwayCollections = [
  { name: "Products", image: "/images/people-3.png", discountedPrice: "200000", price: "600000" },
  { name: "Products", image: "/images/people-15.png", discountedPrice: "999000", price: "1199000" },
  { name: "Products", image: "/images/people-4.png", discountedPrice: "220000", price: "460000" },
  { name: "Products", image: "/images/people-5.png", discountedPrice: "249000", price: "450000" },
  { name: "Products", image: "/images/people-6.png", discountedPrice: "1199000", price: "1499000" },
  { name: "Products", image: "/images/people-14.png", discountedPrice: "399000", price: "899000" },
];

export const LindwayLure = () => {
  return (
    <Container className="py-16 text-gray space-y-14">
      <div className="flex items-center gap-24">
        <Motion tag="div" initialX={-50} animateX={0} duration={0.3} className="w-full max-w-96">
          <Img src="/images/people-10.png" alt="people 10" className="w-full min-h-600" cover />
        </Motion>
        <Motion tag="div" initialX={50} animateX={0} duration={0.6} delay={0.3} className="space-y-4 text-justify">
          <h4 className="heading">Lure by Lindway</h4>
          <p>
            It is part of the Lindway brand, Lure by Lindway is a home for custom-made orders. All products are personalised suits to our customers requirements and carefully crafted to ensure your
            comfort.
          </p>
          <div className="grid grid-cols-3 gap-4">
            <Img src="/images/people-2.png" alt="people 2" className="w-full min-h-80" cover />
            <Img src="/images/people-11.png" alt="people 11" className="w-full min-h-80" cover />
            <Img src="/images/people-12.png" alt="people 12" className="w-full min-h-80" cover />
          </div>
          <a href="#" className="block pb-1 text-lg font-semibold border-b border-gray w-max">
            Shop Now
          </a>
        </Motion>
      </div>
      <div className="space-y-6">
        <h4 className="text-center heading">
          The Collections <i>of</i> Lure by Lindway
        </h4>
        <div className="grid grid-cols-3 gap-x-4 gap-y-8">
          {MyLindwayCollections.map((item, index) => (
            <Motion key={index} tag="div" initialY={50} animateY={0} duration={0.3} delay={index * 0.1} className="space-y-2">
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
    </Container>
  );
};

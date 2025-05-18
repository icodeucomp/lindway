"use client";

import * as React from "react";

import { Container, Img, Motion } from "@/components";

const MyLindwayCollections = [
  { name: "Products", image: "/images/clothes-15.png", discountedPrice: "300000", price: "500000" },
  { name: "Products", image: "/images/clothes-10.png", discountedPrice: "1999000", price: "2499000" },
  { name: "Products", image: "/images/clothes-11.png", discountedPrice: "420000", price: "460000" },
  { name: "Products", image: "/images/clothes-20.png", discountedPrice: "400000", price: "600000" },
  { name: "Products", image: "/images/clothes-19.png", discountedPrice: "3499000", price: "4199000" },
  { name: "Products", image: "/images/clothes-21.png", discountedPrice: "1399000", price: "1999000" },
];

export const MyLindway = () => {
  return (
    <Container className="pt-16 text-gray space-y-14">
      <div className="flex items-center gap-24">
        <Motion tag="div" initialX={-50} animateX={0} duration={0.3} className="w-full max-w-96">
          <Img src="/images/people-13.png" alt="people 13" className="w-full min-h-600" cover />
        </Motion>
        <Motion tag="div" initialX={50} animateX={0} duration={0.6} delay={0.3} className="space-y-4 text-justify">
          <h4 className="heading">My Lindway</h4>
          <p>Flagship brand of Lindway. Embrace Indonesian culture and tradition. Hand-crafted with love with a touch of understated elegance.</p>
          <div className="grid grid-cols-3 gap-4">
            <Img src="/images/clothes-16.png" alt="clothes 16" className="w-full min-h-80" cover />
            <Img src="/images/clothes-17.png" alt="clothes 17" className="w-full min-h-80" cover />
            <Img src="/images/clothes-18.png" alt="clothes 18" className="w-full min-h-80" cover />
          </div>
          <a href="#" className="block pb-1 text-lg font-semibold border-b border-gray w-max">
            Shop Now
          </a>
        </Motion>
      </div>
      <div className="space-y-6">
        <h4 className="text-center heading">The Collections of My Lindway</h4>
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
      <Motion tag="div" initialX={0} animateX={0} duration={0.8} delay={0.4} className="relative flex-1 h-full gap-4">
        <div className="relative w-full h-auto">
          <video src="villa.mp4" className="w-full h-auto" autoPlay muted loop controls />
        </div>
      </Motion>
    </Container>
  );
};

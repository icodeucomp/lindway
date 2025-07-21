"use client";

import Link from "next/link";

import { Container, Img, Motion } from "@/components";

import { ApiResponse, Product } from "@/types";

import { productsApi } from "@/utils";

import { CardProduct } from "../card";

export const Products = () => {
  const { data: products, isLoading } = productsApi.useGetProducts<ApiResponse<Product[]>>({ key: ["products"], params: { limit: 3 } });

  return (
    <Container className="py-16 space-y-16">
      <div className="space-y-8">
        <Motion tag="h2" initialY={50} animateY={0} duration={0.2} className="text-center heading">
          Discover the World of Lindway
        </Motion>
        <Motion tag="p" initialY={50} animateY={0} duration={0.2} className="text-center max-w-screen-lg mx-auto">
          Lindway is the parent house of three distinctive brands—each with a unique story, yet united by a shared commitment to craftsmanship, cultural heritage, and design excellence.
        </Motion>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="loader"></div>
          </div>
        ) : (
          <Motion tag="div" initialY={50} animateY={0} duration={0.3} delay={0.3} className="grid grid-cols-3 gap-x-6 gap-y-10 min-h-400">
            {products?.data.map((item, index) => (
              <CardProduct
                key={index}
                id={item.id}
                discountedPrice={item.discountedPrice}
                images={item.images}
                name={item.name}
                notes={item.notes}
                price={item.price}
                productionNotes={item.productionNotes}
                isPreOrder={item.isPreOrder}
                category={item.category}
              />
            ))}
          </Motion>
        )}
      </div>
      <div className="space-y-8">
        <Motion tag="div" initialX={-50} animateX={0} duration={0.2} className="flex gap-4 items-center">
          <Img src="/images/home-product-my-lindway.webp" alt="my lindway image" className="min-h-80 w-full max-w-2xl" position="top" cover />
          <div className="text-center space-y-2 w-full text-gray">
            <h4 className="text-2xl font-semibold">My Lindway</h4>
            <p className="text-lg font-light">Embracing Artistry, Celebrating Culture</p>
            <Link href="/my-lindway" className="text-gray p-2 border-b block w-max mx-auto text-sm font-medium">
              Discover Collection
            </Link>
          </div>
        </Motion>
        <Motion tag="div" initialX={50} animateX={0} duration={0.2} delay={0.1} className="flex gap-4 items-center">
          <div className="text-center space-y-2 w-full text-gray">
            <h4 className="text-2xl font-semibold">Simply Lindway</h4>
            <p className="text-lg font-light">Pure Cotton Comfort</p>
            <Link href="/my-lindway" className="text-gray p-2 border-b block w-max mx-auto text-sm font-medium">
              Discover Collection
            </Link>
          </div>
          <Img src="/images/home-product-simply-lindway.webp" alt="my lindway image" className="min-h-80 w-full max-w-2xl" position="top" cover />
        </Motion>
        <Motion tag="div" initialX={-50} animateX={0} duration={0.2} delay={0.2} className="flex gap-4 items-center">
          <Img src="/images/home-product-lure-by-lindway.webp" alt="my lindway image" className="min-h-80 w-full max-w-2xl" position="top" cover />
          <div className="text-center space-y-2 w-full text-gray">
            <h4 className="text-2xl font-semibold">Lure by Lindway</h4>
            <p className="text-lg font-light">Traditional Soul, Modern Edge</p>
            <Link href="/my-lindway" className="text-gray p-2 border-b block w-max mx-auto text-sm font-medium">
              Discover Collection
            </Link>
          </div>
        </Motion>
      </div>
    </Container>
  );
};

"use client";

import * as React from "react";

import Link from "next/link";

import { Container, Img, Motion } from "@/components";

import { CardProduct } from "../card-product";

import { productsApi } from "@/utils";

import { ApiResponse, Categories, Product } from "@/types";

const ProductDetail = () => {
  const [page, setPage] = React.useState<number>(1);
  const [allProducts, setAllProducts] = React.useState<Product[]>([]);
  const [hasMore, setHasMore] = React.useState<boolean>(true);
  const limit = 6;

  const {
    data: simplyLindwayProducts,
    isError,
    isLoading,
  } = productsApi.useGetProducts<ApiResponse<Product[]>>({
    key: ["products", Categories.LURE_BY_LINDWAY, page],
    params: {
      category: Categories.LURE_BY_LINDWAY,
      page,
      limit,
    },
  });

  React.useEffect(() => {
    if (simplyLindwayProducts?.data) {
      if (page === 1) {
        setAllProducts(simplyLindwayProducts.data);
      } else {
        setAllProducts((prev) => [...prev, ...simplyLindwayProducts.data]);
      }

      const totalLoaded = page * limit;
      setHasMore(totalLoaded < simplyLindwayProducts.pagination.total);
    }
  }, [simplyLindwayProducts, page, limit]);

  const handleLoadMore = React.useCallback(() => {
    if (!isLoading && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [isLoading, hasMore]);

  if (isError) {
    return <div className="text-red-600 p-4 text-center py-16">Error loading products. Please try again.</div>;
  }

  return (
    <div className="space-y-6">
      <Motion tag="h4" initialY={50} animateY={0} duration={0.2} className="text-center heading">
        The Collections of My Lindway
      </Motion>

      {isLoading && page === 1 ? (
        <div className="flex justify-center items-center py-8">
          <div className="loader"></div>
        </div>
      ) : (
        <Motion tag="div" initialY={50} animateY={0} duration={0.3} delay={0.3} className="grid grid-cols-3 gap-x-6 gap-y-10 min-h-400">
          {allProducts.map((item, index) => (
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

      <div className="h-16 flex flex-col items-center justify-center space-y-2">
        {isLoading && page > 1 && (
          <div className="flex justify-center items-center py-8">
            <div className="loader"></div>
          </div>
        )}

        {!isLoading && hasMore && (
          <div className="flex justify-center text-gray">
            <button onClick={handleLoadMore} disabled={isLoading} className="block pb-1 text-lg font-medium border-b border-gray w-max">
              Discover More
            </button>
          </div>
        )}

        {!isLoading && !hasMore && allProducts.length > 0 && <div className="text-center py-4 text-gray">No more product</div>}
      </div>
    </div>
  );
};

export const LureByLindway = () => {
  return (
    <div className="space-y-12">
      <Container className="text-gray space-y-14">
        <div className="flex items-center gap-24">
          <Motion tag="div" initialX={-50} animateX={0} duration={0.3} className="w-full max-w-96">
            <Img src="/images/lure-by-lindway-description-big.webp" alt="lure-by-lindway-description-big" className="w-full min-h-700" cover />
          </Motion>
          <Motion tag="div" initialX={50} animateX={0} duration={0.6} delay={0.3} className="space-y-4 text-justify">
            <div className="space-y-1">
              <h4 className="heading">Lure by Lindway</h4>
              <h5 className="text-xl italic font-light">Traditional Soul, Modern Edge</h5>
            </div>
            <p className="text-sm">
              Our contemporary menswear line blends Balinese tradition with modern design. In collaboration with local artists, each garment showcases ornamental influences and cultural
              storytelling—crafted to wear, admire, and connect with.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <Img src="/images/lure-by-lindway-description-list-1.webp" alt="lure-by-lindway-description-list-1" className="w-full min-h-80" cover />
              <Img src="/images/lure-by-lindway-description-list-2.webp" alt="lure-by-lindway-description-list-2" className="w-full min-h-80" cover />
              <Img src="/images/lure-by-lindway-description-list-3.webp" alt="lure-by-lindway-description-list-3" className="w-full min-h-80" cover />
            </div>
          </Motion>
        </div>

        <ProductDetail />
      </Container>
      <Motion tag="div" initialY={0} animateY={0} duration={0.3} className="mx-auto space-y-12 text-gray max-w-screen-2xl">
        <div className="flex gap-6 overflow-hidden">
          <div className="flex flex-col items-center justify-center w-full max-w-lg gap-4 text-center">
            <div className="space-y-1">
              <h5 className="text-2xl font-semibold">My Lindway</h5>
              <h6 className="mx-auto text-xl italic font-light leading-6 max-w-60">Embracing Artistry, Celebrating Culture</h6>
            </div>
            <Link href="/my-lindway" className="block pb-1 text-lg font-medium border-b border-gray w-max">
              Discover Now
            </Link>
          </div>
          <Img src="/images/my-lindway-description-list-1.webp" alt="my-lindway-description-list-1" className="w-full max-w-96 min-h-500" cover />
          <Img src="/images/my-lindway-description-list-2.webp" alt="my-lindway-description-list-1" className="w-full max-w-96 min-h-500" cover />
          <Img src="/images/my-lindway-description-list-3.webp" alt="my-lindway-description-list-1" className="w-full max-w-44 min-h-500" cover />
        </div>
      </Motion>
      <Motion tag="div" initialY={0} animateY={0} duration={0.3} className="mx-auto space-y-12 text-gray max-w-screen-2xl">
        <div className="flex gap-6 overflow-hidden">
          <Img src="/images/simply-lindway-description-list-1.webp" alt="simply-lindway-description-list-1" className="w-full max-w-44 min-h-500" cover />
          <Img src="/images/simply-lindway-description-list-2.webp" alt="simply-lindway-description-list-1" className="w-full max-w-96 min-h-500" cover />
          <Img src="/images/simply-lindway-description-list-3.webp" alt="simply-lindway-description-list-1" className="w-full max-w-96 min-h-500" cover />
          <div className="flex flex-col items-center justify-center w-full max-w-lg gap-4 text-center">
            <div className="space-y-1">
              <h5 className="text-2xl font-semibold">Simply Lindway</h5>
              <h6 className="mx-auto text-xl italic font-light leading-6 max-w-60">Pure Cotton Comfort</h6>
            </div>
            <Link href="/simply-lindway" className="block pb-1 text-lg font-medium border-b border-gray w-max">
              Discover Now
            </Link>
          </div>
        </div>
      </Motion>
    </div>
  );
};

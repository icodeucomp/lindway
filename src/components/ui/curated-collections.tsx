"use client";

import * as React from "react";

import { IoIosArrowDown } from "react-icons/io";

import { Container, Motion } from "@/components";

import { CardProduct } from "./card";

import { productsApi } from "@/utils";

import { ApiResponse, Product } from "@/types";

const ProductDetail = () => {
  const [page, setPage] = React.useState<number>(1);
  const [allProducts, setAllProducts] = React.useState<Product[]>([]);
  const [hasMore, setHasMore] = React.useState<boolean>(true);
  const limit = 9;

  const {
    data: simplyLindwayProducts,
    isError,
    isLoading,
  } = productsApi.useGetProducts<ApiResponse<Product[]>>({
    key: ["products", page],
    params: {
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

export const CuratedCollections = () => {
  return (
    <Container className="space-y-8 pt-10">
      <div className="space-y-4 text-center text-gray">
        <h1 className="text-4xl font-medium">Curated Collections</h1>
        <p>
          Each piece in our collection is thoughtfully curated to celebrate the richness of Indonesia&apos;s cultural heritage. Crafted on a made-to-order basis, our flagship designs embrace the art
          of slow fashion—honoring quality, individuality, and intentionality. From intricate embroidery and hand-painted fabrics to delicate sequin artistry, every My Lindway creation is a personal
          expression of elegance.
        </p>
        <button className="flex items-center gap-1 pb-1.5 mx-auto border-b border-gray">
          Read More <IoIosArrowDown size={18} />
        </button>
      </div>
      <Motion tag="div" initialX={0} animateX={0} duration={0.8} delay={0.4} className="relative flex-1 h-full gap-4">
        <div className="relative w-full h-auto">
          <video src="/villa.mp4" className="w-full h-auto" autoPlay muted loop controls />
        </div>
      </Motion>
      <Motion tag="h4" initialY={50} animateY={0} duration={0.2} className="py-4 text-3xl font-medium text-center text-gray">
        “Whether you&apos;re seeking a handcrafted statement piece, everyday comfort for your family, or refined modern wear inspired by tradition—Lindway offers a curated universe where heritage
        meets innovation.”
      </Motion>

      <ProductDetail />
    </Container>
  );
};

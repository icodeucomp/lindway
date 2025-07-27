"use client";

import * as React from "react";

import Link from "next/link";

import { useCartStore } from "@/hooks";

import { Button, Container, Img, Motion } from "@/components";

import { CardProduct } from "./card-product";

import toast from "react-hot-toast";

import { MdOutlineArrowBackIos } from "react-icons/md";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import { PiWarningCircleLight } from "react-icons/pi";

import { formatIDR, formatTitleCase, formatUpperKebabCase, productsApi } from "@/utils";

import { ApiResponse, Product } from "@/types";

export const ProductDetail = ({ id, category }: { id: string; category: string }) => {
  const { addToCart } = useCartStore();
  const { data: product, isLoading: loadProduct, error: errorProduct } = productsApi.useGetProduct<ApiResponse<Product>>({ key: ["product", id], id });

  const [allProducts, setAllProducts] = React.useState<Product[]>([]);
  const [page, setPage] = React.useState<number>(1);
  const [hasMore, setHasMore] = React.useState<boolean>(true);
  const [selectedSize, setSelectedSize] = React.useState<string>("");
  const [currentImageIndex, setCurrentImageIndex] = React.useState<number>(0);
  const [thumbnailStartIndex, setThumbnailStartIndex] = React.useState<number>(0);

  const maxVisibleScroll = 3;
  const limit = 6;

  const {
    data: products,
    isLoading: loadProducts,
    isError: errorProducts,
  } = productsApi.useGetProducts<ApiResponse<Product[]>>({
    key: ["products", formatUpperKebabCase(category)],
    params: { category: formatUpperKebabCase(category) },
  });

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  const handleAddToCart = () => {
    if (selectedSize === "") {
      toast.error("Please choose the size first");
      return;
    }
    addToCart(id, product?.data as Product, 1, selectedSize);
    toast.success(`${product?.data.name} has been added to your cart with size ${selectedSize}.`);
  };

  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
    updateThumbnailView(index);
  };

  const updateThumbnailView = (selectedIndex: number) => {
    const totalImages = product?.data.images.length || 0;
    if (totalImages <= maxVisibleScroll) {
      setThumbnailStartIndex(0);
      return;
    }
    if (selectedIndex >= thumbnailStartIndex + maxVisibleScroll) {
      setThumbnailStartIndex(selectedIndex - maxVisibleScroll + 1);
    } else if (selectedIndex < thumbnailStartIndex) {
      setThumbnailStartIndex(selectedIndex);
    }
  };

  const scrollThumbnailsUp = () => {
    if (thumbnailStartIndex > 0) {
      setThumbnailStartIndex(thumbnailStartIndex - 1);
    }
  };

  const scrollThumbnailsDown = () => {
    const totalImages = product?.data.images.length || 0;
    if (thumbnailStartIndex + maxVisibleScroll < totalImages) {
      setThumbnailStartIndex(thumbnailStartIndex + 1);
    }
  };

  React.useEffect(() => {
    if (products?.data) {
      if (page === 1) {
        setAllProducts(products.data);
      } else {
        setAllProducts((prev) => [...prev, ...products.data]);
      }

      const totalLoaded = page * limit;
      setHasMore(totalLoaded < products.pagination.total);
    }
  }, [products, page, limit]);

  const handleLoadMore = React.useCallback(() => {
    if (!loadProducts && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [loadProducts, hasMore]);

  if (loadProduct) {
    return (
      <div className="flex items-center justify-center pt-16">
        <div className="loader"></div>
      </div>
    );
  }

  if (errorProduct) {
    return <div className="px-4 py-3 text-center text-red-700 border border-red-200 rounded-lg bg-red-50 mt-16">Error loading products. Please try again.</div>;
  }

  return (
    <Container className="pt-10">
      <div className="relative flex items-center justify-center py-6">
        <button className="absolute left-0 flex items-center gap-2 transition-colors top-1/2 -translate-y-1/2 text-gray hover:text-darker-gray">
          <MdOutlineArrowBackIos />
          Back
        </button>
        <nav className="text-lg text-gray">
          <Link href={`/${category}`} className="text-darker-gray">
            {formatTitleCase(category)}
          </Link>
          <span className="mx-2">/</span>
          {product && <span className="text-gray/50">{product.data.name}</span>}
        </nav>
      </div>

      <>
        {product && product.data.images && (
          <div className="flex flex-col w-full gap-8 lg:flex-row">
            <Motion tag="div" initialX={-50} animateX={0} duration={0.2} className="flex w-full max-w-2xl gap-8">
              <div className="relative flex items-center justify-center w-full overflow-hidden rounded-lg bg-gray/20">
                <Img src={product.data.images[currentImageIndex].url} alt="Thumbnail Image" className="w-full h-full aspect-[3/4]" cover />

                <div className="absolute px-2 py-1 text-sm bg-opacity-50 rounded bg-dark text-light bottom-4 left-4">
                  {currentImageIndex + 1} / {product.data.images.length}
                </div>
              </div>

              <div className="flex flex-col items-center w-full max-w-40">
                <button onClick={scrollThumbnailsUp} className="p-2" disabled={thumbnailStartIndex === 0}>
                  <SlArrowUp className={`size-6 ${thumbnailStartIndex === 0 ? "text-gray/20" : "text-dark"}`} />
                </button>

                <div className="grid grid-rows-3 gap-2 w-full h-full p-2 overflow-hidden">
                  {product.data.images.slice(thumbnailStartIndex, thumbnailStartIndex + maxVisibleScroll).map((image, displayIndex) => {
                    const actualIndex = thumbnailStartIndex + displayIndex;
                    return (
                      <button
                        key={displayIndex}
                        onClick={() => selectImage(actualIndex)}
                        className={`w-full h-full rounded-lg overflow-hidden ${currentImageIndex === actualIndex ? "border-2 border-gray" : "border-none"}`}
                      >
                        <Img src={image.url} alt={image.alt} className="aspect-[3/4] w-full h-full" cover />
                      </button>
                    );
                  })}
                </div>

                <button onClick={scrollThumbnailsDown} className="p-2" disabled={thumbnailStartIndex + maxVisibleScroll >= product.data.images.length}>
                  <SlArrowDown className={`size-6 ${thumbnailStartIndex + maxVisibleScroll >= product.data.images.length ? "text-gray/20" : "text-dark"}`} />
                </button>
              </div>
            </Motion>

            <Motion tag="div" initialX={50} animateX={0} duration={0.2} className="w-full max-w-md space-y-6">
              <div className="space-y-2 text-gray">
                <p className="text-sm">{formatTitleCase(category)}</p>
                <h1 className="text-3xl font-semibold">{product.data.name}</h1>
                {product.data.isPreOrder && <span className="inline-block px-2 py-1 text-xs rounded bg-darker-gray text-light">Pre-Order</span>}
              </div>

              <div className="flex items-start gap-2">
                <span className="text-2xl font-medium text-gray">{formatIDR(product.data.discountedPrice)}</span>
                <span className="text-lg line-through text-gray/30">{formatIDR(product.data.price)}</span>
              </div>

              <div className="mb-6 space-y-4">
                <div className="flex items-start gap-4">
                  <p className="text-sm font-medium text-gray">Size</p>
                  <Link href="/size-guide" className="text-sm underline text-blue-500 hover:text-blue-700">
                    Size Guide
                  </Link>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {product.data.sizes.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleSizeSelect(item.size)}
                      className={`relative border-2 rounded py-2 px-3 text-sm text-gray ${
                        selectedSize === item.size ? "border-gray bg-gray/10" : item.quantity > 0 ? "border-gray/30 bg-light" : "border-gray/10 bg-gray/5 text-light cursor-not-allowed"
                      }`}
                      disabled={item.quantity === 0}
                    >
                      {item.size}
                      {item.quantity <= 0 && <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs px-1 py-0.5 rounded-full">Out</span>}
                    </button>
                  ))}
                </div>
                {selectedSize && (
                  <div className="flex items-center gap-2 py-2 px-4 bg-gray/10 border border-gray/30 rounded-lg text-gray">
                    <div className="size-2 bg-gray rounded-full"></div>
                    <span className="font-medium text-sm">
                      Size {selectedSize} - {product.data.sizes.find((s) => s.size === selectedSize)?.quantity} items in stock
                    </span>
                  </div>
                )}
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={!selectedSize}
                className={`flex items-center justify-center w-full gap-2 ${selectedSize ? "btn-gray" : "bg-gray/50 text-light cursor-not-allowed"}`}
              >
                <Img src="/icons/cart-light.svg" alt="car light" className="size-6" />
                Add to Cart
              </Button>

              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray">Description</h3>
                <p className="text-sm leading-relaxed text-gray">{product.data.description}</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray">Note</h3>
                <p className="text-sm text-gray">* {product.data.notes}</p>
                <div className="flex items-center gap-2 text-sm text-gray">
                  <PiWarningCircleLight size={22} className="text-gray flex-shrink-0" />
                  <div>
                    <p>{product.data.productionNotes}</p>
                    <Link href="/shop" className="block underline text-blue-500 hover:text-blue-700">
                      Learn How to Shop
                    </Link>
                  </div>
                </div>
              </div>
            </Motion>
          </div>
        )}
      </>

      {errorProducts ? (
        <div className="text-red-600 p-4 text-center py-16">Error loading products. Please try again.</div>
      ) : (
        <div className="pt-12 space-y-8">
          <Motion tag="h4" initialY={50} animateY={0} duration={0.2} className="text-center heading">
            The Collections of {formatTitleCase(category)}
          </Motion>
          {loadProducts && page === 1 ? (
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
            {loadProducts && page > 1 && (
              <div className="flex justify-center items-center py-8">
                <div className="loader"></div>
              </div>
            )}

            {!loadProducts && hasMore && (
              <div className="flex justify-center text-gray">
                <button onClick={handleLoadMore} disabled={loadProducts} className="block pb-1 text-lg font-medium border-b border-gray w-max">
                  Discover More
                </button>
              </div>
            )}

            {!loadProducts && !hasMore && allProducts.length > 0 && <div className="text-center py-4 text-gray">No more product</div>}
          </div>
        </div>
      )}
    </Container>
  );
};

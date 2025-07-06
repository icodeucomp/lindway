"use client";

import * as React from "react";

import { useCartStore } from "@/hooks";

import { Img, Container, Button } from "@/components";

import { FaMinus, FaPlus, FaShoppingCart, FaTrash } from "react-icons/fa";

import { _formatTitleCase, formatIDR } from "@/utils";

import { categoryBgColors } from "@/static/categories";

export const CartProduct = () => {
  const {
    cart,
    selectedItems,
    toggleItemSelection,
    toggleCategorySelection,
    selectAllItems,
    deselectAllItems,
    getSelectedTotal,
    getSelectedCount,
    isCategorySelected,
    isCategoryPartiallySelected,
    removeSelectedItems,
    updateQuantity,
    removeFromCart,
  } = useCartStore();

  const [isHydrated, setIsHydrated] = React.useState<boolean>(false);

  const cartItem = Object.entries(
    cart.reduce((acc, product) => {
      const category = product.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {} as Record<string, typeof cart>)
  );

  const getItemKey = (id: string, size: string) => `${id}-${size}`;

  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="loader"></div>
      </div>
    );
  }

  // If cart is empty, show empty state
  if (cart.length === 0) {
    return (
      <Container className="py-10">
        <div className="bg-light rounded-lg p-8 mb-4 text-center">
          <div className="flex flex-col items-center space-y-4">
            <FaShoppingCart className="text-6xl text-gray/50" />
            <div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">Your cart is empty</h3>
              <p className="text-gray/70">Add some products to get started</p>
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-light rounded-lg mt-4">Continue Shopping</Button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-10">
      <div className="bg-light rounded-lg p-4 mb-4">
        <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray">
          <div className="col-span-1">
            <input
              type="checkbox"
              className="size-4 accent-primary rounded"
              checked={cart.length > 0 && selectedItems.size === cart.length}
              onChange={() => {
                if (selectedItems.size === cart.length) {
                  deselectAllItems();
                } else {
                  selectAllItems();
                }
              }}
            />
          </div>
          <div className="col-span-4">Product</div>
          <div className="col-span-2 text-center">Price</div>
          <div className="col-span-2 text-center">Quantity</div>
          <div className="col-span-2 text-center">Total Price</div>
          <div className="col-span-1 text-center">Action</div>
        </div>
      </div>

      <>
        {cartItem.map(([category, products]) => (
          <div key={category} className="rounded-lg overflow-hidden mb-6 bg-light text-gray text-sm">
            <div className="grid grid-cols-12 p-4 border-b border-gray/30">
              <div className="col-span-1">
                <input
                  type="checkbox"
                  className="size-4 accent-primary rounded"
                  checked={isCategorySelected(category)}
                  ref={(input) => {
                    if (input) {
                      input.indeterminate = isCategoryPartiallySelected(category);
                    }
                  }}
                  onChange={() => toggleCategorySelection(category)}
                />
              </div>
              <div className="col-span-4 space-x-2">
                <span className={`px-3 py-1 text-light rounded-lg ${categoryBgColors[category as keyof typeof categoryBgColors]}`}>{_formatTitleCase(category)}</span>
                <span className="text-sm text-gray">({products.length} items)</span>
              </div>
            </div>

            {/* Products in this category */}
            {products.map((product) => {
              const itemKey = getItemKey(product.id, product.selectedSize);
              const isSelected = selectedItems.has(itemKey);
              return (
                <div key={`${product.id}-${product.selectedSize}`} className="grid grid-cols-12 gap-4 items-center p-4">
                  <div className="col-span-1">
                    <input type="checkbox" className="size-4 accent-primary rounded" checked={isSelected} onChange={() => toggleItemSelection(product.id, product.selectedSize)} />
                  </div>

                  <div className="col-span-4">
                    <div className="flex items-center space-x-3">
                      <Img src={product.images[0].url} alt={product.name} className="w-20 aspect-square rounded-lg" cover />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
                        <p>Selected Size: {product.selectedSize}</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2 text-center">
                    <span className="font-medium text-gray">{formatIDR(product.price)}</span>
                  </div>

                  <div className="col-span-2">
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => updateQuantity(product.id, product.selectedSize, product.quantity - 1)}
                        className="size-8 flex items-center justify-center border rounded border-gray/30"
                        disabled={product.quantity <= 1}
                      >
                        <FaMinus />
                      </button>
                      <span className="w-12 text-center font-medium">{product.quantity}</span>
                      <button onClick={() => updateQuantity(product.id, product.selectedSize, product.quantity + 1)} className="size-8 flex items-center justify-center border rounded border-gray/30">
                        <FaPlus />
                      </button>
                    </div>
                  </div>

                  <div className="col-span-2 text-center">
                    <span className="font-semibold text-gray">{formatIDR(product.price * product.quantity)}</span>
                  </div>

                  <div className="col-span-1 text-center">
                    <button onClick={() => removeFromCart(product.id, product.selectedSize)} className="flex items-center gap-1 text-gray hover:text-blue-700 text-sm">
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </>

      <div className="flex justify-between items-center p-6 rounded-lg bg-light text-gray">
        <div className="flex items-center gap-4">
          <input
            type="checkbox"
            className="size-4 accent-primary rounded"
            checked={cart.length > 0 && selectedItems.size === cart.length}
            onChange={() => {
              if (selectedItems.size === cart.length) {
                deselectAllItems();
              } else {
                selectAllItems();
              }
            }}
          />
          <span className="text-sm">Select All</span>
          <button
            onClick={() => {
              if (!window.confirm("Are you sure you want to delete?")) return;
              removeSelectedItems();
            }}
            className="text-sm flex items-center gap-1"
          >
            <FaTrash /> Delete
          </button>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center gap-1">
            <span className="text-sm">Total ({getSelectedCount()} item): </span>
            <span className="text-xl font-bold">{formatIDR(getSelectedTotal())}</span>
          </div>
          <Button className="bg-gray hover:bg-darker-gray text-light rounded-lg">Buy Now</Button>
        </div>
      </div>
    </Container>
  );
};

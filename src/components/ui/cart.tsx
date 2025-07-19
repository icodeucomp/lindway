"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import { useCartStore } from "@/hooks";

import { Img, Container, Button, Modal, ProgressBar } from "@/components";

import { FaArrowLeft, FaCheckCircle, FaCreditCard, FaMinus, FaPlus, FaQrcode, FaShoppingCart, FaTrash } from "react-icons/fa";

import { _formatTitleCase, cartsApi, imagesApi, formatIDR } from "@/utils";

import { ProductImage } from "@/types";

type CheckoutStep = "summary" | "payment" | "complete";

interface FormData {
  email: string;
  fullname: string;
  image: ProductImage | null;
  isUploading: boolean;
  uploadProgress: number;
}

const initFormData: FormData = { email: "", fullname: "", image: null, isUploading: false, uploadProgress: 0 };

const OrderSummary = ({ isVisible, onClose, price, totalItem }: { isVisible: boolean; onClose: () => void; price: number; totalItem: number }) => {
  const { addSelectedItems, clearCart } = useCartStore();

  const [currentStep, setCurrentStep] = React.useState<CheckoutStep>("summary");
  const [selectedPayment, setSelectedPayment] = React.useState<"qris" | "credit" | null>(null);

  const [formData, setFormData] = React.useState<FormData>(initFormData);

  const addCarts = cartsApi.useCarts({
    onSuccess: () => {
      setCurrentStep("complete");
    },
  });

  const handleImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    setFormData((prevFormData) => ({ ...prevFormData, isUploading: true }));
    setFormData((prevFormData) => ({ ...prevFormData, uploadProgress: 0 }));

    const respImages = await imagesApi.uploadImages(files, "/receipt", (progress: number) => {
      setFormData((prevFormData) => ({ ...prevFormData, uploadProgress: progress }));
    });

    setFormData((prevFormData) => ({ ...prevFormData, isUploading: false }));
    setFormData((prevFormData) => ({ ...prevFormData, uploadProgress: 0 }));

    setFormData((prevImages) => ({ ...prevImages, image: respImages[0] }));
  };

  const handleDeleteImages = async (subPath: string) => {
    await imagesApi.deleteImage(subPath, (progress: number) => {
      setFormData((prevFormData) => ({ ...prevFormData, deletingProgress: progress }));
    });

    setFormData((prevImages) => ({ ...prevImages, image: null }));
  };

  const handleFormSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.fullname) {
      alert("Please fill in email and fullname");
      return;
    }
    setCurrentStep("payment");
  };

  const handlePaymentSubmit = async () => {
    if (!selectedPayment) {
      alert("Please select a payment method");
      return;
    }

    if (!formData.image) {
      alert("Please input receipt first");
      return;
    }

    addCarts.mutate({ email: formData.email, fullname: formData.fullname, receiptImage: formData.image, items: addSelectedItems() });
  };

  const handleClose = () => {
    setCurrentStep("summary");
    setSelectedPayment(null);
    setFormData(initFormData);
    clearCart();
    onClose();
  };

  const renderSummaryStep = () => (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h2>

      <div className="bg-gray-50 p-4 mb-6 text-gray-800 rounded-lg">
        <h4 className="font-semibold mb-3">Order Summary</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>
              Subtotal ({totalItem} item{totalItem > 1 ? "s" : ""})
            </span>
            <span>{formatIDR(price)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>Free</span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{formatIDR(price)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 text-gray-800">
        <div className="space-y-1">
          <label className="block text-sm font-medium mb-1">Email Address</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="block w-full px-3 py-2 border border-gray/30 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:ring-2 focus:border-blue-500"
            placeholder="your@email.com"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            value={formData.fullname}
            onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
            className="block w-full px-3 py-2 border border-gray/30 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:ring-2 focus:border-blue-500"
            placeholder="John Doe"
            required
          />
        </div>

        <div className="flex items-center w-full gap-3 pt-4">
          <Button onClick={handleClose} className="btn-outline w-full">
            Cancel
          </Button>
          <Button onClick={handleFormSubmit} className="btn-gray w-full flex items-center justify-center gap-2">
            <FaCreditCard size={18} />
            Next
          </Button>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-darker-gray">Secure checkout process</p>
      </div>
    </>
  );

  const renderPaymentStep = () => (
    <>
      <div className="flex items-center mb-6 gap-4">
        <button onClick={() => setCurrentStep("summary")} className="p-1 hover:bg-gray/5 rounded">
          <FaArrowLeft size={16} />
        </button>
        <h2 className="text-2xl font-bold text-gray">Payment Method</h2>
      </div>

      <div className="bg-gray/5 p-4 mb-6 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-gray">Total Amount</span>
          <span className="text-xl font-bold text-gray">{formatIDR(price)}</span>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div
          onClick={() => setSelectedPayment("qris")}
          className={`border rounded-lg p-4 cursor-pointer transition-colors ${selectedPayment === "qris" ? "border-blue-500 bg-blue-50" : "border-gray hover:border-darker-gray"}`}
        >
          <div className="flex items-center gap-4">
            <FaQrcode size={24} className="text-blue-500" />
            <div>
              <div className="font-medium text-gray">QRIS Payment</div>
              <div className="text-sm text-gray">Scan QR code with your mobile banking app</div>
            </div>
          </div>
        </div>

        <div
          onClick={() => setSelectedPayment("credit")}
          className={`border rounded-lg p-4 cursor-pointer transition-colors ${selectedPayment === "credit" ? "border-blue-500 bg-blue-50" : "border-gray hover:border-darker-gray"}`}
        >
          <div className="flex items-center gap-4">
            <FaCreditCard size={24} className="text-green-500" />
            <div>
              <div className="font-medium text-gray">Credit/Debit Card</div>
              <div className="text-sm text-gray">Visa, Mastercard, and other cards</div>
            </div>
          </div>
        </div>
      </div>

      {selectedPayment === "qris" && (
        <div className="bg-light border-2 border-dashed border-gray p-8 rounded-lg text-center mb-6">
          <FaQrcode size={80} className="mx-auto text-darker-gray mb-4" />
          <p className="text-gray mb-2">QR Code will appear here</p>
          <p className="text-sm text-gray">Scan with your banking app to pay</p>
        </div>
      )}

      {selectedPayment === "credit" && (
        <div className="grid grid-cols-2 py-4 border divide-x rounded-lg border-gray text-gray divide-gray/30 mb-6">
          <div className="px-4 divide-y divide-gray/30">
            <div className="pb-4 space-y-1">
              <h3 className="text-lg font-medium">BCA Bank</h3>
              <p className="text-sm font-light">NI KADEK LINDA WIRYANI</p>
              <p className="text-sm font-light">7725164521</p>
            </div>
            <div className="pt-4 space-y-1">
              <h3 className="text-lg font-medium">MANDIRI Bank</h3>
              <p className="text-sm font-light">
                SWIFT CODE: <span className="font-medium">CENAIDJA</span>
              </p>
            </div>
          </div>
          <div className="px-4 divide-y divide-gray/30">
            <div className="pb-4 space-y-1">
              <h3 className="text-lg font-medium">MANDIRI Bank</h3>
              <p className="text-sm font-light">NI KADEK LINDA WIRYANI</p>
              <p className="text-sm font-light">145-00-1231250-6</p>
            </div>
            <div className="pt-4 space-y-1">
              <h3 className="text-lg font-medium">MANDIRI Bank</h3>
              <p className="text-sm font-light">
                SWIFT CODE: <span className="font-medium">BMRIIDJA</span>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-1 mb-6">
        <label htmlFor="image" className="block text-sm font-medium text-gray">
          Please input payment receipt *
        </label>
        <div className="relative flex flex-row items-center overflow-hidden border rounded-lg border-gray/50">
          <input type="file" id="images" onChange={handleImagesChange} hidden accept="image/*" />
          <label htmlFor="images" className="file-label">
            Choose file
          </label>
          <label className="text-sm text-slate-500 whitespace-nowrap">{formData.image?.originalName || "Please input the image"}</label>
          {!formData.image ? (
            <small className="pr-2 ms-auto text-gray/70">Max 5mb. (aspect ratio of 1:1)</small>
          ) : (
            <button onClick={() => handleDeleteImages(formData.image?.path || "")} type="button" className="p-1 rounded-full z-1 bg-secondary absolute right-4">
              <svg className="size-4 text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        {formData.isUploading && <ProgressBar uploadProgress={formData.uploadProgress} />}
      </div>

      <div className="flex items-center w-full gap-4">
        <Button onClick={() => setCurrentStep("summary")} className="btn-outline w-full">
          Back
        </Button>
        <Button onClick={handlePaymentSubmit} disabled={addCarts.isPending} className={`btn-gray w-full ${addCarts.isPending && "animate-pulse"}`}>
          Complete Order
        </Button>
      </div>
    </>
  );

  const renderCompleteStep = () => (
    <div className="text-center">
      <div className="mb-6">
        <FaCheckCircle size={64} className="text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Complete!</h2>
        <p className="text-gray-600">
          Thank you for your purchase! You&apos;ve successfully bought {totalItem} item{totalItem > 1 ? "s" : ""}.
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="text-left space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Order Total:</span>
            <span className="font-semibold">{formatIDR(price)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Payment Method:</span>
            <span className="font-semibold">{selectedPayment === "qris" ? "QRIS" : "Credit Card"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Customer:</span>
            <span className="font-semibold">{formData.fullname}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {/* <p className="text-sm text-gray-600">
          A confirmation email has been sent to <strong>{formData.email}</strong>
        </p> */}
        <p className="text-sm text-gray-600">We appreciate your support!</p>
      </div>

      <div className="mt-6">
        <Button onClick={handleClose} className="btn-gray w-full">
          Close
        </Button>
      </div>
    </div>
  );

  return (
    <Modal isVisible={isVisible} onClose={handleClose}>
      {currentStep === "summary" && renderSummaryStep()}
      {currentStep === "payment" && renderPaymentStep()}
      {currentStep === "complete" && renderCompleteStep()}
    </Modal>
  );
};

export const CartProduct = () => {
  const router = useRouter();
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

  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
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

  const handleClickBuyNow = () => {
    if (getSelectedCount() === 0) {
      alert("Please select at least one item to proceed.");
      return;
    }
    setIsModalOpen(true);
  };

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

  if (cart.length === 0) {
    return (
      <Container className="py-10">
        <div className="bg-light rounded-lg p-8 mb-4 text-center">
          <div className="flex flex-col items-center space-y-4">
            <FaShoppingCart className="text-6xl text-gray/50" />
            <div className="space-y-2">
              <h3 className="text-xl font-medium text-darker-gray">Your cart is empty</h3>
              <p className="text-gray/70">Add some products to get started</p>
            </div>
            <Button type="button" onClick={() => router.push("/my-lindway")} className="bg-primary hover:bg-primary/90 text-light rounded-lg mt-4">
              Continue Shopping
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-10">
      <OrderSummary isVisible={isModalOpen} onClose={() => setIsModalOpen(false)} price={getSelectedTotal()} totalItem={getSelectedCount()} />
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
                <span className={`px-3 py-1 text-light rounded-lg bg-gray`}>{_formatTitleCase(category)}</span>
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
                    <div className="flex items-center gap-4">
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
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1">
            <span className="text-sm">Total ({getSelectedCount()} item): </span>
            <span className="text-xl font-bold">{formatIDR(getSelectedTotal())}</span>
          </div>
          <Button type="button" onClick={handleClickBuyNow} className="btn-gray rounded-lg">
            Buy Now
          </Button>
        </div>
      </div>
    </Container>
  );
};

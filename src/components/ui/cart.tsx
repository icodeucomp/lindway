"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import { useCartStore } from "@/hooks";

import { Img, Container, Button, Modal, ProgressBar, NumberInput } from "@/components";

import toast from "react-hot-toast";

import { FaArrowLeft, FaCheckCircle, FaCreditCard, FaMinus, FaPlus, FaQrcode, FaShoppingCart, FaTrash } from "react-icons/fa";

import { _formatTitleCase, calculateTotalPrice, guestsApi, filesApi, formatIDR, parametersApi } from "@/utils";

import { ApiResponse, CreateGuest, DiscountType, Parameter, PaymentMethods } from "@/types";

import { categoryColors, categoryLabels } from "@/static/categories";

type CheckoutStep = "summary" | "payment" | "complete";

interface FormData extends Omit<CreateGuest, "totalPurchased" | "totalItemsSold"> {
  isUploading: boolean;
  uploadProgress: number;
}

const initFormData: FormData = {
  email: "",
  fullname: "",
  receiptImage: undefined,
  isUploading: false,
  uploadProgress: 0,
  paymentMethod: PaymentMethods.BANK_TRANSFER,
  address: "",
  isMember: false,
  isPurchased: false,
  items: [],
  postalCode: 0,
  whatsappNumber: "",
  instagram: "",
  reference: "",
};

const OrderSummary = ({ isVisible, onClose, price, totalItem }: { isVisible: boolean; onClose: () => void; price: number; totalItem: number }) => {
  const { addSelectedItems, removeSelectedItems, getSelectedCount, getSelectedTotal } = useCartStore();

  const [currentStep, setCurrentStep] = React.useState<CheckoutStep>("summary");

  const [formData, setFormData] = React.useState<FormData>(initFormData);

  const { data: parameter } = parametersApi.useGetParameters<ApiResponse<Parameter>>({
    key: ["parameters"],
  });

  const addGuests = guestsApi.useCreateGuests({
    onSuccess: () => {
      setCurrentStep("complete");
    },
  });

  const handleImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    setFormData((prevFormData) => ({ ...prevFormData, isUploading: true }));
    setFormData((prevFormData) => ({ ...prevFormData, uploadProgress: 0 }));

    const respImages = await filesApi.uploadImages(files, "/receipt", (progress: number) => {
      setFormData((prevFormData) => ({ ...prevFormData, uploadProgress: progress }));
    });

    setFormData((prevFormData) => ({ ...prevFormData, isUploading: false }));
    setFormData((prevFormData) => ({ ...prevFormData, uploadProgress: 0 }));

    setFormData((prevImages) => ({ ...prevImages, receiptImage: respImages[0] }));
  };

  const handleDeleteImages = async (subPath: string) => {
    await filesApi.delete(subPath, (progress: number) => {
      setFormData((prevFormData) => ({ ...prevFormData, deletingProgress: progress }));
    });

    setFormData((prevImages) => ({ ...prevImages, receiptImage: undefined }));
  };

  const handleFormSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.fullname || !formData.address || !formData.postalCode || !formData.whatsappNumber) {
      toast.error("Please filled with a label '*'");
      return;
    }
    setCurrentStep("payment");
  };

  const handlePaymentSubmit = async () => {
    if (!formData.paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    if ((formData.paymentMethod === PaymentMethods.QRIS || formData.paymentMethod === PaymentMethods.BANK_TRANSFER) && !formData.receiptImage) {
      toast.error("Please input receipt first");
      return;
    }

    addGuests.mutate({ ...formData, isMember: false, isPurchased: false, items: addSelectedItems(), totalItemsSold: getSelectedCount(), totalPurchased: getSelectedTotal() });
  };

  const handleClose = () => {
    setCurrentStep("summary");
    setFormData(initFormData);
    removeSelectedItems();
    onClose();
  };

  const renderSummaryStep = () => (
    <>
      <h2 className="mb-6 text-2xl font-bold text-gray">Checkout</h2>

      <div className="p-4 mb-6 rounded-lg bg-gray/5 text-gray">
        <h4 className="mb-3 font-semibold">Order Summary</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>
              Subtotal ({totalItem} item{totalItem > 1 ? "s" : ""})
            </span>
            <span>{formatIDR(price)}</span>
          </div>
          {parameter && parameter.data && (
            <>
              <div className="flex justify-between items-center text-gray">
                <span>Shipping</span>
                <span className={`${parameter.data.shipping === 0 ? "text-green-600" : "text-red-500"}`}>{parameter.data.shipping === 0 ? "Free" : `+${formatIDR(parameter.data.shipping)}`}</span>
              </div>

              <div className="flex justify-between items-center text-gray">
                <span>Tax</span>
                <span className={`${parameter.data.tax === 0 ? "text-green-600" : "text-red-500"}`}>
                  {parameter.data.tax === 0 ? "Free" : parameter.data.taxType === DiscountType.FIXED ? `+${formatIDR(parameter.data.tax)}` : `+${parameter.data.tax}%`}
                </span>
              </div>

              {parameter.data.promo !== 0 && (
                <div className="flex justify-between items-center text-gray">
                  <span>Promo</span>
                  <span className={`${parameter.data.promo === 0 ? "text-gray-500" : "text-green-600"}`}>
                    {parameter.data.promoType === DiscountType.FIXED ? `-${formatIDR(parameter.data.promo)}` : `-${parameter.data.promo}%`}
                  </span>
                </div>
              )}

              {parameter.data.member !== 0 && (
                <div className="flex justify-between items-center text-gray">
                  <span>Member</span>
                  <span className={`${parameter.data.member === 0 ? "text-gray-500" : "text-green-600"}`}>
                    {parameter.data.memberType === DiscountType.FIXED ? `-${formatIDR(parameter.data.member)}` : `-${parameter.data.member}%`}
                  </span>
                </div>
              )}
            </>
          )}
          <div className="pt-2 mt-2 border-t">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              {parameter && parameter.data && (
                <span>
                  {formatIDR(
                    parameter &&
                      parameter.data &&
                      calculateTotalPrice({
                        basePrice: getSelectedTotal(),
                        member: Number(parameter.data.member),
                        memberType: parameter.data.memberType,
                        promo: Number(parameter.data.promo),
                        promoType: parameter.data.promoType,
                        tax: Number(parameter.data.tax),
                        taxType: parameter.data.taxType,
                        shipping: parameter.data.shipping,
                      })
                  )}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 text-gray">
        <div className="space-y-1">
          <label className="block mb-1 text-sm font-medium">Email Address *</label>
          <input
            type="text"
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            className="block w-full px-3 py-2 border rounded-lg shadow-sm border-gray/30 focus:outline-none focus:ring-blue-500 focus:ring-2 focus:border-blue-500"
            placeholder="your@email.com"
          />
        </div>

        <div className="space-y-1">
          <label className="block mb-1 text-sm font-medium">Full Name *</label>
          <input
            type="text"
            value={formData.fullname}
            onChange={(e) => setFormData((prev) => ({ ...prev, fullname: e.target.value }))}
            className="block w-full px-3 py-2 border rounded-lg shadow-sm border-gray/30 focus:outline-none focus:ring-blue-500 focus:ring-2 focus:border-blue-500"
            placeholder="your name"
          />
        </div>

        <div className="space-y-1">
          <label className="block mb-1 text-sm font-medium">Whatsapp Number *</label>
          <input
            type="text"
            value={formData.whatsappNumber}
            onChange={(e) => setFormData((prev) => ({ ...prev, whatsappNumber: e.target.value }))}
            className="block w-full px-3 py-2 border rounded-lg shadow-sm border-gray/30 focus:outline-none focus:ring-blue-500 focus:ring-2 focus:border-blue-500"
            placeholder="0"
          />
        </div>

        <div className="space-y-1">
          <label className="block mb-1 text-sm font-medium">Address *</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
            className="block w-full px-3 py-2 border rounded-lg shadow-sm border-gray/30 focus:outline-none focus:ring-blue-500 focus:ring-2 focus:border-blue-500"
            placeholder="Jalan Hayam Wuruk Gang XVII No. 36"
          />
        </div>

        <div className="space-y-1">
          <label className="block mb-1 text-sm font-medium">Postal Code *</label>
          <NumberInput
            value={formData.postalCode === 0 ? "" : formData.postalCode}
            onChange={(e) => setFormData((prev) => ({ ...prev, postalCode: +e.target.value }))}
            className="block w-full px-3 py-2 border rounded-lg shadow-sm border-gray/30 focus:outline-none focus:ring-blue-500 focus:ring-2 focus:border-blue-500"
            placeholder="your postal code"
          />
        </div>

        <div className="space-y-1">
          <label className="block mb-1 text-sm font-medium">Instagram</label>
          <input
            type="text"
            value={formData.instagram}
            onChange={(e) => setFormData((prev) => ({ ...prev, instagram: e.target.value }))}
            className="block w-full px-3 py-2 border rounded-lg shadow-sm border-gray/30 focus:outline-none focus:ring-blue-500 focus:ring-2 focus:border-blue-500"
            placeholder="your Instagram (optional)"
          />
        </div>

        <div className="space-y-1">
          <label className="block mb-1 text-sm font-medium">How did you hear about us?</label>
          <input
            type="text"
            value={formData.reference}
            onChange={(e) => setFormData((prev) => ({ ...prev, reference: e.target.value }))}
            className="block w-full px-3 py-2 border rounded-lg shadow-sm border-gray/30 focus:outline-none focus:ring-blue-500 focus:ring-2 focus:border-blue-500"
            placeholder="example: instagram"
          />
        </div>

        <div className="flex items-center w-full gap-3 pt-4">
          <Button onClick={onClose} className="w-full btn-outline">
            Cancel
          </Button>
          <Button onClick={handleFormSubmit} className="flex items-center justify-center w-full gap-2 btn-gray">
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
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => setCurrentStep("summary")} className="p-1 rounded hover:bg-gray/5">
          <FaArrowLeft size={16} />
        </button>
        <h2 className="text-2xl font-bold text-gray">Payment Method</h2>
      </div>

      <div className="p-4 mb-6 rounded-lg bg-gray/5">
        <div className="flex items-center justify-between">
          <span className="text-gray">Total Amount</span>
          <span className="text-xl font-bold text-gray">{formatIDR(price)}</span>
        </div>
      </div>

      <div className="mb-6 space-y-4">
        <div
          onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: PaymentMethods.QRIS }))}
          className={`border rounded-lg p-4 cursor-pointer transition-colors ${formData.paymentMethod === PaymentMethods.QRIS ? "border-blue-500 bg-blue-50" : "border-gray hover:border-darker-gray"}`}
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
          onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: PaymentMethods.BANK_TRANSFER }))}
          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
            formData.paymentMethod === PaymentMethods.BANK_TRANSFER ? "border-blue-500 bg-blue-50" : "border-gray hover:border-darker-gray"
          }`}
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

      {formData.paymentMethod === "QRIS" && (
        <div className="px-8 py-4 mb-6 text-center border-2 border-dashed rounded-lg bg-light border-gray">
          <p className="mb-2 text-gray">QR Code will appear here</p>
          <p className="text-sm text-gray mb-4">Scan with your banking app to pay</p>
          {parameter && parameter.data && parameter.data.qrisImage && <Img src={parameter.data.qrisImage.url} alt="qris image" className="aspect-square w-full rounded-lg" cover />}
        </div>
      )}

      {formData.paymentMethod === "BANK_TRANSFER" && (
        <div className="grid grid-cols-2 py-4 mb-6 border divide-x rounded-lg border-gray text-gray divide-gray/30">
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

      {formData.paymentMethod === "BANK_TRANSFER" || formData.paymentMethod === "QRIS" ? (
        <div className="mb-6 space-y-1">
          <label htmlFor="image" className="block text-sm font-medium text-gray">
            Please input payment receipt *
          </label>
          <div className="relative flex flex-row items-center overflow-hidden border rounded-lg border-gray/50">
            <input type="file" id="images" onChange={handleImagesChange} hidden accept="image/*" />
            <label htmlFor="images" className="file-label">
              Choose file
            </label>
            <label className="text-sm text-slate-500 whitespace-nowrap">{formData.receiptImage?.originalName || "Please input the image"}</label>
            {!formData.receiptImage ? (
              <small className="pr-2 ms-auto text-gray/70">Max 5mb. (aspect ratio of 1:1)</small>
            ) : (
              <button onClick={() => handleDeleteImages(formData.receiptImage?.path || "")} type="button" className="absolute p-1 rounded-full z-1 bg-secondary right-4">
                <svg className="size-4 text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {formData.isUploading && <ProgressBar uploadProgress={formData.uploadProgress} />}
        </div>
      ) : null}

      <div className="flex items-center w-full gap-4">
        <Button onClick={() => setCurrentStep("summary")} className="w-full btn-outline">
          Back
        </Button>
        <Button onClick={handlePaymentSubmit} disabled={addGuests.isPending} className={`btn-gray w-full ${addGuests.isPending && "animate-pulse"}`}>
          Complete Order
        </Button>
      </div>
    </>
  );

  const renderCompleteStep = () => (
    <div className="text-center">
      <div className="mb-6">
        <FaCheckCircle size={64} className="mx-auto mb-4 text-green-500" />
        <h2 className="mb-2 text-2xl font-bold text-gray">Order Complete!</h2>
        <p className="text-gray">
          Thank you for your purchase! You&apos;ve successfully bought {totalItem} item{totalItem > 1 ? "s" : ""}.
        </p>
      </div>

      <div className="p-4 mb-6 border border-green-200 rounded-lg bg-green-50">
        <div className="space-y-2 text-left">
          <div className="flex justify-between">
            <span className="text-gray">Order Total:</span>
            {parameter && parameter.data && (
              <span className="font-semibold">
                {formatIDR(
                  parameter &&
                    parameter.data &&
                    calculateTotalPrice({
                      basePrice: getSelectedTotal(),
                      member: Number(parameter.data.member),
                      memberType: parameter.data.memberType,
                      promo: Number(parameter.data.promo),
                      promoType: parameter.data.promoType,
                      tax: Number(parameter.data.tax),
                      taxType: parameter.data.taxType,
                      shipping: parameter.data.shipping,
                    })
                )}
              </span>
            )}
          </div>
          <div className="flex justify-between">
            <span className="text-gray">Payment Method:</span>
            <span className="font-semibold">{_formatTitleCase(formData.paymentMethod as string)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray">Customer:</span>
            <span className="font-semibold">{formData.fullname}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {/* <p className="text-sm text-gray">
          A confirmation email has been sent to <strong>{formData.email}</strong>
        </p> */}
        <p className="text-sm text-gray">We appreciate your support!</p>
      </div>

      <div className="mt-6">
        <Button onClick={handleClose} className="w-full btn-gray">
          Close
        </Button>
      </div>
    </div>
  );

  return (
    <Modal
      isVisible={isVisible}
      onClose={() => {
        if (currentStep === "complete") {
          handleClose();
          return;
        }
        onClose();
      }}
    >
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
      toast.error("Please select at least one item to proceed.");
      return;
    }
    setIsModalOpen(true);
  };

  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="loader"></div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <Container className="py-10">
        <div className="p-8 mb-4 text-center rounded-lg bg-light">
          <div className="flex flex-col items-center space-y-4">
            <FaShoppingCart className="text-6xl text-gray/50" />
            <div className="space-y-2">
              <h3 className="text-xl font-medium text-darker-gray">Your cart is empty</h3>
              <p className="text-gray/70">Add some products to get started</p>
            </div>
            <Button type="button" onClick={() => router.push("/my-lindway")} className="mt-4 rounded-lg bg-primary hover:bg-primary/90 text-light">
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
      <div className="p-4 mb-4 rounded-lg bg-light">
        <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray">
          <div className="col-span-1">
            <input
              type="checkbox"
              className="rounded size-4 accent-primary"
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
          <div key={category} className="mb-6 overflow-hidden text-sm rounded-lg bg-light text-gray">
            <div className="grid grid-cols-12 p-4 border-b border-gray/30">
              <div className="col-span-1">
                <input
                  type="checkbox"
                  className="rounded size-4 accent-primary"
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
                <span className={`px-3 py-1 rounded-lg ${categoryColors[category as keyof typeof categoryColors]}`}>{categoryLabels[category as keyof typeof categoryLabels]}</span>
                <span className="text-sm text-gray">({products.length} items)</span>
              </div>
            </div>

            {/* Products in this category */}
            {products.map((product) => {
              const itemKey = getItemKey(product.id, product.selectedSize);
              const isSelected = selectedItems.has(itemKey);
              return (
                <div key={`${product.id}-${product.selectedSize}`} className="grid items-center grid-cols-12 gap-4 p-4">
                  <div className="col-span-1">
                    <input type="checkbox" className="rounded size-4 accent-primary" checked={isSelected} onChange={() => toggleItemSelection(product.id, product.selectedSize)} />
                  </div>

                  <div className="col-span-4">
                    <div className="flex items-center gap-4">
                      <Img src={product.images[0].url} alt={product.name} className="w-20 rounded-lg aspect-square" cover />
                      <div className="flex-1">
                        <h3 className="mb-2 font-medium text-gray line-clamp-2">{product.name}</h3>
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
                        className="flex items-center justify-center border rounded size-8 border-gray/30"
                        disabled={product.quantity <= 1}
                      >
                        <FaMinus />
                      </button>
                      <span className="w-12 font-medium text-center">{product.quantity}</span>
                      <button onClick={() => updateQuantity(product.id, product.selectedSize, product.quantity + 1)} className="flex items-center justify-center border rounded size-8 border-gray/30">
                        <FaPlus />
                      </button>
                    </div>
                  </div>

                  <div className="col-span-2 text-center">
                    <span className="font-semibold text-gray">{formatIDR(product.price * product.quantity)}</span>
                  </div>

                  <div className="col-span-1 text-center">
                    <button onClick={() => removeFromCart(product.id, product.selectedSize)} className="flex items-center gap-1 text-sm text-gray hover:text-blue-700">
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </>

      <div className="flex items-center justify-between p-6 rounded-lg bg-light text-gray">
        <div className="flex items-center gap-4">
          <input
            type="checkbox"
            className="rounded size-4 accent-primary"
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
            className="flex items-center gap-1 text-sm"
          >
            <FaTrash /> Delete
          </button>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1">
            <span className="text-sm">Total ({getSelectedCount()} item): </span>
            <span className="text-xl font-bold">{formatIDR(getSelectedTotal())}</span>
          </div>
          <Button type="button" onClick={handleClickBuyNow} className="rounded-lg btn-gray">
            Buy Now
          </Button>
        </div>
      </div>
    </Container>
  );
};

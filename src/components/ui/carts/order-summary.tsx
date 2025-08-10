"use client";

import * as React from "react";
import toast from "react-hot-toast";

import { useCartStore } from "@/hooks";
import { Modal } from "@/components";
import { guestsApi, parametersApi } from "@/utils";
import { ApiResponse, CreateGuest, Parameter, PaymentMethods } from "@/types";

import { CheckoutForm, CompleteStep, PaymentStep } from "@/components/ui/carts";

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

interface OrderSummaryProps {
  isVisible: boolean;
  onClose: () => void;
  price: number;
  totalItem: number;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ isVisible, onClose, price, totalItem }) => {
  const { addSelectedItems, removeSelectedItems, getSelectedCount, getSelectedTotal } = useCartStore();
  const [currentStep, setCurrentStep] = React.useState<CheckoutStep>("summary");
  const [formData, setFormData] = React.useState<FormData>(initFormData);
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});

  const { data: parameter } = parametersApi.useGetParameters<ApiResponse<Parameter>>({
    key: ["parameters"],
  });

  const addGuests = guestsApi.useCreateGuests({
    onSuccess: () => {
      setCurrentStep("complete");
    },
  });

  const handleClose = () => {
    setCurrentStep("summary");
    setFormData(initFormData);
    setFormErrors({});
    removeSelectedItems();
    onClose();
  };

  const handleFormSubmit = (data: FormData, errors: Record<string, string>) => {
    if (Object.keys(errors).length > 0) {
      toast.error("Please correct the errors in the form");
      return;
    }

    setFormData(data);
    setFormErrors(errors);
    setCurrentStep("payment");
  };

  const handlePaymentSubmit = async (paymentData: FormData) => {
    try {
      const submitData = {
        ...paymentData,
        isMember: false,
        isPurchased: false,
        items: addSelectedItems(),
        totalItemsSold: getSelectedCount(),
        totalPurchased: getSelectedTotal(),
      };

      addGuests.mutate(submitData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to submit order. Please try again.";
      toast.error(errorMessage);
    }
  };

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
      <>
        {parameter && parameter.data && (
          <>
            {currentStep === "summary" && (
              <CheckoutForm
                formData={formData}
                formErrors={formErrors}
                price={price}
                totalItem={totalItem}
                parameter={parameter.data}
                onSubmit={handleFormSubmit}
                onCancel={onClose}
                getSelectedTotal={getSelectedTotal}
              />
            )}

            {currentStep === "payment" && (
              <PaymentStep
                formData={formData}
                setFormData={setFormData}
                price={price}
                parameter={parameter.data}
                onBack={() => setCurrentStep("summary")}
                onSubmit={handlePaymentSubmit}
                isLoading={addGuests.isPending}
              />
            )}

            {currentStep === "complete" && <CompleteStep formData={formData} totalItem={totalItem} parameter={parameter.data} onClose={handleClose} getSelectedTotal={getSelectedTotal} />}
          </>
        )}
      </>
    </Modal>
  );
};

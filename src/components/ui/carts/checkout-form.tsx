import * as React from "react";

import { Button, NumberInput } from "@/components";

import { FaCreditCard } from "react-icons/fa";

import { formatIDR, calculateTotalPrice } from "@/utils";

import { CreateGuest, DiscountType, ConfigParameterData } from "@/types";

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

const validateWhatsApp = (number: string): boolean => {
  const cleanNumber = number.replace(/\D/g, "");
  return cleanNumber.length >= 10 && cleanNumber.length <= 15;
};

const validatePostalCode = (code: number): boolean => {
  return code > 0 && code.toString().length >= 5;
};

const sanitizeInput = (value: string): string => {
  return value.trim().replace(/\s+/g, " ");
};

interface FormData extends Omit<CreateGuest, "totalPurchased" | "totalItemsSold"> {
  isUploading: boolean;
  uploadProgress: number;
}

interface CheckoutFormProps {
  formData: FormData;
  formErrors: Record<string, string>;
  price: number;
  totalItem: number;
  parameter: ConfigParameterData;
  onSubmit: (data: FormData, errors: Record<string, string>) => void;
  onCancel: () => void;
  getSelectedTotal: () => number;
}

export const CheckoutForm = ({ formData, formErrors, price, totalItem, parameter, onSubmit, onCancel, getSelectedTotal }: CheckoutFormProps) => {
  const [currentFormData, setCurrentFormData] = React.useState(formData);
  const [currentFormErrors, setCurrentFormErrors] = React.useState(formErrors);

  const validateField = (name: string, value: string | number): string => {
    switch (name) {
      case "email":
        const emailValue = typeof value === "string" ? value : "";
        if (!emailValue.trim()) return "Email is required";
        if (!validateEmail(emailValue)) return "Please enter a valid email address";
        return "";

      case "fullname":
        const nameValue = typeof value === "string" ? value : "";
        if (!nameValue.trim()) return "Full name is required";
        if (nameValue.trim().length < 2) return "Full name must be at least 2 characters";
        return "";

      case "whatsappNumber":
        const whatsappValue = typeof value === "string" ? value : "";
        if (!whatsappValue.trim()) return "WhatsApp number is required";
        if (!validateWhatsApp(whatsappValue)) return "Please enter a valid WhatsApp number (10-15 digits)";
        return "";

      case "address":
        const addressValue = typeof value === "string" ? value : "";
        if (!addressValue.trim()) return "Address is required";
        if (addressValue.trim().length < 10) return "Address must be at least 10 characters";
        return "";

      case "postalCode":
        const postalValue = typeof value === "number" ? value : parseInt(value as string) || 0;
        if (!postalValue) return "Postal code is required";
        if (!validatePostalCode(postalValue)) return "Please enter a valid postal code (at least 5 digits)";
        return "";

      default:
        return "";
    }
  };

  const validateAllFields = (): boolean => {
    const errors: Record<string, string> = {};
    const requiredFields = ["email", "fullname", "whatsappNumber", "address", "postalCode"];

    requiredFields.forEach((field) => {
      const error = validateField(field, currentFormData[field as keyof typeof currentFormData] as string | number);
      if (error) {
        errors[field] = error;
      }
    });

    setCurrentFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { name, value, type } = e.target;

    let processedValue: string | number = value;

    if (name === "email") {
      processedValue = value.trim();
    }
    if (type === "number") {
      processedValue = Number(value);
    }
    if (name === "whatsappNumber") {
      processedValue = value.replace(/[^\d+\-\s()]/g, "");
    }

    processedValue = sanitizeInput(value);

    setCurrentFormData((prev) => ({ ...prev, [name]: processedValue }));

    if (currentFormErrors[name]) {
      setCurrentFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFormSubmit = (e: React.MouseEvent) => {
    e.preventDefault();

    if (!validateAllFields()) {
      return;
    }

    onSubmit(currentFormData, currentFormErrors);
  };

  const renderFormField = (id: string, label: string, type: string = "text", placeholder: string = "", required: boolean = true) => (
    <div className="space-y-1">
      <label htmlFor={id} className="block mb-1 text-sm font-medium">
        {label} {required && "*"}
      </label>
      {type === "number" ? (
        <NumberInput
          id={id}
          name={id}
          value={Number(currentFormData[id as keyof typeof currentFormData]) === 0 ? "" : Number(currentFormData[id as keyof typeof currentFormData])}
          onChange={handleChange}
          className={`input-form w-full ${currentFormErrors[id] ? "border-red-500" : "border-gray/30"}`}
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          id={id}
          name={id}
          value={currentFormData[id as keyof typeof currentFormData] as string}
          onChange={handleChange}
          className={`input-form w-full ${currentFormErrors[id] ? "border-red-500" : "border-gray/30"}`}
          placeholder={placeholder}
        />
      )}
      {currentFormErrors[id] && <p className="text-sm text-red-500">{currentFormErrors[id]}</p>}
    </div>
  );

  return (
    <form className="space-y-4 sm:space-y-6">
      <h2 className="text-xl font-bold sm:text-2xl text-gray">Checkout</h2>

      <div className="space-y-3 sm:space-y-4 text-gray">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <div>{renderFormField("email", "Email Address", "email", "your@email.com")}</div>
          <div>{renderFormField("fullname", "Full Name", "text", "John Doe")}</div>
          <div className="sm:col-span-2">{renderFormField("whatsappNumber", "WhatsApp Number", "tel", "+62812345678")}</div>
          <div className="sm:col-span-2">{renderFormField("address", "Address", "text", "Jalan Hayam Wuruk Gang XVII No. 36")}</div>
          <div className="sm:col-span-2">{renderFormField("postalCode", "Postal Code", "number", "12345")}</div>
          <div>{renderFormField("instagram", "Instagram", "text", "@yourusername", false)}</div>
          <div>{renderFormField("reference", "How did you hear about us?", "text", "Instagram, friend, etc.", false)}</div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="p-3 mb-2 rounded-lg sm:p-4 bg-gray/5 text-gray">
        <h4 className="mb-3 text-sm font-semibold sm:text-base">Order Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>
              Subtotal ({totalItem} item{totalItem > 1 ? "s" : ""})
            </span>
            <span>{formatIDR(price)}</span>
          </div>

          <div className="flex items-center justify-between text-gray">
            <span>Shipping</span>
            <span className={Number(parameter.shipping) === 0 ? "text-green-600" : "text-red-500"}>{Number(parameter.shipping) === 0 ? "Free" : `+${formatIDR(parameter.shipping)}`}</span>
          </div>

          <div className="flex items-center justify-between text-gray">
            <span>Tax</span>
            <span className={Number(parameter.tax_rate) === 0 ? "text-green-600" : "text-red-500"}>
              {Number(parameter.tax_rate) === 0 ? "Free" : parameter.tax_type === DiscountType.FIXED ? `+${formatIDR(Number(parameter.tax_rate))}` : `+${Number(parameter.tax_rate)}%`}
            </span>
          </div>

          {Number(parameter.promotion_discount) !== 0 && (
            <div className="flex items-center justify-between text-gray">
              <span>Promo</span>
              <span className="text-green-600">
                {parameter.promo_type === DiscountType.FIXED ? `-${formatIDR(Number(parameter.promotion_discount))}` : `-${Number(parameter.promotion_discount)}%`}
              </span>
            </div>
          )}

          {Number(parameter.member_discount) !== 0 && (
            <div className="flex items-center justify-between text-gray">
              <span>Member Discount</span>
              <span className="text-green-600">{parameter.member_type === DiscountType.FIXED ? `-${formatIDR(Number(parameter.member_discount))}` : `-${Number(parameter.member_discount)}%`}</span>
            </div>
          )}

          <div className="pt-2 mt-2 border-t">
            <div className="flex justify-between text-base font-bold sm:text-lg">
              <span>Total</span>
              <span>
                {parameter &&
                  formatIDR(
                    calculateTotalPrice({
                      basePrice: getSelectedTotal(),
                      member: Number(parameter.member_discount),
                      memberType: parameter.member_type,
                      promo: Number(parameter.promotion_discount),
                      promoType: parameter.promo_type,
                      tax: Number(parameter.tax_rate),
                      taxType: parameter.tax_type,
                      shipping: Number(parameter.shipping),
                    })
                  )}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse items-center w-full gap-2 sm:flex-row sm:gap-4">
        <Button type="button" onClick={onCancel} className="w-full btn-outline">
          Cancel
        </Button>
        <Button type="button" onClick={handleFormSubmit} className="flex items-center justify-center w-full gap-2 btn-gray">
          <FaCreditCard size={18} />
          Next
        </Button>
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-darker-gray">🔒 Secure checkout process</p>
      </div>
    </form>
  );
};

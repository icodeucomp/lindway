import * as React from "react";

import { useRouter } from "next/navigation";

import { Button, CircularProgress, Img, NumberInput, ProgressBar } from "@/components";

import { FaMinus, FaPlus } from "react-icons/fa";

import { Categories, CreateProduct, EditProduct, Helper } from "@/types";

interface InputFormProps {
  formData: CreateProduct | EditProduct;
  helper: Helper;
  isPending: boolean;
  setHelper: React.Dispatch<React.SetStateAction<Helper>>;
  handleSubmit: (E: React.FormEvent) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  addSize: () => void;
  removeSize: (index: number) => void;
  handleImagesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDeleteImages: (subPath: string) => void;
  incrementQuantity: (index: number) => void;
  decrementQuantity: (index: number) => void;
}

export const InputForm = ({
  formData,
  helper,
  isPending,
  setHelper,
  addSize,
  handleChange,
  handleDeleteImages,
  handleImagesChange,
  handleSubmit,
  removeSize,
  decrementQuantity,
  incrementQuantity,
}: InputFormProps) => {
  const router = useRouter();

  return (
    <div className="rounded-lg shadow bg-light">
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-1">
            <label htmlFor="name" className="block text-sm font-medium text-gray">
              Product Name *
            </label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="input-form" placeholder="Enter product name" />
          </div>

          <div className="space-y-1">
            <label htmlFor="sku" className="block text-sm font-medium text-gray">
              SKU *
            </label>
            <input type="text" id="sku" name="sku" value={formData.sku} onChange={handleChange} className="input-form" placeholder="Enter SKU" />
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="description" className="block text-sm font-medium text-gray">
            Description *
          </label>
          <textarea id="description" name="description" rows={3} value={formData.description} onChange={handleChange} className="input-form" placeholder="Enter product description" />
        </div>

        <div className="space-y-1">
          <label htmlFor="notes" className="block text-sm font-medium text-gray">
            Notes *
          </label>
          <textarea id="notes" name="notes" rows={2} value={formData.notes} onChange={handleChange} className="input-form" placeholder="Additional notes" />
        </div>

        <div className="space-y-1">
          <label htmlFor="productionNotes" className="block text-sm font-medium text-gray">
            Production Days
          </label>
          <input
            type="text"
            id="productionNotes"
            name="productionNotes"
            value={formData.productionNotes}
            onChange={handleChange}
            className="input-form"
            placeholder="Enter notes for production days"
          />
        </div>

        <div className="space-y-2">
          <label className="block mb-2 text-sm font-medium text-gray">Sizes *</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={helper.sizeInput}
              onChange={(e) => setHelper((prevValue) => ({ ...prevValue, sizeInput: e.target.value }))}
              className="flex-1 input-form"
              placeholder="Enter size (e.g., S, M, L, XL)"
            />
            <Button type="button" onClick={addSize} className="btn-blue">
              Add
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {formData.sizes?.map((item, index) => (
              <div key={index} className="flex items-center gap-4 px-4 py-2 rounded-lg border border-gray/30 transition-shadow">
                <span className="flex items-center justify-center size-8 bg-blue-100 text-blue-800 font-bold rounded-lg text-xs">{item.size}</span>
                <span className="block text-sm font-medium text-gray">Quantity:</span>
                <div className="flex-1 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => decrementQuantity(index)}
                    className="size-6 flex items-center justify-center bg-gray hover:bg-darker-gray text-light rounded-lg transition-colors disabled:opacity-50"
                    disabled={item.quantity <= 0}
                  >
                    <FaMinus size={10} />
                  </button>
                  <span className="text-center font-medium text-xs">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => incrementQuantity(index)}
                    className="size-6 flex items-center justify-center bg-gray hover:bg-darker-gray text-light rounded-lg transition-colors disabled:opacity-50"
                  >
                    <FaPlus size={10} />
                  </button>
                </div>
                <button type="button" onClick={() => removeSize(index)} className="text-red-500 hover:text-red-600 rounded-lg transition-colors">
                  <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="space-y-1">
            <label htmlFor="price" className="block text-sm font-medium text-gray">
              Price * (IDR)
            </label>
            <NumberInput
              type="number"
              id="price"
              name="price"
              value={formData.price === 0 ? "" : formData.price}
              onChange={(e) => {
                const value = e.target.value;
                if (+value > 999999999999 || +value < 0) return;
                handleChange(e);
              }}
              className="input-form"
              placeholder="0"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="discount" className="block text-sm font-medium text-gray">
              Discount (%)
            </label>
            <NumberInput
              type="number"
              id="discount"
              name="discount"
              value={formData.discount === 0 ? "" : formData.discount}
              onChange={(e) => {
                const value = e.target.value;
                if (+value > 100 || +value < 0) return;
                handleChange(e);
              }}
              className="input-form"
              placeholder="0"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="stock" className="block text-sm font-medium text-gray">
              Stock *
            </label>
            <NumberInput
              type="number"
              id="stock"
              name="stock"
              value={formData.stock === 0 ? "" : formData.stock}
              onChange={(e) => {
                const value = e.target.value;
                if (+value > 99999 || +value < 0) return;
                handleChange(e);
              }}
              className="input-form"
              placeholder="0"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="category" className="block text-sm font-medium text-gray">
            Category *
          </label>
          <select id="category" name="category" value={formData.category} onChange={handleChange} className="input-form">
            {Object.values(Categories).map((category) => (
              <option key={category} value={category}>
                {category.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label htmlFor="image" className="block text-sm font-medium text-gray">
            Images *
          </label>
          <div className="relative flex flex-row items-center overflow-hidden border rounded-lg border-gray/50">
            <input type="file" id="images" onChange={handleImagesChange} hidden accept="image/*" multiple />
            <label htmlFor="images" className="file-label">
              Choose file
            </label>
            <label className="text-sm text-slate-500 whitespace-nowrap">{formData.images?.length} Images</label>
            <small className="pr-2 ms-auto text-gray/70">Max 5mb. (aspect ratio of 1:1)</small>
          </div>
          {helper.isUploading && <ProgressBar uploadProgress={helper.uploadProgress} />}
        </div>

        {formData && formData.images && formData.images?.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {formData.images.map((image, index) => (
              <div key={index} className="relative">
                <button onClick={() => handleDeleteImages(image.path)} type="button" className="absolute flex items-center justify-center w-5 h-5 rounded-full -top-2 -right-2 z-1 bg-secondary">
                  <FaMinus className="fill-light" />
                </button>

                <div className="relative overflow-hidden rounded-lg shadow-lg">
                  <Img src={image.url} alt={`Selected image ${index + 1}`} className="w-full rounded-lg aspect-square" cover />
                  {helper.isDeleting && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="flex flex-col items-center space-y-4">
                        <CircularProgress progress={helper.deletingProgress} />
                        <div className="text-white text-sm font-medium">Deleting...</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <input id="isPreOrder" name="isPreOrder" type="checkbox" checked={formData.isPreOrder} onChange={handleChange} className="rounded accent-gray size-4" />
          <label htmlFor="isPreOrder" className="block text-sm text-gray w-max">
            Enable Pre Order for this product
          </label>
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" onClick={() => router.push("/admin/dashboard/products")} className="btn-outline">
            Cancel
          </Button>
          <Button type="submit" disabled={isPending} className={`btn-blue ${isPending && "animate-pulse"}`}>
            {isPending ? "Saving..." : "Save Product"}
          </Button>
        </div>
      </form>
    </div>
  );
};

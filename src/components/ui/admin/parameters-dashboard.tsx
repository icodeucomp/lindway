"use client";

import * as React from "react";

import { useAuthStore } from "@/hooks";

import { useQueryClient } from "@tanstack/react-query";

import { Button, Img, NumberInput } from "@/components";

import { FaCircle, FaPlus } from "react-icons/fa";

import { filesApi, parametersApi } from "@/utils";

import { ApiResponse, DiscountType, EditParameter, Parameter } from "@/types";

export interface Helper {
  isUploadingVideos: boolean;
  isDeletingVideos: boolean;
  isUploadingImage: boolean;
  isDeletingImage: boolean;
}

const initHelper: Helper = {
  isUploadingVideos: false,
  isDeletingVideos: false,
  isUploadingImage: false,
  isDeletingImage: false,
};

export const DashboardParameters = () => {
  const queryClient = useQueryClient();

  const { isAuthenticated } = useAuthStore();

  const [formData, setFormData] = React.useState<EditParameter>();
  const [helper, setHelper] = React.useState<Helper>(initHelper);
  const [isEditing, setIsEditing] = React.useState<boolean>(false);

  const imageInputRef = React.useRef<HTMLInputElement | null>(null);
  const videoInputRefs = React.useRef<HTMLInputElement | null>(null);

  const {
    data: parameter,
    isLoading,
    error,
  } = parametersApi.useGetParameters<ApiResponse<Parameter>>({
    key: ["parameters"],
    enabled: isAuthenticated,
  });

  const updateProduct = parametersApi.useUpdateParameters({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parameters"] });
      setIsEditing(false);
    },
  });

  React.useEffect(() => {
    if (parameter && !formData) {
      setFormData({
        shipping: parameter.data.shipping,
        member: Number(parameter.data.member),
        memberType: parameter.data.memberType,
        promo: Number(parameter.data.promo),
        promoType: parameter.data.promoType,
        tax: Number(parameter.data.tax),
        taxType: parameter.data.taxType,
        qrisImage: parameter.data.qrisImage,
        video: parameter.data.video,
      });
    }
  }, [parameter, formData]);

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (formData) {
      updateProduct.mutate(formData);
    }
  };

  const handleInputChange = <K extends keyof EditParameter>(field: K, value: EditParameter[K]): void => {
    if (!formData) return;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageRemove = async (subPath: string) => {
    setHelper((prev) => ({ ...prev, isDeletingImage: true }));

    await filesApi.delete(subPath);

    setHelper((prev) => ({ ...prev, isDeletingImage: false }));
    setFormData((prev) => ({ ...prev, qrisImage: undefined }));

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;
    setHelper((prev) => ({ ...prev, isUploadingImage: true }));

    const respImage = await filesApi.uploadImages(files, "qris");

    setHelper((prev) => ({ ...prev, isUploadingImage: false }));
    setFormData((prev) => ({ ...prev, qrisImage: respImage[0] }));
  };

  const handleVideoRemove = async (subPath: string) => {
    setHelper((prev) => ({ ...prev, isDeletingVideos: true }));

    await filesApi.delete(subPath);

    setHelper((prev) => ({ ...prev, isDeletingVideos: false }));
    setFormData((prev) => ({ ...prev, video: prev && prev.video && prev.video.filter((image) => image.path !== subPath) }));

    if (videoInputRefs.current) {
      videoInputRefs.current.value = "";
    }
  };

  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;
    setHelper((prev) => ({ ...prev, isUploadingVideos: true }));

    const respVideo = await filesApi.uploadVideos(files);

    setHelper((prev) => ({ ...prev, isUploadingVideos: false }));
    setFormData((prev) => ({ ...prev, video: [...(prev?.video || []), ...respVideo] }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="loader"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center">
            <FaCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-700">Failed to load parameter data</span>
          </div>
        </div>
      </div>
    );
  }

  if (!formData) return null;

  return (
    <>
      <div className="bg-light rounded-lg border border-gray/30 mb-6 px-6 py-4 flex items-center justify-between">
        <div className="text-gray space-y-1">
          <h1 className="heading">Parameter Management</h1>
          <p>Configure system parameters and settings</p>
        </div>
        <div className="flex items-center gap-4">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="btn-blue">
              Edit Parameters
            </Button>
          ) : (
            <>
              <Button
                onClick={() => {
                  setIsEditing(false);
                  setFormData(parameter?.data);
                }}
                className="btn-gray"
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit} className={`btn-green flex items-center ${updateProduct.isPending && "animate-pulse"}`}>
                {updateProduct.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-light rounded-lg border border-gray/30">
          <div className="px-6 py-4 border-b border-gray/30">
            <h2 className="text-lg font-semibold text-gray-900">Financial Settings</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray">Shipping Cost</label>
              <NumberInput
                value={formData.shipping === 0 ? "" : formData.shipping}
                placeholder="Not set"
                onChange={(e) => handleInputChange("shipping", e.target.value === "" ? 0 : parseInt(e.target.value))}
                disabled={!isEditing}
                className={`input-form`}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray">Tax Amount / Rate</label>
              <div className="flex space-x-2">
                <NumberInput
                  value={formData.tax === 0 ? "" : formData.tax}
                  placeholder="Not set"
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (formData.taxType === DiscountType.PERCENTAGE) {
                      if (value > 100 || value < 0) return;
                    }
                    handleInputChange("tax", e.target.value === "" ? 0 : value);
                  }}
                  disabled={!isEditing}
                  className={`input-form`}
                />
                <select value={formData.taxType} onChange={(e) => handleInputChange("taxType", e.target.value as DiscountType)} disabled={!isEditing} className={`input-form max-w-36`}>
                  <option value="PERCENTAGE">Percentage</option>
                  <option value="FIXED">Fixed</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray">Promo Amount / Rate</label>
              <div className="flex space-x-2">
                <NumberInput
                  value={formData.promo === 0 ? "" : formData.promo}
                  placeholder="Not set"
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (formData.promoType === DiscountType.PERCENTAGE) {
                      if (value > 100 || value < 0) return;
                    }
                    handleInputChange("promo", e.target.value === "" ? 0 : value);
                  }}
                  disabled={!isEditing}
                  className={`input-form`}
                />
                <select value={formData.promoType} onChange={(e) => handleInputChange("promoType", e.target.value as DiscountType)} disabled={!isEditing} className={`input-form max-w-36`}>
                  <option value="PERCENTAGE">Percentage</option>
                  <option value="FIXED">Fixed</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray">Member Amount / Rate</label>
              <div className="flex space-x-2">
                <NumberInput
                  value={formData.member === 0 ? "" : formData.member}
                  placeholder="Not set"
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (formData.memberType === DiscountType.PERCENTAGE) {
                      if (value > 100 || value < 0) return;
                    }
                    handleInputChange("member", e.target.value === "" ? 0 : value);
                  }}
                  disabled={!isEditing}
                  className={`input-form`}
                />
                <select value={formData.memberType} onChange={(e) => handleInputChange("memberType", e.target.value as DiscountType)} disabled={!isEditing} className={`input-form max-w-36`}>
                  <option value="PERCENTAGE">Percentage</option>
                  <option value="FIXED">Fixed</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-light rounded-lg border border-gray/30">
          <div className="px-6 py-4 border-b border-gray/30 grid grid-cols-2 gap-8">
            <div className="flex items-center justify-between text-gray">
              <h2 className="font-semibold py-2">Qris Image</h2>
              {isEditing && (
                <label htmlFor="qrisImage" className="btn-blue px-2.5 text-sm py-2 md:px-4 font-medium duration-300 btn-blue flex items-center cursor-pointer">
                  <FaPlus className="h-4 w-4 mr-1" />
                  Edit Image
                  <input ref={imageInputRef} type="file" id="qrisImage" onChange={handleImageChange} hidden accept="image/*" />
                </label>
              )}
            </div>
            <div className="flex items-center justify-between text-gray">
              <h2 className="font-semibold py-2">Videos</h2>
              {isEditing && (
                <label htmlFor="video" className="btn-blue px-2.5 text-sm py-2 md:px-4 font-medium duration-300 btn-blue flex items-center cursor-pointer">
                  <FaPlus className="h-4 w-4 mr-1" />
                  Edit Videos
                  <input ref={videoInputRefs} type="file" id="video" onChange={handleVideoChange} hidden accept="video/mp4,video/x-m4v,video/*" multiple />
                </label>
              )}
            </div>
          </div>
          <div className="p-6 grid grid-cols-2 gap-8">
            {helper.isUploadingImage ? (
              <div className="flex items-center justify-center py-8">
                <div className="loader"></div>
              </div>
            ) : (
              <div className={`${helper.isDeletingImage && "animate-pulse"}`}>
                {formData.qrisImage && (
                  <div className="relative">
                    {isEditing && (
                      <button
                        onClick={() => handleImageRemove(formData.qrisImage?.path || "")}
                        type="button"
                        className="absolute flex items-center justify-center w-5 h-5 rounded-full -top-2 -right-2 z-1 bg-secondary"
                      >
                        <svg className="size-4 text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                    <Img src={formData.qrisImage?.url || ""} alt="qris image" className="aspect-square w-full rounded-lg" cover />
                  </div>
                )}
              </div>
            )}

            {helper.isUploadingVideos ? (
              <div className="flex items-center justify-center py-8">
                <div className="loader"></div>
              </div>
            ) : (
              <div className={`space-y-6 max-w-[1000px] overflow-y-auto scrollbar ${helper.isDeletingVideos && "animate-pulse"}`}>
                {formData.video?.map((video, index) => (
                  <div key={index} className="bg-light relative">
                    {isEditing && (
                      <button onClick={() => handleVideoRemove(video.path)} type="button" className="absolute flex items-center justify-center w-5 h-5 z-5 rounded-full top-2 right-2 bg-secondary">
                        <svg className="size-4 text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                    <div className="relative w-full h-auto shadow-md overflow-hidden rounded-lg">
                      <video src={video.url} aria-label={video.originalName} className="w-full h-auto" autoPlay muted loop controls />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

"use client";

import * as React from "react";

import Link from "next/link";

import { Container, Img } from "@/components";

import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const accordionData = [
  {
    id: 1,
    title: "Browse Our Collections",
    content: (
      <p className="leading-relaxed">
        Start by exploring our curated categories, from everyday wear to artisanal custom pieces. Each product page includes detailed photos, descriptions, and fabric notes to help you make an
        informed choice.
      </p>
    ),
  },
  {
    id: 2,
    title: "Select Your Style",
    content: (
      <div className="space-y-4">
        <p className="leading-relaxed">
          Choose your preferred size and color (if available). For custom orders, you can provide specific measurements and style notes—we love bringing your vision to life.
        </p>
        <p>
          Need help choosing a size? Visit our{" "}
          <Link href="/size-guide" className="inline-flex font-medium underline">
            Size Guide
          </Link>{" "}
          for detailed measurements.
        </p>
      </div>
    ),
  },
  {
    id: 3,
    title: "Place Your Order",
    content: (
      <div className="space-y-4">
        <p className="leading-relaxed">
          We offer two simple ways to order: <br />
          Ready-to-Wear: Click “Add to Cart” and proceed to checkout directly from our website.
        </p>
        <p>
          Custom or Special Orders:{" "}
          <Link href="/" className="inline-flex font-medium underline">
            Click Order via WhatsApp
          </Link>{" "}
          to chat with our team. Share your size, preferred style, and any special requests—we’ll guide you through the next steps.
        </p>
      </div>
    ),
  },
  {
    id: 4,
    title: "Secure Your Payment",
    content: <p>We accept the following payment methods (BCA BANK and MANDIRI BANK).</p>,
  },
  {
    id: 5,
    title: "Shipping & Delivery",
    content: (
      <div className="space-y-1">
        <p>Orders are processed within 1-3 business days. Custom-made items may take 21-30 working days, depending on the complexity.</p>
        <ul className="pl-6 list-disc">
          <li>We ship across Indonesia and offer international delivery upon request.</li>
          <li>You&apos;ll receive a tracking number once your order is on its way.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 6,
    title: "Need Assistance?",
    content: <p>Our team is here to help you with styling advice, fabric selections, or sizing questions. Reach out anytime via WhatsApp handy.</p>,
  },
];

export const HowToShop = () => {
  const [openItems, setOpenItems] = React.useState<Set<number>>(new Set([1, 2, 3, 4, 5, 6])); // First item open by default

  const toggleItem = (id: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <Container className="py-16">
      <div className="space-y-8">
        <h3 className="text-center heading">How to Shop</h3>
        <div className="flex gap-16">
          <div className="w-full">
            {accordionData.map((item) => {
              const isOpen = openItems.has(item.id);
              return (
                <div key={item.id} className="py-6 overflow-hidden border-b border-gray">
                  <button onClick={() => toggleItem(item.id)} className="flex items-center justify-between w-full px-4 text-left transition-colors duration-200">
                    <div className="flex items-center space-x-4 text-xl">
                      <span className="font-semibold text-gray">{item.id}.</span>
                      <span className="font-medium text-gray">{item.title}</span>
                    </div>
                    <div className="text-gray">{isOpen ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />}</div>
                  </button>

                  {isOpen && <div className="px-4 pt-2 bg-white text-gray">{item.content}</div>}
                </div>
              );
            })}
          </div>
          <div className="w-full max-w-md space-y-8">
            <div className="w-full space-y-4">
              <h4 className="text-lg font-medium md:text-xl lg:text-2xl text-gray">Payment Information</h4>
              <div className="grid grid-cols-2 py-4 border divide-x border-gray text-gray divide-gray/30">
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
              <p className="font-light">*You&apos;ll receive a confirmation once payment is complete.</p>
            </div>
            <div className="w-full space-y-4">
              <h4 className="text-lg font-medium md:text-xl lg:text-2xl text-gray">Need Assistance?</h4>
              <div className="grid grid-cols-2 py-4 border divide-x border-gray text-gray divide-gray/30">
                <div className="px-4 space-y-1">
                  <h3 className="text-lg font-medium">Personal Assistant 1</h3>
                  <p className="text-xs font-light">Whastapp</p>
                  <p className="text-lg font-light">+62 823-3993-6682</p>
                </div>
                <div className="px-4 space-y-1">
                  <h3 className="text-lg font-medium">Personal Assistant 2</h3>
                  <p className="text-xs font-light">Whastapp</p>
                  <p className="text-lg font-light">+62 812-3890-592</p>
                </div>
              </div>
              <div className="p-4 space-y-1 border border-gray text-gray">
                <h3 className="text-lg font-medium">Direct Message</h3>
                <p className="text-xs font-light">Instagram</p>
                <p className="font-medium">@mylindway</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Img src="/images/how-to-shop-sample-photo-1.webp" alt="image shop 1" className="w-full min-h-40" cover />
              <Img src="/images/how-to-shop-sample-photo-2.webp" alt="image shop 2" className="w-full min-h-40" cover />
              <Img src="/images/how-to-shop-sample-photo-3.webp" alt="image shop 3" className="w-full min-h-40" cover />
              <Img src="/images/how-to-shop-sample-photo-4.webp" alt="image shop 4" className="w-full min-h-40" cover />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

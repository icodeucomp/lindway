"use client";

import { useState } from "react";

import Link from "next/link";

import { Container, Background, Img } from "@/components";

import { WomenModal } from "./women-modal";
import { MenModal } from "./men-modal";
import { BabyModal } from "./baby-modal";

export const Size = () => {
  const [isModalWomen, setIsModalWomen] = useState<boolean>(false);
  const [isModalMen, setIsModalMen] = useState<boolean>(false);
  const [isModalBaby, setIsModalBaby] = useState<boolean>(false);
  return (
    <>
      <Container className="pt-16 space-y-8">
        <div className="grid grid-cols-3 text-light">
          <Background src="/images/size-guide-find-your-perfect-fit-women-measurement.webp" alt="women hero background" className="flex justify-center items-end min-h-600 bg-dark/30 p-8">
            <div className="space-y-4 text-center">
              <h4 className="text-2xl font-medium max-w-40">Women Measurement</h4>
              <button onClick={() => setIsModalWomen(true)} className="block pb-2 mx-auto border-b border-light w-max">
                See details
              </button>
            </div>
          </Background>
          <Background src="/images/size-guide-find-your-perfect-fit-men-measurement.webp" alt="men hero background" className="flex justify-center items-end min-h-600 bg-dark/30 p-8">
            <div className="space-y-4 text-center">
              <h4 className="text-2xl font-medium max-w-40">Men Measurement</h4>
              <button onClick={() => setIsModalMen(true)} className="block pb-2 mx-auto border-b border-light w-max">
                See details
              </button>
            </div>
          </Background>
          <Background src="/images/size-guide-find-your-perfect-fit-baby-measurement.webp" alt="baby hero background" className="flex justify-center items-end min-h-600 bg-dark/30 p-8">
            <div className="space-y-4 text-center">
              <h4 className="text-2xl font-medium max-w-40">Baby & Child Measurement</h4>
              <button onClick={() => setIsModalBaby(true)} className="block pb-2 mx-auto border-b border-light w-max">
                See details
              </button>
            </div>
          </Background>
          <Background
            src="/images/size-guide-find-your-perfect-fit-custom-fit-available.webp"
            alt="custom hero background"
            className="flex justify-center items-center min-h-400 bg-dark/30 p-8"
            parentClassName="col-span-3"
          >
            <div className="space-y-8 text-center">
              <div className="space-y-2">
                <h4 className="text-2xl font-medium">Custom Fit Available</h4>
                <p className="mx-auto max-w-2xl">Looking for a perfect, made-to-measure fit? Our team can craft your kebaya or special piece based on your exact measurements.</p>
              </div>
              <button className="flex items-center gap-2 pb-2 mx-auto border-b border-light w-max">
                <Img src="/icons/whatsapp-light.svg" alt="whatsapp icons" className="size-6" />
                Send My Measurements via WhatsApp
              </button>
            </div>
          </Background>
        </div>
        <div className="space-y-4 text-gray">
          <p>*For detailed garment dimensions (chest width, length), please refer to the product page or contact us directly.</p>
          <div>
            <h4 className="text-lg font-medium">A Few Fit Tips:</h4>
            <ul className="list-disc pl-6">
              <li>All pieces are measured flat and may vary slightly due to artisanal techniques.</li>
              <li>Natural fabrics may relax with wear—especially batik and handwoven cotton.</li>
              <li>When in doubt, our team is happy to help you decide.</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-medium">Still Unsure?</h4>
            <p>Send us a message—we&apos;ll guide you with care. Your comfort matters just as much as your style.</p>
          </div>
          <Link href="/contact-us" className="block py-2 mx-auto border-b border-gray w-max">
            Chat with Us
          </Link>
        </div>
      </Container>
      <WomenModal isVisible={isModalWomen} onClose={() => setIsModalWomen(false)} />
      <MenModal isVisible={isModalMen} onClose={() => setIsModalMen(false)} />
      <BabyModal isVisible={isModalBaby} onClose={() => setIsModalBaby(false)} />
    </>
  );
};

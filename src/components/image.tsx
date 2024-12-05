import Image from "next/image";

import { ImageProps } from "@/types";
import { shimmer, toBase64 } from "@/utils";

export const Img = ({ src, alt, className, cover }: ImageProps) => {
  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      <Image src={src} alt={alt} fill objectFit={cover ? "cover" : ""} objectPosition="center" placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(500, 500))}`} className="w-full h-full" />
    </div>
  );
};

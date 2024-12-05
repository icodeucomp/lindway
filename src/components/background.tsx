import Image from "next/image";

import { shimmer, toBase64 } from "@/utils";

import { BackgroundProps } from "@/types";

export const Background = ({ src, className, children, parentClassName, isHover, isTop }: BackgroundProps) => {
  return (
    <figure className={`relative text-light overflow-hidden group ${parentClassName ?? ""}`}>
      <Image
        src={src}
        alt="background image"
        placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(800, 800))}`}
        fill
        priority
        objectFit="cover"
        objectPosition={isTop ? "top" : "center"}
        className={`-z-10 ${isHover ? "duration-300 group-hover:scale-110" : ""}`}
      />
      <div className={`z-1 flex mx-auto ${className ?? ""}`}>{children}</div>
    </figure>
  );
};

"use client";

import { useState } from "react";
import Image from "next/image";

const PLACEHOLDER_IMAGE =
  "https://placehold.co/800x600/e5e7eb/6b7280?text=G%C3%B6rsel+Yok";

export default function DestinationsRouteImage({
  src,
  alt,
  priority,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  const [imageSrc, setImageSrc] = useState(src);

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill
      priority={priority}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      onError={() => {
        if (imageSrc !== PLACEHOLDER_IMAGE) setImageSrc(PLACEHOLDER_IMAGE);
      }}
    />
  );
}

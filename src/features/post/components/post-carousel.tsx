"use client";

import { IKImage } from "imagekitio-next";
import { useEffect, useState } from "react";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "~/components/ui/carousel";
import { env } from "~/data/env/client";
import { cn } from "~/lib/utils";

export function PostCarousel({ imageUrls }: { imageUrls: string[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <Carousel className="relative" setApi={setApi}>
      <CarouselContent className="-ml-0">
        {imageUrls.map((imageUrl, index) => (
          <CarouselItem
            key={index}
            className="relative select-none pl-[1px] pr-[1px]"
          >
            <AspectRatio ratio={5 / 6}>
              <IKImage
                urlEndpoint={env.NEXT_PUBLIC__IMAGEKIT_URL_ENDPOINT}
                src={imageUrl}
                fill
                alt="image"
              />
            </AspectRatio>
          </CarouselItem>
        ))}
      </CarouselContent>

      {imageUrls.length > 1 ? (
        <Dots count={imageUrls.length} current={current} />
      ) : null}
    </Carousel>
  );
}

function Dots({ count, current }: { count: number; current: number }) {
  const iterator = Array.from({ length: count });

  return (
    <div className="absolute bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-x-2 rounded-lg bg-black px-4 py-1 opacity-70">
      {iterator.map((_, index) => (
        <div
          className={cn(
            "h-2 w-2 rounded-full bg-gray-600 transition-colors duration-300",
            index === current ? "bg-white" : ""
          )}
          key={index}
        ></div>
      ))}
    </div>
  );
}

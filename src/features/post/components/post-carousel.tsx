"use client";

import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "~/components/ui/carousel";
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
    <Carousel className="relative w-full h-full" setApi={setApi}>
      <CarouselContent className="-ml-0 w-full h-full flex items-center">
        {imageUrls.map((imageUrl, index) => (
          <CarouselItem
            key={index}
            className="relative select-none pl-[1px] pr-[1px] w-full h-full"
          >
            <div className="w-full h-full flex justify-center items-center">
              <img
                src={imageUrl}
                loading="lazy"
                alt="image"
                className="w-full h-full object-cover"
              />
            </div>
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

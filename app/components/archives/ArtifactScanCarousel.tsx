'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export default function ArtifactScanCarousel({
  images,
  title,
}: {
  images: Array<{ url: string; alt: string }>;
  title: string;
}) {
  const scans = Array.from(
    new Map(
      images.filter((image) => image.url).map((image) => [image.url, image]),
    ).values(),
  );
  const closeLightboxRef = useRef<HTMLButtonElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const hasMultipleScans = scans.length > 1;
  const activeScan = scans[activeIndex] ?? {
    url: '/placeholder.png',
    alt: title,
  };
  const expandedImageDimensions = activeScan.url.match(
    /-(\d+)x(\d+)\.[a-z]+(?:\?.*)?$/i,
  );
  const expandedImageWidth = Number(expandedImageDimensions?.[1] ?? 1600);
  const expandedImageHeight = Number(expandedImageDimensions?.[2] ?? 1600);

  useEffect(() => {
    if (!isExpanded) return undefined;

    const previousOverflow = document.body.style.overflow;
    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsExpanded(false);
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', closeOnEscape);
    closeLightboxRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', closeOnEscape);
      previousFocus?.focus();
    };
  }, [isExpanded]);

  const move = (direction: number) => {
    setActiveIndex(
      (currentIndex) =>
        (currentIndex + direction + scans.length) % scans.length,
    );
  };

  return (
    <div aria-label={`${title} scans`} aria-roledescription="carousel">
      <div className="group/scan relative aspect-square overflow-hidden bg-[#F4F4F0]">
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="absolute inset-0 cursor-zoom-in"
          aria-label={`Enlarge ${title} scan ${activeIndex + 1}`}
        >
          <Image
            key={activeScan.url}
            src={activeScan.url}
            alt={activeScan.alt}
            fill
            priority={activeIndex === 0}
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-contain p-6"
          />
        </button>

        {hasMultipleScans && (
          <>
            <button
              type="button"
              onClick={() => move(-1)}
              className="absolute left-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center border border-black bg-white opacity-0 transition-all hover:bg-black hover:text-white group-focus-within/scan:opacity-100 group-hover/scan:opacity-100"
              aria-label="Previous scan"
            >
              <ChevronLeftIcon className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => move(1)}
              className="absolute right-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center border border-black bg-white opacity-0 transition-all hover:bg-black hover:text-white group-focus-within/scan:opacity-100 group-hover/scan:opacity-100"
              aria-label="Next scan"
            >
              <ChevronRightIcon className="size-5" />
            </button>
            <p className="absolute bottom-3 right-3 bg-black px-2 py-1 font-mono text-[10px] text-white opacity-0 transition-opacity group-focus-within/scan:opacity-100 group-hover/scan:opacity-100">
              {activeIndex + 1} / {scans.length}
            </p>
          </>
        )}
      </div>

      {hasMultipleScans && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {scans.map((scan, index) => (
            <button
              key={scan.url}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative aspect-square w-20 flex-none overflow-hidden bg-[#F4F4F0] ${
                activeIndex === index
                  ? 'border-2 border-black'
                  : 'border border-transparent hover:border-black'
              }`}
              aria-label={`Show scan ${index + 1}`}
              aria-current={activeIndex === index ? 'true' : undefined}
            >
              <Image
                src={scan.url}
                alt=""
                fill
                sizes="80px"
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}

      {isExpanded && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 md:p-10"
          role="dialog"
          aria-label={`${title} enlarged scan`}
          aria-modal="true"
        >
          <button
            ref={closeLightboxRef}
            type="button"
            onClick={() => setIsExpanded(false)}
            className="absolute inset-0 cursor-zoom-out focus:outline-none"
            aria-label="Close enlarged scan"
          />
          <Image
            key={`expanded-${activeScan.url}`}
            src={activeScan.url}
            alt={`${activeScan.alt} (enlarged)`}
            width={expandedImageWidth}
            height={expandedImageHeight}
            sizes="100vw"
            className="relative z-10 h-auto max-h-[calc(100vh-2rem)] w-auto max-w-[calc(100vw-2rem)] object-contain md:max-h-[calc(100vh-5rem)] md:max-w-[calc(100vw-5rem)]"
          />
        </div>
      )}
    </div>
  );
}

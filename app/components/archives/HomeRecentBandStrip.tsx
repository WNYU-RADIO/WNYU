'use client';

import { useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Marquee from 'react-fast-marquee';
import type { HOME_RECENT_BANDS_QUERYResult } from '@/sanity.types';

type RecentBand = HOME_RECENT_BANDS_QUERYResult[number];

function RecentBandCard({ band }: { band: RecentBand }) {
  return (
    <div className="relative aspect-square w-full overflow-hidden">
      <Image
        src={band.imageUrl}
        alt={band.imageAlt}
        fill
        sizes="(min-width: 768px) 25vw, 50vw"
        className="object-contain"
      />
    </div>
  );
}

export default function HomeRecentBandStrip({
  bands,
}: {
  bands: HOME_RECENT_BANDS_QUERYResult;
}) {
  const prefersReducedMotion = useReducedMotion();
  const cards = bands.map((band) => (
    <div
      key={band.id}
      className="mr-4 w-[calc((100cqw-2rem)/2)] flex-none md:w-[calc((100cqw-4rem)/4)]"
    >
      <RecentBandCard band={band} />
    </div>
  ));

  return (
    <section className="[container-type:inline-size]">
      <div className="mb-8 text-center">
        <h2 className="pb-5 text-center md:mt-auto">recent bands</h2>
      </div>
      {bands.length > 0 &&
        (prefersReducedMotion ? (
          <div className="flex overflow-x-auto pb-3" aria-label="Recent bands">
            {cards}
          </div>
        ) : (
          <Marquee
            autoFill
            gradient
            gradientColor="#ffffff"
            gradientWidth="6%"
            pauseOnHover
            aria-label="Recent bands"
          >
            {cards}
          </Marquee>
        ))}
      {bands.length === 0 && (
        <p className="py-8 text-sm uppercase tracking-wide">
          Recent bands are coming soon.
        </p>
      )}
    </section>
  );
}

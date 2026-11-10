'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import ArtifactCard from './ArtifactCard';
import PhotoClaimCard from './PhotoClaimCard';
import { getArchiveGridLayout } from './gridLayout';
import type { ArchiveItem } from './types';

const ARCHIVE_TABS = [
  'ALL',
  'COLLECTION HIGHLIGHTS',
  'PROFILES',
  'NEWS',
  'PHOTOS',
] as const;

type ArchiveTab = (typeof ARCHIVE_TABS)[number];

const ARCHIVE_REFRESH_INTERVAL = 15_000;

const GRID_VARIANTS: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const CARD_VARIANTS: Variants = {
  hidden: { opacity: 0, scale: 0.98, y: 24 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
};

const getArchiveTab = (category: string | null): ArchiveTab => {
  const normalizedCategory = category?.toUpperCase();
  return (
    ARCHIVE_TABS.find((tab) => tab === normalizedCategory) ?? ARCHIVE_TABS[0]
  );
};

export default function ArchivesStorefront({
  items,
}: {
  items: ArchiveItem[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefersReducedMotion = useReducedMotion();
  const activeTab = getArchiveTab(searchParams.get('category'));
  const photos = items.filter((item) => item.category === 'Photos');

  useEffect(() => {
    const refreshArchive = () => router.refresh();
    const refreshVisibleArchive = () => {
      if (document.visibilityState === 'visible') refreshArchive();
    };

    const intervalId = window.setInterval(
      refreshVisibleArchive,
      ARCHIVE_REFRESH_INTERVAL,
    );
    window.addEventListener('focus', refreshVisibleArchive);
    document.addEventListener('visibilitychange', refreshVisibleArchive);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('focus', refreshVisibleArchive);
      document.removeEventListener('visibilitychange', refreshVisibleArchive);
    };
  }, [router]);

  const filteredItems =
    activeTab === 'ALL'
      ? items
      : items.filter((item) => item.category.toUpperCase() === activeTab);

  const selectTab = (tab: ArchiveTab) => {
    const nextSearchParams = new URLSearchParams(searchParams.toString());
    if (tab === 'ALL') nextSearchParams.delete('category');
    else nextSearchParams.set('category', tab);

    const queryString = nextSearchParams.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  };

  return (
    <section className="grid items-start gap-8 md:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="min-w-0">
        <div className="mb-8 flex gap-2 overflow-x-auto border-y border-black py-3">
          {ARCHIVE_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              aria-pressed={activeTab === tab}
              onClick={() => selectTab(tab)}
              className={`shrink-0 border border-black px-4 py-2 text-xs font-bold tracking-wide transition-colors ${
                activeTab === tab
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-neutral-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <motion.div
          key={activeTab}
          initial={prefersReducedMotion ? false : 'hidden'}
          animate="visible"
          variants={GRID_VARIANTS}
          className="grid grid-flow-dense grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-5"
        >
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              variants={CARD_VARIANTS}
              className={getArchiveGridLayout(item.gridSize).span}
            >
              <ArtifactCard item={item} />
            </motion.div>
          ))}
        </motion.div>
        {filteredItems.length === 0 && (
          <p className="py-16 text-center text-sm uppercase tracking-wide">
            No archive items in this category yet.
          </p>
        )}
      </div>

      <aside
        className="fixed bottom-0 right-0 top-16 z-30 hidden min-h-0 w-80 flex-col border-l-2 border-black bg-white px-6 pb-6 pt-8 md:flex"
        aria-labelledby="photo-claim-title"
      >
        <header className="flex-none border-b border-black pb-4">
          <h2
            id="photo-claim-title"
            className="!text-4xl !font-normal !leading-none"
          >
            this you?
          </h2>
          <p className="mt-3 text-sm leading-tight">
            click a photo to identify or claim it!
          </p>
        </header>
        <div className="mt-4 min-h-0 flex-1 space-y-7 overflow-y-auto overscroll-contain pr-2">
          {photos.map((photo) => (
            <PhotoClaimCard key={photo.id} photo={photo} />
          ))}
          {photos.length === 0 && (
            <p className="py-8 text-xs uppercase tracking-wide">
              Archive photos are coming soon.
            </p>
          )}
        </div>
      </aside>
    </section>
  );
}

import Image from 'next/image';
import Link from 'next/link';
import { getArchiveGridLayout } from './gridLayout';
import type { ArchiveCategory, ArchiveItem } from './types';

const CATEGORY_TINTS: Partial<Record<ArchiveCategory, string>> = {
  'Collection Highlights': 'bg-[#F4F1EA]',
  Profiles: 'bg-[#EAECEF]',
  News: 'bg-[#F2F2F2]',
  Photos: 'bg-[#F6EFE2]',
};

export default function ArtifactCard({ item }: { item: ArchiveItem }) {
  const gridLayout = getArchiveGridLayout(item.gridSize);
  const backdropClass = CATEGORY_TINTS[item.category] ?? 'bg-[#F3F3EE]';
  const imageSizes = '(min-width: 768px) 25vw, 50vw';
  let metadata: string = item.category;
  if (item.date) metadata = `${item.date} · ${item.category}`;
  if (item.callNumber)
    metadata = `${item.category} · Call Number: ${item.callNumber}`;
  return (
    <Link href={`/archives/${item.slug}`} className="group block min-w-0">
      <div
        className={`relative overflow-hidden ${gridLayout.aspect} ${backdropClass}`}
      >
        <Image
          src={item.imageUrl}
          alt={item.imageAlt || item.title}
          fill
          sizes={imageSizes}
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
        />
      </div>
      <h3 className="mt-3 !text-sm !font-bold uppercase !leading-tight">
        {item.title}
      </h3>
      <p className="mt-1 text-xs uppercase tracking-wide">{metadata}</p>
    </Link>
  );
}

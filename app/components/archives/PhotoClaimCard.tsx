import Image from 'next/image';
import Link from 'next/link';
import type { ArchiveItem } from './types';

export default function PhotoClaimCard({ photo }: { photo: ArchiveItem }) {
  return (
    <Link href={`/archives/${photo.slug}`} className="group block min-w-0">
      <div className="relative aspect-square overflow-hidden bg-[#F3F3EE]">
        <Image
          src={photo.imageUrl}
          alt={photo.imageAlt || photo.title}
          fill
          sizes="20rem"
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
        />
      </div>
      <h3 className="mt-2 !text-sm !font-bold uppercase !leading-tight">
        {photo.title}
      </h3>
      {photo.callNumber && (
        <p className="mt-1 text-xs uppercase tracking-wide">
          Call Number: {photo.callNumber}
        </p>
      )}
    </Link>
  );
}

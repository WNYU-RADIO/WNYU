import { Suspense } from 'react';
import ArchivesStorefront from '@/app/components/archives/ArchivesStorefront';
import { sanityFetch } from '@/sanity/lib/client';
import { ARCHIVE_ITEMS_QUERY } from '@/sanity/lib/queries';
import type { ARCHIVE_ITEMS_QUERYResult } from '@/sanity.types';

export default async function ArchivesPage() {
  const archiveDocuments = await sanityFetch<ARCHIVE_ITEMS_QUERYResult>({
    query: ARCHIVE_ITEMS_QUERY,
    tags: ['collectionHighlight', 'profile', 'archiveNews', 'photo'],
  });

  return (
    <main className="w-full px-4 pb-20 pt-8 md:px-8">
      <header className="mb-3 pb-2 md:pr-[22rem]">
        <h1>Archives</h1>
        <p className="mt-4 text-sm font-bold uppercase tracking-wide cursor-not-allowed text-gray-400">
          {/* <a
            href="" /*https://www.libib.com/u/wnyuarchives
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-bold uppercase transition-colors hover:text-red-600"
          > */}
            Open Libib catalog ↗
          
        </p>
      </header>
      <Suspense
        fallback={
          <p className="py-16 text-center text-sm uppercase tracking-wide">
            Loading the archive…
          </p>
        }
      >
        <ArchivesStorefront items={archiveDocuments} />
      </Suspense>
    </main>
  );
}

import { PortableText } from '@portabletext/react';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ScrollToTop from '@/app/components/ScrollToTop';
import ArtifactScanCarousel from '@/app/components/archives/ArtifactScanCarousel';
import { sanityFetch } from '@/sanity/lib/client';
import { ARCHIVE_BY_SLUG_QUERY } from '@/sanity/lib/queries';
import type { ARCHIVE_BY_SLUG_QUERYResult } from '@/sanity.types';

type ArchiveParams = Promise<{ slug: string }>;

const PHOTO_CLAIM_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSelNuzzaRGPQd5AJ1iIWttnP7qultfy--zxmFGcAIKzYMjSvg/viewform';
const PHOTO_CALL_NUMBER_FIELD = 'entry.252213096';

const getPhotoClaimFormUrl = (callNumber: string, embedded = false) => {
  const searchParams = new URLSearchParams({
    usp: 'pp_url',
    [PHOTO_CALL_NUMBER_FIELD]: callNumber,
  });

  if (embedded) searchParams.set('embedded', 'true');

  return `${PHOTO_CLAIM_FORM_URL}?${searchParams.toString()}`;
};

function PhotoClaimForm({
  callNumber,
  photoTitle,
}: {
  callNumber: string;
  photoTitle: string;
}) {
  const embeddedFormUrl = getPhotoClaimFormUrl(callNumber, true);
  const directFormUrl = getPhotoClaimFormUrl(callNumber);

  return (
    <section aria-labelledby="photo-claim-form-title">
      <h2
        id="photo-claim-form-title"
        className="!text-3xl !font-normal !leading-none"
      >
        claim this photo
      </h2>
      <p id="photo-claim-form-status" className="mt-4 text-sm leading-snug">
        Recognize this photo? Submit what you know below. Call number{' '}
        <strong>{callNumber}</strong> is already filled in for you.
      </p>
      <iframe
        src={embeddedFormUrl}
        title={`Claim ${photoTitle}`}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        className="mt-6 h-[48rem] w-full border-0 bg-white md:h-[52rem]"
      >
        Loading photo claim form…
      </iframe>
      <p className="mt-3 text-xs leading-snug">
        If the embedded form does not load,{' '}
        <a
          href={directFormUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold underline underline-offset-2 transition-colors hover:text-red-600 focus-visible:text-red-600"
        >
          open the claim form in a new tab
        </a>
        .
      </p>
    </section>
  );
}

export default async function ArchiveDetailPage({
  params,
}: {
  params: ArchiveParams;
}) {
  const { slug } = await params;
  const archiveEntry = await sanityFetch<ARCHIVE_BY_SLUG_QUERYResult>({
    query: ARCHIVE_BY_SLUG_QUERY,
    params: { slug },
    tags: ['collectionHighlight', 'profile', 'archiveNews', 'photo'],
  });

  if (!archiveEntry) notFound();

  const images = (archiveEntry.images ?? []).flatMap((image) =>
    image.url
      ? [
          {
            url: image.url,
            alt: image.alt || archiveEntry.title,
          },
        ]
      : [],
  );

  return (
    <main className="mx-auto max-w-7xl px-4 pb-20 pt-6 md:px-8">
      <ScrollToTop />
      <header className="flex items-center gap-2">
        <Link
          href="/archives"
          className="shrink-0 transition-colors hover:text-red-600"
          aria-label="Back to archives"
        >
          <ChevronLeftIcon className="size-7 stroke-1" />
        </Link>
        <h1 className="!text-3xl !font-bold uppercase !leading-none md:!text-4xl">
          {archiveEntry.title}
        </h1>
      </header>

      <div className="mt-10 grid gap-8 md:grid-cols-2 md:items-start">
        <section>
          <ArtifactScanCarousel images={images} title={archiveEntry.title} />
          <div className="mt-4 space-y-2 text-sm font-bold uppercase leading-tight text-neutral-700">
            <p>
              {archiveEntry.category}
              {archiveEntry.date ? `, ${archiveEntry.date}` : ''}
            </p>
            {archiveEntry.writer && <p>By: {archiveEntry.writer}</p>}
            {archiveEntry.callNumber && (
              <p>Call number: {archiveEntry.callNumber}</p>
            )}
          </div>
        </section>

        {archiveEntry.documentType === 'photo' ? (
          <PhotoClaimForm
            callNumber={archiveEntry.callNumber || ''}
            photoTitle={archiveEntry.title}
          />
        ) : (
          <article className="text-sm leading-relaxed">
            {archiveEntry.portableDescription ? (
              <div className="prose prose-sm max-w-none">
                <PortableText value={archiveEntry.portableDescription} />
              </div>
            ) : (
              <p className="whitespace-pre-wrap font-medium">
                {archiveEntry.textDescription || 'Description forthcoming.'}
              </p>
            )}
          </article>
        )}
      </div>
    </main>
  );
}

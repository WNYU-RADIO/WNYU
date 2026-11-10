import { PortableText } from '@portabletext/react';
import { ManagementCardList } from '@/app/components/ManagementCardList';
import { sanityFetch } from '@/sanity/lib/client';
import { MANAGEMENT_CARDS_QUERY, ABOUT_TEXT_QUERY } from '@/sanity/lib/queries';
import type {
  MANAGEMENT_CARDS_QUERYResult,
  ABOUT_TEXT_QUERYResult,
} from '@/sanity.types';

export default async function About() {
  const [cards, aboutText] = await Promise.all([
    sanityFetch<MANAGEMENT_CARDS_QUERYResult>({
      query: MANAGEMENT_CARDS_QUERY,
      tags: ['managementCard'],
    }),
    sanityFetch<ABOUT_TEXT_QUERYResult>({
      query: ABOUT_TEXT_QUERY,
      tags: ['textBlock'],
    }),
  ]);
  return (
    <div className="mx-8 pb-4 md:mx-14 md:flex md:justify-between">
      <div className="pr-1/4 prose mr-auto shrink-0 pb-4 pt-10 leading-5 md:w-1/2">
        {aboutText?.content ? <PortableText value={aboutText.content} /> : null}
      </div>
      <div className="pt-10">
        <h4 className="mb-4 border-b-2 border-black text-2xl md:ml-14">
          Management:
        </h4>
        <ManagementCardList cards={cards} />
      </div>
    </div>
  );
}

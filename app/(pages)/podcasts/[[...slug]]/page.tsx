import { sanityFetch } from '@/sanity/lib/client';
import {
  PODCAST_BY_SLUG_QUERY,
  PODCAST_DEPARTMENTS,
  PODCASTS_BY_DEPARTMENT_QUERY,
} from '@/sanity/lib/queries';
import { PODCAST_QUERYResult, PODCASTS_QUERYResult } from '@/sanity.types';
import PodcastsPanel from '@/app/components/PodcastsPanel';

async function PodcastsProvider({ slug }: { slug: string | undefined }) {
  let activePodcast;
  if (slug) {
    activePodcast = await sanityFetch<PODCAST_QUERYResult>({
      query: PODCAST_BY_SLUG_QUERY(slug),
      tags: ['podcast'],
    });
  }
  const podcasts = await sanityFetch<PODCASTS_QUERYResult>({
    query: PODCASTS_BY_DEPARTMENT_QUERY(PODCAST_DEPARTMENTS.NEWS),
    tags: ['podcast'],
  });

  return <PodcastsPanel podcasts={podcasts} activePodcast={activePodcast} />;
}

type PodcastParams = Promise<{ slug: string }>;

export default async function PodcastPage({
  params,
}: {
  params: PodcastParams;
}) {
  const { slug } = await params;

  return (
    <div className="h-[calc(100dvh-4rem)] md:mx-2">
      <PodcastsProvider slug={slug} />
    </div>
  );
}

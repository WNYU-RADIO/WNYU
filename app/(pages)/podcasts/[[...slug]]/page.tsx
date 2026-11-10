import { sanityFetch } from '@/sanity/lib/client';
import {
  PODCAST_BY_SLUG_QUERY,
  PODCASTS_BY_DEPARTMENT_QUERY,
} from '@/sanity/lib/queries';
import PodcastsPanel from '@/app/components/PodcastsPanel';
import type { PODCASTS_QUERYResult } from '@/sanity.types';

async function PodcastsProvider({ slug }: { slug: string | undefined }) {
  const [activePodcast, podcasts] = await Promise.all([
    slug
      ? sanityFetch<PODCASTS_QUERYResult[number] | null>({
          query: PODCAST_BY_SLUG_QUERY,
          params: { slug },
          tags: ['podcast'],
        })
      : undefined,
    sanityFetch<PODCASTS_QUERYResult>({
      query: PODCASTS_BY_DEPARTMENT_QUERY,
      params: { department: 'news' },
      tags: ['podcast'],
    }),
  ]);

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

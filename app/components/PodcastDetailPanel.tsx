import Podcast from './Podcast';
import type { PODCASTS_QUERYResult } from '@/sanity.types';

export default function PodcastDetailPanel({
  podcast,
}: {
  podcast: PODCASTS_QUERYResult[number] | null;
}) {
  return (
    <div className="flex h-[calc(100dvh-4rem)] flex-col p-6 md:overflow-y-scroll">
      <Podcast podcast={podcast} />
    </div>
  );
}

import Link from 'next/link';
import AnnouncementsCarousel from '@/app/components/AnnouncementsCarousel';
import CurrentPlaylistPanel from '@/app/components/CurrentPlaylistPanel';
import HomeRecentBandStrip from '@/app/components/archives/HomeRecentBandStrip';
import VideoCard from '@/app/components/VideoCard';
import { sanityFetch } from '@/sanity/lib/client';
import {
  ANNOUNCEMENTS_QUERY,
  HOME_RECENT_BANDS_QUERY,
  VIDEO_CARDS_QUERY,
} from '@/sanity/lib/queries';
import type {
  ANNOUNCEMENTS_QUERYResult,
  HOME_RECENT_BANDS_QUERYResult,
  VIDEO_CARDS_QUERYResult,
} from '@/sanity.types';

export default async function Home() {
  const [announcements, videos, recentBands] = await Promise.all([
    sanityFetch<ANNOUNCEMENTS_QUERYResult>({
      query: ANNOUNCEMENTS_QUERY,
      tags: ['announcement'],
    }),
    sanityFetch<VIDEO_CARDS_QUERYResult>({
      query: VIDEO_CARDS_QUERY,
      tags: ['videoCard'],
    }),
    sanityFetch<HOME_RECENT_BANDS_QUERYResult>({
      query: HOME_RECENT_BANDS_QUERY,
      tags: ['recentBand'],
    }),
  ]);

  return (
    <div className="container static flex flex-col-reverse justify-between gap-4 p-2 md:mx-auto md:flex-row md:gap-0 md:py-6">
      <div className="flex flex-col gap-16 md:w-2/3">
        <div className="flex flex-col gap-3">
          <div className="hidden h-[500px] md:block">
            <AnnouncementsCarousel announcements={announcements} />
          </div>
          <HomeRecentBandStrip bands={recentBands} />
        </div>
        <h2 className="mt-6 text-center md:mt-auto">
          <Link
            href="https://www.youtube.com/@wnyu9181"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-red-600"
          >
            our latest videos
          </Link>
        </h2>
        <div className="flex flex-col gap-8">
          {videos.map((video) =>
            video.videoLink ? (
              <VideoCard videoLink={video.videoLink} key={video.id} />
            ) : null,
          )}
        </div>
      </div>
      <div className="mx-auto overflow-hidden border-2 border-black md:sticky md:top-[5.5rem] md:mx-0 md:h-[calc(100dvh-8rem)] md:max-w-[400px]">
        <CurrentPlaylistPanel />
      </div>
      <div className="h-[450px] w-full md:hidden">
        <AnnouncementsCarousel announcements={announcements} />
      </div>
    </div>
  );
}

import { getShows } from '@/app/server-api';
import SchedulePanel from '../../../components/SchedulePanel';
import type { PlaylistsResponse } from '@wnyu/spinitron-sdk';

async function ScheduleProvider({
  showId,
  initialDay,
}: {
  showId: string | undefined;
  initialDay: string | undefined;
}) {
  let playlists;
  let activeShow;
  const shows = await getShows();
  if (showId) {
    playlists = (await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/playlists?show_id=${showId}`,
      {
        cache: 'default',
        next: { revalidate: 3600 },
      },
    ).then((res) => res.json())) as PlaylistsResponse;
    const intShowId = parseInt(showId, 10);
    activeShow = shows.items.find((show) => show.id === intShowId);
  }

  return (
    <SchedulePanel
      shows={shows.items}
      activeShow={activeShow}
      playlists={playlists?.items}
      initialDay={initialDay}
    />
  );
}

type ScheduleParams = Promise<{ showId: string | undefined }>;
type ScheduleSearchParams = Promise<{ day?: string }>;

export default async function Page({
  params,
  searchParams,
}: {
  params: ScheduleParams;
  searchParams: ScheduleSearchParams;
}) {
  const { showId } = await params;
  const { day } = await searchParams;

  return (
    <div className="md:mr-auto">
      <ScheduleProvider showId={showId} initialDay={day} />
    </div>
  );
}

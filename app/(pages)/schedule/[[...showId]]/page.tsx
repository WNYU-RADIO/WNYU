import { fetchWnyu, getShows } from '@/app/server-api';
import SchedulePanel from '../../../components/SchedulePanel';
import type { PlaylistsResponse } from '@wnyu/spinitron-sdk';

async function ScheduleProvider({
  showId,
  initialDay,
}: {
  showId: string | undefined;
  initialDay: string | undefined;
}) {
  const [shows, playlists] = await Promise.all([
    getShows(),
    showId
      ? fetchWnyu<PlaylistsResponse>(
          'playlists',
          new URLSearchParams({ show_id: showId }),
        )
      : undefined,
  ]);
  const activeShow = showId
    ? shows.items.find((show) => show.id === Number(showId))
    : undefined;

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

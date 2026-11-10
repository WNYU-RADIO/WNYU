import Link from 'next/link';
import ShowDetail from './ShowDetail';
import type { Show, Playlist } from '@wnyu/spinitron-sdk';

interface ShowDetailPanelProps {
  show: Show;
  playlists?: Playlist[];
}

export default function ShowDetailPanel({
  show,
  playlists,
}: ShowDetailPanelProps) {
  return (
    <div className="flex flex-col pt-4 md:overflow-y-scroll md:p-6">
      <div className="bg-white">
        <ShowDetail show={show} />
      </div>
      <div className="mb-6 w-full border-b-2 border-black pb-2">
        <h4>Playlists:</h4>
      </div>
      <div className="flex flex-col flex-wrap gap-6 pb-6 md:justify-start">
        {playlists &&
          playlists.map((playlist) => (
            <Link
              key={playlist.id}
              className="block w-full cursor-pointer underline transition-all hover:opacity-50"
              href={`/playlists/${playlist.id}`}
            >
              {new Date(playlist.start).toLocaleString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </Link>
          ))}
      </div>
    </div>
  );
}

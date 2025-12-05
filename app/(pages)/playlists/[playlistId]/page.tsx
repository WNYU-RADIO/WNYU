import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { trimSpinitronDescriptionString } from '@/app/utils';
import type { Persona, Playlist, SpinsResponse } from '@wnyu/spinitron-sdk';

type PlaylistParams = Promise<{ playlistId: string }>;

export default async function Page({ params }: { params: PlaylistParams }) {
  const { playlistId } = await params;

  const playlist = (await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/playlists/${playlistId}`,
    { cache: 'default', next: { revalidate: 3600 } },
  ).then((res) => res.json())) as Playlist;
  const spins: SpinsResponse = (await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/spins?playlist_id=${playlistId}&count=100`,
    { cache: 'default', next: { revalidate: 3600 } },
  ).then((res) => res.json())) as SpinsResponse;
  const persona: Persona = (await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/personas/${playlist.persona_id}`,
    { cache: 'default', next: { revalidate: 3600 } },
  ).then((res) => res.json())) as Persona;

  return (
    <div className="pt-4 md:flex md:items-start">
      <div className="md:w-1/2">
        <div className="z-10 p-4 md:top-20">
          <div className="mb-2 flex items-center gap-x-2">
            <Link href={`/schedule/${playlist.show_id}`} className="md:block">
              <ChevronLeftIcon className="mr-6 h-6 w-6" />
            </Link>
            <p>{new Date(playlist.start).toDateString()}</p>
          </div>
          <h1 className="break-words md:pb-4">{playlist.title}</h1>
          <p className="pt-4">{`hosted by ${persona.name}`}</p>
          <p>
            {new Date(playlist.start).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
            })}
            {' - '}
            {new Date(playlist.end).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
            })}
          </p>
          <p className="mt-4 hidden md:block">
            {trimSpinitronDescriptionString(playlist.description)}
          </p>
        </div>
      </div>
      <div className="flex flex-col p-4 md:w-1/2 md:px-20">
        {spins.items &&
          spins.items.map((spin, index) => (
            <div className="mx-2 flex gap-x-2 pb-4" key={spin.id}>
              <p>{index + 1}.</p>
              <p>
                {`${spin.song} - 
                  ${spin.artist}, 
                  ${spin.release}
                  (${spin.label})
                  ${spin.released}
                  `}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}

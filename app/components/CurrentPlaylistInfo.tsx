'use client';

import { Playlist, SpinitronMetadata } from '@wnyu/spinitron-sdk';
import Image from 'next/image';
import Link from 'next/link';
import { trimSpinitronDescriptionString } from '../utils';
import { isPlaylistOnAir } from '../utils';

interface CurrentPlaylistInfoProps {
  playlist?: Playlist;
  metadata?: SpinitronMetadata;
  dropdown?: boolean;
}

export default function CurrentPlaylistInfo({
  playlist,
  metadata,
  dropdown = false,
}: CurrentPlaylistInfoProps) {
  const isOnAir = isPlaylistOnAir(playlist);
  const currentTitle = isOnAir
    ? metadata?.playlist_title ?? playlist?.title
    : metadata?.playlist_title ?? playlist?.title ?? 'No show played yet';

  return (
    <>
      {dropdown ? (
        <div className="text-left">
          {playlist?.image && (
            <Image
              src={playlist.image ?? '/placeholder.png'}
              width={400}
              height={400}
              alt={playlist.title || ''}
            />
          )}
          <p className="mt-8 font-bold">{currentTitle}</p>
          <p className="">
            {metadata?.dj
              ? `hosted by: ${metadata.dj.toUpperCase()}`
              : 'unhosted'}
          </p>
          {playlist?.start && playlist?.end && (
            <p>
              {new Date(playlist.start).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}{' '}
              {' - '}
              {new Date(playlist.end).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          )}
          {playlist?.episode_description && (
            <p>
              {trimSpinitronDescriptionString(playlist.episode_description)}
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="flex w-full flex-col text-left">
            <p>{isOnAir ? 'NOW PLAYING:' : 'LAST PLAYED:'}</p>
            <h4 className="font-bold">
              <Link
                href={metadata?.show_id ? `/schedule/${metadata.show_id}` : `/`}
              >
                {currentTitle}
              </Link>
            </h4>
            <p className="">
              {metadata?.dj ? `Hosted By: ${metadata.dj}` : 'unhosted'}
            </p>
          </div>
          {playlist?.image && (
            <div className="group relative mt-4 h-full w-full bg-gray-500 text-white">
              <div className="min-h-[300px] min-w-[300px]">
                {metadata?.cover_art_url ? (
                  <Image
                    src={metadata?.cover_art_url ?? '/placeholder.png'}
                    alt={`${metadata?.song_name} cover image`}
                    width={400}
                    height={400}
                    className={`text-gray-500 opacity-50`}
                  />
                ) : (
                  <Image
                    src={'/default-album-cover.png'}
                    alt={`${metadata?.song_name} cover image`}
                    width={400}
                    height={400}
                    className={`text-gray-500 opacity-50`}
                  />
                )}
              </div>
              <div className="absolute bottom-4 max-w-full px-4">
                <h4 className="break-words">{metadata?.song_name}</h4>
                <p className="break-words">{metadata?.artist_name}</p>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Textfit } from 'react-textfit';
import {
  getHosts,
  isPlaylistOnAir,
  trimSpinitronDescriptionString,
} from '../utils';
import type { Playlist, Show, SpinitronMetadata } from '@wnyu/spinitron-sdk';

interface CurrentPlaylistInfoProps {
  playlist?: Playlist;
  metadata?: SpinitronMetadata;
  show?: Show | null;
  dropdown?: boolean;
}

export default function CurrentPlaylistInfo({
  playlist,
  metadata,
  show,
  dropdown = false,
}: CurrentPlaylistInfoProps) {
  const isOnAir = isPlaylistOnAir(playlist);
  const currentTitle = isOnAir
    ? (show?.title ?? metadata?.playlist_title ?? playlist?.title)
    : (show?.title ??
      metadata?.playlist_title ??
      playlist?.title ??
      'No show played yet');
  const songTitle = metadata?.song_name ?? '';
  const hostName = show?.personas?.length
    ? getHosts(show)
    : (metadata?.dj ?? 'unhosted');
  const dropdownHostLabel =
    hostName === 'unhosted' ? hostName : `hosted by: ${hostName.toUpperCase()}`;
  const hostLabel =
    hostName === 'unhosted' ? hostName : `Hosted By: ${hostName}`;

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
          <p className="">{dropdownHostLabel}</p>
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
            <p className="">{hostLabel}</p>
          </div>
          {playlist?.image && (
            <div className="group relative mt-4 aspect-square w-full bg-gray-500 text-white">
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
              <div className="absolute inset-x-0 bottom-4 box-border flex h-3/4 w-full flex-col px-4">
                <div className="min-h-0 w-full flex-1">
                  <Textfit
                    mode="multi"
                    min={8}
                    max={140}
                    throttle={50}
                    className="flex h-full w-full items-end break-words pb-4 leading-none"
                  >
                    {songTitle}
                  </Textfit>
                </div>
                <p className="w-full shrink-0 break-words text-[clamp(1rem,3vw,1.5rem)] leading-none">
                  {metadata?.artist_name}
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

'use client';

import { Playlist, SpinitronMetadata } from '@wnyu/spinitron-sdk';
import Image from 'next/image';
import Link from 'next/link';
import { useLayoutEffect, useRef, useState } from 'react';
import { useShow } from '../client-api';
import {
  getHosts,
  isPlaylistOnAir,
  trimSpinitronDescriptionString,
} from '../utils';

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
  const songTitleRef = useRef<HTMLHeadingElement>(null);
  const [songTitleFontSize, setSongTitleFontSize] = useState(96);
  const [show] = useShow(playlist?.show_id);
  const isOnAir = isPlaylistOnAir(playlist);
  const currentTitle = isOnAir
    ? (metadata?.playlist_title ?? playlist?.title)
    : (metadata?.playlist_title ?? playlist?.title ?? 'No show played yet');
  const songTitle = metadata?.song_name ?? '';
  const hostName = show?.personas?.length
    ? getHosts(show)
    : (metadata?.dj ?? 'unhosted');
  const dropdownHostLabel =
    hostName === 'unhosted' ? hostName : `hosted by: ${hostName.toUpperCase()}`;
  const hostLabel =
    hostName === 'unhosted' ? hostName : `Hosted By: ${hostName}`;

  useLayoutEffect(() => {
    const titleElement = songTitleRef.current;
    if (!titleElement) return undefined;

    const fitTitleToLongestWord = () => {
      let fontSize = 96;
      titleElement.style.fontSize = `${fontSize}px`;

      while (
        titleElement.scrollWidth > titleElement.clientWidth &&
        fontSize > 16
      ) {
        fontSize -= 1;
        titleElement.style.fontSize = `${fontSize}px`;
      }

      setSongTitleFontSize(fontSize);
    };

    fitTitleToLongestWord();
    const resizeObserver = new ResizeObserver(fitTitleToLongestWord);
    resizeObserver.observe(titleElement);

    return () => resizeObserver.disconnect();
  }, [songTitle]);

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
              <div className="absolute inset-x-0 bottom-4 w-full px-4">
                <h4
                  ref={songTitleRef}
                  className="w-full max-w-full break-normal leading-none"
                  style={{ fontSize: `${songTitleFontSize}px` }}
                >
                  {songTitle}
                </h4>
                <p className="break-words leading-none">{metadata?.artist_name}</p>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

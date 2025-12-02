import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import { urlFor } from '@/sanity/lib/image';
import { PODCAST_QUERYResult } from '../../sanity.types';
import SpotifyEmbedList from './SpotifyEmbedList';

export default function Podcast({ podcast }: { podcast: PODCAST_QUERYResult }) {
  const { name, host, picture, description, spotifyEpisodeURLs } =
    podcast || {};
  return (
    <div className="mx-auto flex max-w-[1200px] flex-col gap-6 space-y-6">
      <div className="">
        {picture?.asset?._ref && host && name ? (
          <div className="mb-4 flex flex-col gap-4">
            <Image
              className="mx-auto object-cover drop-shadow-2xl"
              src={
                urlFor(picture?.asset?._ref).width(300).height(300).url() ??
                '/public/placeholder.png'
              }
              width={300}
              height={300}
              alt={name || ''}
            />
            <div className="flex-grow">
              <div className="text-4xl font-extrabold">{name}</div>
              <div className="text-lg">with {host}</div>
            </div>
          </div>
        ) : null}

        {description ? (
          <div className="black mt-4">
            <PortableText value={description} />
          </div>
        ) : null}
      </div>
      {spotifyEpisodeURLs ? (
        <div className="">
          <SpotifyEmbedList spotifyEpisodeURLs={spotifyEpisodeURLs} />{' '}
        </div>
      ) : null}
    </div>
  );
}

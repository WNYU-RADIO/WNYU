import Link from 'next/link';
import { PODCASTS_QUERYResult } from '@/sanity.types';
import ListItem from './ListItem';
import type { Show } from '@wnyu/spinitron-sdk';

const ShowsSidePanel = ({
  shows,
  podcasts = undefined,
}: {
  shows: Show[];
  podcasts?: PODCASTS_QUERYResult;
}) => (
  <div className="flex flex-col gap-4 overflow-y-scroll p-6">
    <div className="flex h-1/2 flex-col gap-8">
      <div className="hidden border-b-2 border-black text-6xl font-bold md:block">
        RADIO SHOWS
      </div>
      <div>
        {shows.map((show) => (
          <ListItem
            url={`/schedule/${show.id}`}
            host={show.personas?.[0]?.name ?? 'unhosted'}
            title={show.title}
            start={new Date(show.start).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
            })}
            end={new Date(show.end).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
            })}
            key={show.id}
          />
        ))}
      </div>
    </div>
    {podcasts && (
      <div className="flex h-1/2 flex-col gap-8">
        <div className="mt-4 hidden border-b-2 border-black text-6xl font-bold md:block">
          PODCASTS
        </div>
        <div>
          {podcasts.map((podcast) => (
            <div
              className={`cursor-pointer transition-colors hover:text-gray-400`}
              key={podcast.id}
            >
              <Link href={`/podcasts/${podcast.slug?.current}`}>
                <div className="text-5xl">{podcast.name}</div>
                <div className="text-2xl">with {podcast.host}</div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

export default ShowsSidePanel;

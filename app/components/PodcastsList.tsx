'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import {
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import ListItem from './ListItem';
import type { PODCASTS_QUERYResult } from '@/sanity.types';

interface PodcastsSearchBarProps {
  nameFilter: string;
  setNameFilter: Dispatch<SetStateAction<string>>;
}

function PodcastsSearchBar({
  nameFilter,
  setNameFilter,
}: PodcastsSearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const onClick = () => {
    setSearchOpen((isOpen) => !isOpen);
    if (!searchOpen) inputRef.current?.focus();
  };

  return (
    <div className="flex items-center justify-center space-x-2 bg-white pb-4 pt-2 align-text-top md:items-stretch md:justify-start md:space-x-0 md:overflow-x-scroll md:p-0">
      <div className="flex py-1">
        <MagnifyingGlassIcon
          className="mr-2 size-8 transition-all ease-in-out"
          onClick={onClick}
        />
        <div className="py-1">
          <input
            className={`rounded bg-slate-300 transition-all ease-in-out ${
              searchOpen ? 'w-full' : 'w-0'
            }`}
            id="podcastSearch"
            ref={inputRef}
            type="text"
            value={nameFilter}
            onChange={(event) => setNameFilter(event.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

interface ScheduleListProps {
  podcasts: PODCASTS_QUERYResult;
}

export default function PodcastList({ podcasts }: ScheduleListProps) {
  const [nameFilter, setNameFilter] = useState<string>('');
  const filteredPodcasts = useMemo(() => {
    const normalizedNameFilter = nameFilter.toLowerCase();
    return normalizedNameFilter
      ? podcasts.filter((podcast) =>
          podcast.name?.toLowerCase().includes(normalizedNameFilter),
        )
      : podcasts;
  }, [nameFilter, podcasts]);

  return (
    <div>
      <PodcastsSearchBar
        nameFilter={nameFilter}
        setNameFilter={setNameFilter}
      />
      <div className="mt-4 flex flex-col gap-4 md:w-2/3">
        {filteredPodcasts.map((podcast) => (
          <ListItem
            url={`/podcasts/${podcast.slug?.current}`}
            host={podcast.host ?? 'unhosted'}
            title={podcast.name ?? 'untitled'}
            key={podcast.id}
          />
        ))}
      </div>
    </div>
  );
}

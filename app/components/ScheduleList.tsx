'use client';

import { useState, useEffect } from 'react';
import ListItem from './ListItem';
import ScheduleSearchBar, { daysOfWeek } from './ScheduleSearchBar';
import type { Show } from '@wnyu/spinitron-sdk';

interface ScheduleListProps {
  shows: Show[];
}

export default function ScheduleList({ shows }: ScheduleListProps) {
  const [filteredShows, setFilteredShows] = useState<Show[]>([]);
  const [dayFilter, setDayFilter] = useState<string>(
    daysOfWeek[new Date().getDay()],
  );
  const [nameFilter, setNameFilter] = useState<string>('');
  useEffect(() => {
    const filtered = shows
      .filter((show) => {
        const showDate = new Date(show.start);
        const showDay = daysOfWeek[showDate.getDay()];
        const dayMatch = dayFilter ? showDay === dayFilter : true;
        const nameMatch = nameFilter
          ? show.title.toLowerCase().includes(nameFilter.toLowerCase())
          : true;
        return nameFilter ? nameMatch : dayMatch && nameMatch;
      })
      .sort(
        (a, b) => new Date(a.start).getHours() - new Date(b.start).getHours(),
      );
    setFilteredShows(filtered);
  }, [dayFilter, nameFilter, shows]);

  const hosts = (show: Show) => {
    let hosts = show.personas?.[0].name ?? 'WNYU DJs';
    if (show.personas && show.personas.length > 1) {
      for (let i = 1; i < show.personas.length; i++) {
        hosts += ' & ' + show.personas[i].name;
      }
    }
    return hosts;
  };

  return (
    <div>
      <ScheduleSearchBar
        dayFilter={dayFilter}
        nameFilter={nameFilter}
        setDayFilter={setDayFilter}
        setNameFilter={setNameFilter}
      />
      <div className="mb-[5.5rem] flex flex-col gap-4 pt-4 md:mb-0 md:ml-12 md:h-[calc(100dvh-8.375rem)] md:overflow-y-scroll md:pb-6 md:pt-0">
        {filteredShows.map((show) => (
          <ListItem
            url={`/schedule/${show.id}`}
            host={hosts(show)}
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
  );
}

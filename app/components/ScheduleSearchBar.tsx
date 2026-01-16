'use client';

import { useState, type Dispatch, type SetStateAction, useRef } from 'react';
import {
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/solid';

interface ScheduleSearchBarProps {
  nameFilter: string;
  dayFilter: string;
  setNameFilter: Dispatch<SetStateAction<string>>;
  setDayFilter: Dispatch<SetStateAction<string>>;
}

export const daysOfWeek = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

export default function ScheduleSearchBar({
  nameFilter,
  dayFilter,
  setNameFilter,
  setDayFilter,
}: ScheduleSearchBarProps) {
  const [dayOfWeek, setDayOfWeek] = useState(new Date().getDay());
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const handlePreviousDay = () => {
    const newDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    setDayOfWeek(newDay);
    setDayFilter(daysOfWeek[newDay]);
    setNameFilter('');
  };

  const handleNextDay = () => {
    const newDay = (dayOfWeek + 1) % 7;
    setDayOfWeek(newDay);
    setDayFilter(daysOfWeek[newDay]);
    setNameFilter('');
  };

  const onClick = () => {
    setSearchOpen(!searchOpen);
    if (inputRef.current && !searchOpen) {
      inputRef.current.focus();
    }
  };

  return (
    <>
      <div className="flex items-center justify-center space-x-2 bg-white py-4 md:hidden">
        <ChevronLeftIcon className="h-8 w-8" onClick={handlePreviousDay} />
        <h4 className="w-2/3 text-center">
          {nameFilter ? 'search' : daysOfWeek[dayOfWeek]}
        </h4>
        <ChevronRightIcon className="h-8 w-8" onClick={handleNextDay} />
      </div>

      <div className="relative hidden from-0% to-100% pb-2 md:flex">
        <div className="flex pt-1">
          <MagnifyingGlassIcon className="mr-2 h-8 w-8" onClick={onClick} />
          <div className="relative py-1">
            <input
              id="scheduleSearch"
              ref={inputRef}
              type="text"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              placeholder="Search"
              className={`z-20 rounded bg-slate-300 transition-all ease-in-out ${
                searchOpen ? 'w-full' : 'w-0'
              }`}
            />
          </div>
        </div>
        <div className="z-10 flex flex-wrap">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className={`cursor-pointer px-3 py-1 ${
                dayFilter === day ? 'text-black' : 'text-gray-400'
              }`}
              onClick={() => {
                setDayFilter(day);
                setNameFilter('');
              }}
            >
              {day}
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full border-t-2 border-black bg-white p-2 md:hidden">
        <div className="flex items-center">
          <MagnifyingGlassIcon className="mr-2 h-6 w-6" />
          <input
            type="text"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            placeholder="Search"
            className="z-5 w-full rounded border-2 border-black p-2"
          />
        </div>
      </div>
    </>
  );
}

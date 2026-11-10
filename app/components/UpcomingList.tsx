'use client';

import { Show } from '@wnyu/spinitron-sdk';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUpcoming } from '@/app/client-api';

const REFRESH_UPCOMING_INTERVAL = 5 * 60 * 1000;

export default function UpcomingList() {
  const [upcomingResponse, refreshUpcomingResponse] = useUpcoming();
  const [upcoming, setUpcoming] = useState<Show[]>();

  useEffect(() => {
    if (upcomingResponse) {
      setUpcoming(upcomingResponse);
    }
  }, [upcomingResponse]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshUpcomingResponse();
    }, REFRESH_UPCOMING_INTERVAL);

    return () => {
      clearInterval(intervalId);
    };
  }, [refreshUpcomingResponse]);

  return (
    <div className="mt-4 w-full text-left">
      <p>UP NEXT:</p>
      {upcoming && upcoming[1] ? (
        <h5 className="font-bold">
          <Link href={upcoming[1]?.id ? `/schedule/${upcoming[1]?.id}` : '/'}>
            {upcoming[1].title}
          </Link>
        </h5>
      ) : (
        <h4 className="font-bold">WNYU JUKEBOX</h4>
      )}
    </div>
  );
}

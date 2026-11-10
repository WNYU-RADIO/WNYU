'use client';

import { useContext } from 'react';
import { CurrentDataContext } from '../providers/CurrentDataProvider';
import CurrentPlaylistInfo from './CurrentPlaylistInfo';
import CurrentPlaylistSpinsList from './CurrentPlaylistSpinsList';
import UpcomingList from './UpcomingList';

interface CurrentPlaylistPanelProps {
  dropdown?: boolean;
}

export default function CurrentPlaylistPanel({
  dropdown = false,
}: CurrentPlaylistPanelProps) {
  const current = useContext(CurrentDataContext);
  return (
    <div
      className={`mx-auto w-full content-center justify-center ${dropdown ? 'text-white' : ''}`}
    >
      <div className="mx-4 my-4 flex flex-col items-center justify-center">
        <CurrentPlaylistInfo
          playlist={current?.playlist}
          metadata={current?.metadata}
          show={current?.show}
          dropdown={dropdown}
        />
        {dropdown ? (
          <CurrentPlaylistSpinsList
            spins={current?.spins}
            dropdown={dropdown}
          />
        ) : (
          <UpcomingList />
        )}
      </div>
    </div>
  );
}

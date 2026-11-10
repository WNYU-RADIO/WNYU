'use client';

import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid';
import { useContext, useRef, useState } from 'react';
import { DropdownToggleContext } from '../providers/ToggleProvider';

export default function Stream() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const context = useContext(DropdownToggleContext);

  const handleClick = () => {
    const audio = audioRef.current;
    if (audio) {
      if (audio.paused) audio.play().catch(() => setIsPlaying(false));
      else audio.pause();
    }

    if (context?.toggle === false) {
      context.setToggle(true);
    }
  };

  return (
    <div>
      {isPlaying ? (
        <PauseIcon
          className="size-10 cursor-pointer md:size-7"
          onClick={handleClick}
        />
      ) : (
        <PlayIcon
          className="size-10 cursor-pointer md:size-7"
          onClick={handleClick}
        />
      )}
      <audio
        ref={audioRef}
        src={process.env.NEXT_PUBLIC_STREAM_URL as string}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </div>
  );
}

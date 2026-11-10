'use client';

import {
  BackwardIcon,
  ForwardIcon,
  PauseIcon,
  PlayIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from '@heroicons/react/24/solid';
import { useEffect, useRef, useState } from 'react';

interface ArchivePlayerProps {
  durationSeconds: number;
  showStartTimeUTC: string;
}

const ARCHIVE_END_BUFFER_SECONDS = 20 * 60;
const ARCHIVE_AVAILABILITY_DAYS = 14;
const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
const ARCHIVE_LOAD_ERROR =
  'This archive could not be loaded. Please try again later.';

const formatTime = (seconds: number) => {
  const safeSeconds = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
  const totalSeconds = Math.floor(safeSeconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;
  const minuteString =
    hours > 0 ? minutes.toString().padStart(2, '0') : minutes;

  return hours > 0
    ? `${hours}:${minuteString}:${remainingSeconds.toString().padStart(2, '0')}`
    : `${minuteString}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export default function ArchivePlayer({
  durationSeconds,
  showStartTimeUTC,
}: ArchivePlayerProps) {
  const listedDurationSeconds = Number.isFinite(durationSeconds)
    ? Math.max(0, durationSeconds)
    : 0;
  const playbackDurationSeconds =
    listedDurationSeconds + ARCHIVE_END_BUFFER_SECONDS;
  const showTime = new Date(showStartTimeUTC).getTime();
  const isExpired =
    Number.isFinite(showTime) &&
    (Date.now() - showTime) / MILLISECONDS_PER_DAY > ARCHIVE_AVAILABILITY_DAYS;
  const audioRef = useRef<HTMLAudioElement>(null);
  const lastAudibleVolumeRef = useRef(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    setCurrentTime(0);
    setErrorMessage(null);
    setIsPlaying(false);

    if (!Number.isFinite(showTime)) {
      setErrorMessage(ARCHIVE_LOAD_ERROR);
      return undefined;
    }

    if (isExpired) return undefined;

    const audio = audioRef.current;
    if (!audio) return undefined;

    let isDisposed = false;
    let destroyHls: (() => void) | undefined;

    const updateCurrentTime = () => {
      if (audio.currentTime >= playbackDurationSeconds) {
        audio.currentTime = playbackDurationSeconds;
        audio.pause();
      }
      setCurrentTime(Math.min(audio.currentTime, playbackDurationSeconds));
    };
    const updatePlayingState = () => {
      setIsPlaying(!audio.paused);
    };
    const updateVolume = () => {
      setVolume(audio.volume);
      if (audio.volume > 0) lastAudibleVolumeRef.current = audio.volume;
    };
    const handleAudioError = () => setErrorMessage(ARCHIVE_LOAD_ERROR);

    audio.addEventListener('timeupdate', updateCurrentTime);
    audio.addEventListener('play', updatePlayingState);
    audio.addEventListener('pause', updatePlayingState);
    audio.addEventListener('ended', updatePlayingState);
    audio.addEventListener('volumechange', updateVolume);
    audio.addEventListener('error', handleAudioError);

    const showDate = new Date(showTime);
    const formattedDate = `${
      showDate.toISOString().replace(/[-:]/g, '').split('.')[0]
    }Z`;
    const streamUrl = `https://ark3.spinitron.com/ark2/WNYU-${formattedDate}/index.m3u8`;

    if (audio.canPlayType('application/vnd.apple.mpegurl')) {
      audio.src = streamUrl;
    } else {
      const attachHls = async () => {
        const { default: Hls } = await import('hls.js');
        if (isDisposed || !Hls.isSupported()) return;

        const hls = new Hls();
        destroyHls = () => hls.destroy();
        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (data.fatal) {
            setErrorMessage(ARCHIVE_LOAD_ERROR);
            audio.pause();
          }
        });
        hls.loadSource(streamUrl);
        hls.attachMedia(audio);
      };

      attachHls().catch(() => {
        if (!isDisposed) setErrorMessage(ARCHIVE_LOAD_ERROR);
      });
    }

    return () => {
      isDisposed = true;
      destroyHls?.();
      audio.removeEventListener('timeupdate', updateCurrentTime);
      audio.removeEventListener('play', updatePlayingState);
      audio.removeEventListener('pause', updatePlayingState);
      audio.removeEventListener('ended', updatePlayingState);
      audio.removeEventListener('volumechange', updateVolume);
      audio.removeEventListener('error', handleAudioError);
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
    };
  }, [isExpired, playbackDurationSeconds, showTime]);

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (audio) {
      if (audio.paused) audio.play().catch(() => undefined);
      else audio.pause();
    }
  };

  const seekTo = (seconds: number) => {
    const audio = audioRef.current;
    if (audio) {
      const nextTime = Math.min(Math.max(seconds, 0), playbackDurationSeconds);
      audio.currentTime = nextTime;
      setCurrentTime(nextTime);
    }
  };

  const seekBy = (seconds: number) => {
    const audio = audioRef.current;
    if (audio) seekTo(audio.currentTime + seconds);
  };

  const changeVolume = (nextVolume: number) => {
    const audio = audioRef.current;
    const clampedVolume = Math.min(Math.max(nextVolume, 0), 1);
    setVolume(clampedVolume);
    if (audio) audio.volume = clampedVolume;
  };

  const toggleMute = () => {
    changeVolume(volume > 0 ? 0 : lastAudibleVolumeRef.current);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!(event.target instanceof HTMLInputElement)) {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        seekBy(-1);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        seekBy(1);
      }
    }
  };

  if (isExpired) {
    return (
      <div className="mt-6 border border-black p-4 text-center">
        Broadcast Archive Expired — Audio recordings are only available for 14
        days.
      </div>
    );
  }

  return (
    <div
      className="border border-black p-3"
      onKeyDown={handleKeyDown}
      role="group"
      tabIndex={0}
      aria-label="Broadcast archive player. Use left and right arrow keys to seek by one second."
    >
      <audio ref={audioRef} preload="metadata" className="sr-only">
        <track kind="captions" />
      </audio>
      <div className="flex items-center gap-2 md:gap-3">
        <button
          type="button"
          onClick={togglePlayback}
          className="flex size-9 shrink-0 items-center justify-center bg-black text-white transition-colors hover:bg-red-600"
          aria-label={isPlaying ? 'Pause archive' : 'Play archive'}
        >
          {isPlaying ? (
            <PauseIcon className="size-4" />
          ) : (
            <PlayIcon className="ml-0.5 size-4" />
          )}
        </button>
        <button
          type="button"
          onClick={() => seekBy(-15)}
          className="flex shrink-0 items-center gap-1 px-1 py-2 font-mono text-[11px] font-bold hover:text-red-600"
          aria-label="Rewind 15 seconds"
        >
          <BackwardIcon className="size-4" />
          15
        </button>
        <input
          type="range"
          min="0"
          max={playbackDurationSeconds}
          step="1"
          value={Math.min(currentTime, playbackDurationSeconds)}
          onChange={(event) => seekTo(Number(event.target.value))}
          className="min-w-0 flex-1 accent-black"
          aria-label="Archive position"
        />
        <span className="hidden shrink-0 font-mono text-[11px] tabular-nums sm:block">
          {formatTime(currentTime)} / {formatTime(playbackDurationSeconds)}
        </span>
        <button
          type="button"
          onClick={() => seekBy(15)}
          className="flex shrink-0 items-center gap-1 px-1 py-2 font-mono text-[11px] font-bold hover:text-red-600"
          aria-label="Forward 15 seconds"
        >
          15
          <ForwardIcon className="size-4" />
        </button>
        <div className="group relative shrink-0">
          <button
            type="button"
            onClick={toggleMute}
            className="flex size-8 items-center justify-center hover:text-red-600"
            aria-label={volume > 0 ? 'Mute archive' : 'Unmute archive'}
          >
            {volume > 0 ? (
              <SpeakerWaveIcon className="size-5" />
            ) : (
              <SpeakerXMarkIcon className="size-5" />
            )}
          </button>
          <div className="pointer-events-none absolute bottom-full right-0 z-20 w-36 pb-2 opacity-0 transition-opacity group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100">
            <label className="flex items-center gap-2 border border-black bg-white p-3 shadow-[3px_3px_0px_#000]">
              <span className="sr-only">Volume</span>
              <SpeakerWaveIcon className="size-4 shrink-0" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(event) => changeVolume(Number(event.target.value))}
                className="min-w-0 flex-1 accent-black"
              />
            </label>
          </div>
        </div>
      </div>
      <div className="mt-1 flex items-center justify-between font-mono text-[9px] uppercase tracking-wide text-neutral-500 sm:hidden">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(playbackDurationSeconds)}</span>
      </div>
      {errorMessage && (
        <p className="mt-2 text-xs text-red-700" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

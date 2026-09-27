"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

interface ArchivePlayerProps {
  durationSeconds: number;
  showStartTimeUTC: string;
}

const ARCHIVE_END_BUFFER_SECONDS = 20 * 60;

export default function ArchivePlayer({
  durationSeconds,
  showStartTimeUTC,
}: ArchivePlayerProps) {
  const playbackDurationSeconds = durationSeconds + ARCHIVE_END_BUFFER_SECONDS;
  const audioRef = useRef<HTMLAudioElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (!showStartTimeUTC) return;

    const showDate = new Date(showStartTimeUTC);
    const currentDate = new Date();
    
    // Calculate the difference in days
    const timeDifference = currentDate.getTime() - showDate.getTime();
    const daysOld = timeDifference / (1000 * 3600 * 24);

    const audio = audioRef.current;
    const previousHls = hlsRef.current;
    hlsRef.current = null;
    previousHls?.destroy();
    audio?.pause();
    if (audio) {
      audio.removeAttribute("src");
      audio.load();
    }
    setErrorMessage(null);
    setCurrentTime(0);
    setIsPlaying(false);

    // If the show is more than 14 days old, display the expired notice
    if (daysOld > 14) {
      setIsExpired(true);
      return;
    }

    if (!audio) return;

    const stopAtEpisodeEnd = () => {
      if (audio.currentTime >= playbackDurationSeconds) {
        audio.currentTime = playbackDurationSeconds;
        audio.pause();
      }
    };
    const clampSeekToEpisode = () => {
      if (audio.currentTime > playbackDurationSeconds) {
        audio.currentTime = playbackDurationSeconds;
      }
    };
    const updateTime = () =>
      setCurrentTime(Math.min(audio.currentTime, playbackDurationSeconds));
    const updatePlayingState = () => setIsPlaying(!audio.paused);
    audio.addEventListener("timeupdate", stopAtEpisodeEnd);
    audio.addEventListener("seeking", clampSeekToEpisode);
    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("play", updatePlayingState);
    audio.addEventListener("pause", updatePlayingState);

    const streamUrl = `https://ark3.spinitron.com/ark2/WNYU-${showDate
      .toISOString()
      .replace(/[-:]/g, "")
      .split(".")[0]}Z/index.m3u8`;
    const hls = new Hls();
    hlsRef.current = hls;
    hls.loadSource(streamUrl);
    hls.attachMedia(audio);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      audio.play().catch(() => undefined);
    });
    hls.on(Hls.Events.ERROR, (_event, data) => {
      if (data.fatal) setErrorMessage(`${data.type}: ${data.details}`);
    });

    return () => {
      audio.removeEventListener("timeupdate", stopAtEpisodeEnd);
      audio.removeEventListener("seeking", clampSeekToEpisode);
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("play", updatePlayingState);
      audio.removeEventListener("pause", updatePlayingState);
      if (hlsRef.current === hls) {
        hlsRef.current = null;
        hls.destroy();
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
      }
    };

  }, [playbackDurationSeconds, showStartTimeUTC]);

  if (isExpired) {
    return (
      <div className="mt-6 border border-black p-4 text-center">
        <p className="text-md font-bold uppercase tracking-wider text-black">
          Broadcast Archive Expired
        </p>
        <p className="mt-1 text-sm text-gray-600">
          Audio recordings are only available for 14 days after airing.
        </p>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const wholeSeconds = Math.max(0, Math.floor(seconds));
    const minutes = Math.floor(wholeSeconds / 60);
    const remainingSeconds = wholeSeconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play().catch(() => undefined);
    } else {
      audioRef.current.pause();
    }
  };

  const seekTo = (value: string) => {
    if (audioRef.current) audioRef.current.currentTime = Number(value);
    setCurrentTime(Number(value));
  };

  return (
    <div className="mt-6 flex w-full flex-col gap-3 border border-black p-5">
      <h3 className="text-lg font-bold uppercase tracking-wider text-black">
        Listen to the Archive
      </h3>
      <audio ref={audioRef} preload="auto" className="sr-only" />
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={togglePlayback}
          className="border border-black px-4 py-2 text-sm font-bold uppercase"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <div className="flex w-full items-center gap-2 border border-black px-4 py-2">
        <span className="text-sm tabular-nums ">{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max={playbackDurationSeconds}
          step="1"
          value={Math.min(currentTime, playbackDurationSeconds)}
          onChange={(event) => seekTo(event.target.value)}
          className="min-w-0 flex-1"
          aria-label="Archive position"
        />
        <span className="text-sm tabular-nums">
          {formatTime(playbackDurationSeconds)}
        </span>
        </div>
      </div>
      {errorMessage && (
        <p className="text-sm text-gray-600">Archive error: {errorMessage}</p>
      )}
    </div>
  );
}
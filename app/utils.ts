import type { Playlist, Show, ShowsResponse } from '@wnyu/spinitron-sdk';

function getHosts(show: Pick<Show, 'personas'>) {
  return show.personas?.map(({ name }) => name).join(' & ') || 'WNYU DJs';
}

function trimSpinitronDescriptionString(s: string) {
  return s.slice(3, -4);
}

function filterShowByCategory(shows: ShowsResponse, category: string) {
  return shows.items.filter((show) => show.category === category);
}

function isPlaylistOnAir(playlist?: Playlist) {
  if (!playlist?.start || !playlist.end) return false;

  const now = Date.now();
  const start = new Date(playlist.start).getTime();
  const end = new Date(playlist.end).getTime();

  return (
    Number.isFinite(start) && Number.isFinite(end) && now >= start && now < end
  );
}

export {
  trimSpinitronDescriptionString,
  filterShowByCategory,
  isPlaylistOnAir,
  getHosts,
};

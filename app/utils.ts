import type { Playlist, Show, ShowsResponse } from '@wnyu/spinitron-sdk';

function getHosts(show: Pick<Show, 'personas'>) {
  let hosts = show.personas?.[0].name ?? 'WNYU DJs';
  if (show.personas && show.personas.length > 1) {
    for (let i = 1; i < show.personas.length; i += 1) {
      hosts += ` & ${show.personas[i].name}`;
    }
  }
  return hosts;
}

function trimSpinitronDescriptionString(s: string) {
  try {
    const val = s.slice(3, -4);
    return val;
  } catch (err) {
    return '';
  }
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

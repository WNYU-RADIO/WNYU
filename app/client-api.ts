import { Show, ShowsResponse, SpinitronMetadata } from '@wnyu/spinitron-sdk';
import { useCallback, useEffect, useState } from 'react';
import { CurrentData } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const throwIfResponseIsNotOk = (res: Response): Response => {
  if (!res.ok) {
    throw new Error(`Response status: ${res.status} ${res.statusText}`);
  }
  return res;
};

// Custom React hook to make authenticated requests to the configured API
const useWNYUApi = <T>(
  path: string,
  params: URLSearchParams = new URLSearchParams(),
): [T | null, () => void] => {
  const [response, setResponse] = useState(null);

  const fetchData = useCallback(() => {
    if (!path) return;

    setResponse(null);
    const url = new URL(path, API_URL);
    url.search = params.toString();
    fetch(url)
      .then(throwIfResponseIsNotOk)
      .then((res) => res.json())
      .then(setResponse)
      /* eslint-disable-next-line no-console --
       *
       * This error should be handled more gracefully but currently error
       * handling is not implemented across the repository
       */
      .catch((e) => console.error(e));
    /* eslint-disable-next-line react-hooks/exhaustive-deps --
     *
     * fetch should not be a dependency, because although it or its internal
     * state may change from render to render, such changes are not relevant:
     * a change in the way we make a request should not trigger an API request
     *
     * params is a dependency, but as an object - and often a newly-created
     * object - depending on it directly causes spurious renders; instead, use
     * its string value, which should be stable
     */
  }, [path, params.toString()]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return [response, fetchData];
};

const useMetadata = () => useWNYUApi<SpinitronMetadata>('/metadata');

const useUpcoming = () => useWNYUApi<Show[]>('/shows/schedule/upcoming');

const useShow = (showId?: number): [Show | null, () => void] => {
  const [shows, refreshShows] = useWNYUApi<ShowsResponse>(
    showId ? '/shows' : '',
    new URLSearchParams({
      expand: 'personas',
      id: showId ? String(showId) : '',
    }),
  );

  return [
    shows?.items.find((show) => show.id === showId) ?? null,
    refreshShows,
  ];
};

const useCurrent = () => useWNYUApi<CurrentData>('/current');

export { useMetadata, useUpcoming, useShow, useCurrent };

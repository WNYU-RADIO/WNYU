import { Show, ShowsResponse } from '@wnyu/spinitron-sdk';
import { useCallback, useEffect, useRef, useState } from 'react';
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
  const [response, setResponse] = useState<T | null>(null);
  const abortControllerRef = useRef<AbortController | undefined>(undefined);
  const queryString = params.toString();

  const fetchData = useCallback(() => {
    abortControllerRef.current?.abort();

    if (!path) {
      setResponse(null);
      return;
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    setResponse(null);
    const url = new URL(path, API_URL);
    url.search = queryString;
    fetch(url, { signal: abortController.signal })
      .then(throwIfResponseIsNotOk)
      .then((res) => res.json() as Promise<T>)
      .then(setResponse)
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === 'AbortError') return;
        // eslint-disable-next-line no-console -- API failures are not yet surfaced in the UI.
        console.error(error);
      });
  }, [path, queryString]);

  useEffect(() => {
    fetchData();

    return () => abortControllerRef.current?.abort();
  }, [fetchData]);

  return [response, fetchData];
};

const useUpcoming = () => useWNYUApi<Show[]>('/shows/schedule/upcoming');

const useShow = (showId?: number | string): [Show | null, () => void] => {
  const [shows, refreshShows] = useWNYUApi<ShowsResponse>(
    showId ? '/shows' : '',
    new URLSearchParams({
      expand: 'personas',
      id: showId ? String(showId) : '',
    }),
  );

  return [
    shows?.items.find((show) => String(show.id) === String(showId)) ?? null,
    refreshShows,
  ];
};

const useCurrent = () => useWNYUApi<CurrentData>('/current');

export { useUpcoming, useShow, useCurrent };

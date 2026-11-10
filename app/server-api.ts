import type { ShowsResponse } from '@wnyu/spinitron-sdk';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_BASE_URL = API_URL?.endsWith('/') ? API_URL : `${API_URL}/`;
const API_REVALIDATE_SECONDS = 60 * 60;

async function fetchWnyu<T>(
  path: string,
  params = new URLSearchParams(),
): Promise<T> {
  const url = new URL(path, API_BASE_URL);
  url.search = params.toString();
  const res = await fetch(url, {
    cache: 'default',
    next: { revalidate: API_REVALIDATE_SECONDS },
  });

  if (!res.ok) {
    throw new Error(`WNYU API request failed: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

function getShows() {
  return fetchWnyu<ShowsResponse>(
    'shows',
    new URLSearchParams({ expand: 'personas' }),
  );
}

export { fetchWnyu, getShows };

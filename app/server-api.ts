import type { ShowsResponse } from '@wnyu/spinitron-sdk';

async function getShows(): Promise<ShowsResponse> {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/shows`);
  const params = new URLSearchParams({
    expand: 'personas',
  });
  url.search = params.toString();
  const res = await fetch(url.toString());

  if (!res.ok) {
    throw new Error('Failed to fetch schedule');
  }
  const output = res.json() as Promise<ShowsResponse>;

  return output;
}

export { getShows };

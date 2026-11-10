import { createClient, type QueryParams } from 'next-sanity';
import { apiVersion, dataset, projectId } from '../env';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
});

export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  revalidate = 60,
  tags = [],
}: {
  query: string;
  params?: QueryParams;
  revalidate?: number | false;
  tags?: string[];
}) {
  const shouldSkipCache =
    process.env.NODE_ENV === 'development' || revalidate === 0;

  return client.fetch<QueryResponse>(
    query,
    params,
    shouldSkipCache
      ? { cache: 'no-store' }
      : { cache: 'force-cache', next: { revalidate, tags } },
  );
}

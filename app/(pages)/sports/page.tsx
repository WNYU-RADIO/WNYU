import { sanityFetch } from '@/sanity/lib/client';
import {
  ARTICLE_TYPES,
  ARTICLES_BY_TYPE_QUERY,
  PODCAST_DEPARTMENTS,
  PODCASTS_BY_DEPARTMENT_QUERY,
} from '@/sanity/lib/queries';
import { ARTICLES_QUERYResult, PODCASTS_QUERYResult } from '@/sanity.types';
import { getShows } from '@/app/server-api';
import { filterShowByCategory } from '@/app/utils';
import ArticlesGroup from '@/app/components/ArticlesGroup';
import ShowsSidePanel from '@/app/components/ShowsSidePanel';

export default async function Page() {
  const sportsArticles = await sanityFetch<ARTICLES_QUERYResult>({
    query: ARTICLES_BY_TYPE_QUERY(ARTICLE_TYPES.SPORTS),
    tags: ['article'],
  });

  const sportsPodcasts = await sanityFetch<PODCASTS_QUERYResult>({
    query: PODCASTS_BY_DEPARTMENT_QUERY(PODCAST_DEPARTMENTS.SPORTS),
    tags: ['podcasts'],
  });

  const shows = await getShows();

  const sportsShows = filterShowByCategory(shows, 'Sports');

  return (
    <div className="static h-[calc(100dvh-4rem)] overflow-y-scroll">
      {/* desktop */}
      <div className="hidden md:flex md:flex-row">
        <div className="overflow-y-scroll md:w-3/5">
          <ArticlesGroup articles={sportsArticles} />
        </div>

        <div className="w-full overflow-y-scroll border-l-2 border-black md:w-2/5">
          <ShowsSidePanel shows={sportsShows} podcasts={sportsPodcasts} />
        </div>
      </div>
      {/* mobile */}
      <div className="mx-4 flex flex-col gap-8 md:hidden">
        <div className="w-full pr-4 pt-20">
          <ArticlesGroup articles={sportsArticles} />
        </div>
        <div className="w-full pl-4 pt-4">
          <ShowsSidePanel shows={sportsShows} podcasts={sportsPodcasts} />
        </div>
      </div>
    </div>
  );
}

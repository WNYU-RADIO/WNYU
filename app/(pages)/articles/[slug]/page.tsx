import { sanityFetch } from '@/sanity/lib/client';
import { ARTICLE_BY_SLUG_QUERY } from '@/sanity/lib/queries';
import { Article } from '@/app/components/Article';
import type { ARTICLES_QUERYResult } from '@/sanity.types';

type ArticleParams = Promise<{ slug: string }>;

export default async function ArticlePage({
  params,
}: {
  params: ArticleParams;
}) {
  const { slug } = await params;

  const article = await sanityFetch<ARTICLES_QUERYResult[number] | null>({
    query: ARTICLE_BY_SLUG_QUERY,
    params: { slug },
    tags: ['article'],
  });

  return (
    <div className="m-4">
      <Article article={article} />
    </div>
  );
}

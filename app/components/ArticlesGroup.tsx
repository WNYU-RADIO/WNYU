import Link from 'next/link';
import { ARTICLES_QUERYResult } from '@/sanity.types';
import { ArticleCard } from './ArticleCard';

const ArticlesGroup = ({ articles }: { articles: ARTICLES_QUERYResult }) => {
  const headerDesktopArticle = articles.at(0) ?? null;
  const otherDesktopArticles = articles.slice(1);
  return (
    <>
      {/* desktop */}
      <div className="mx-auto hidden flex-col p-6 md:flex">
        {headerDesktopArticle && <ArticleCard article={headerDesktopArticle} />}
        <div className="grid grid-cols-2 pt-4">
          {otherDesktopArticles.map((article, index) => (
            <Link key={index} href={`/articles/${article.slug?.current}`}>
              <div className="article-item pt-4">
                <h2 className="text-2xl font-bold">{article.name}</h2>
                <p className="text-xl text-gray-500">by {article.author}</p>
                <p className="text-l text-gray-500">{article.date}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      {/* mobile */}
      <div className="flex flex-col gap-20 md:hidden">
        {articles.map((article, index) => (
          <ArticleCard article={article} key={index} />
        ))}
      </div>
    </>
  );
};

export default ArticlesGroup;

import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import { urlFor } from '@/sanity/lib/image';
import type { ARTICLES_QUERYResult } from '../../sanity.types';

type ArticleResult = ARTICLES_QUERYResult[number] | null;

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function Article({ article }: { article: ArticleResult }) {
  const { name, date, author, picture, content } = article || {};

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4">
      <div className="space-y-2">
        {name ? (
          <h1 className="text-5xl font-bold leading-tight md:text-4xl">
            {name}
          </h1>
        ) : null}
        {author ? <p className="text-lg text-gray-700">by {author}</p> : null}
        {date ? (
          <p className="text-sm text-gray-500">{formatDate(date)}</p>
        ) : null}
      </div>

      {picture?.asset?._ref ? (
        <div className="w-full">
          <Image
            className="h-auto w-full object-cover"
            src={
              urlFor(picture?.asset?._ref).width(800).height(400).url() ??
              '/placeholder.png'
            }
            width={800}
            height={400}
            alt={name || ''}
          />
        </div>
      ) : null}

      {content ? (
        <div className="prose max-w-none text-xl">
          <PortableText value={content} />
        </div>
      ) : null}
    </div>
  );
}

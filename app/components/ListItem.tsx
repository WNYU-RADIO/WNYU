import Link from 'next/link';

interface ListItemProps {
  title: string;
  host: string;
  start?: string;
  end?: string;
  url?: string;
}
export default function ListItem({
  title,
  url,
  host,
  start,
  end,
}: ListItemProps) {
  return (
    <div className="cursor-pointer transition-colors hover:text-gray-400">
      <Link href={url || '/'}>
        <h4>{title}</h4>
        <p>hosted by {host}</p>
        {start && end && (
          <p>
            {start} {' - '}
            {end}
          </p>
        )}
      </Link>
    </div>
  );
}

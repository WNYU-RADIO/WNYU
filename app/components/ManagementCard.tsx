import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import { MANAGEMENT_CARD_QUERYResult } from '../../sanity.types';

export function ManagementCard({
  card,
}: {
  card: MANAGEMENT_CARD_QUERYResult;
}) {
  const { name, role, email, picture } = card || {};

  return (
    <div className="min-w-[150px] max-w-[45%] break-words py-1 md:max-w-[30%]">
      {picture?.asset?._ref ? (
        <Image
          className="aspect-square border-2 border-black"
          src={urlFor(picture?.asset?._ref).width(400).height(400).url()}
          width={400}
          height={400}
          alt={name || ''}
        />
      ) : (
        <Image
          className="aspect-square border-2 border-black"
          src={'/dj-placeholder.png'}
          width={400}
          height={400}
          alt={name || ''}
        />
      )}
      {name ? <p className="text-xl">{name}</p> : null}
      {role ? <p className="text-base">{role}</p> : null}
      <a href={`mailto: ${email}`} target="_blank">
        {email ? <p className="text-sm">{email}</p> : null}
      </a>
    </div>
  );
}

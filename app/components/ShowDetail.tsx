import Image from 'next/image';
import { trimSpinitronDescriptionString } from '../utils';
import type { Show } from '@wnyu/spinitron-sdk';

interface ShowDetailProps {
  show: Show;
}

export default function ShowDetail({ show }: ShowDetailProps) {
  let hosts = show.personas?.[0].name ?? 'WNYU DJs';
  if (show.personas && show.personas.length > 1) {
    for (let i = 1; i < show.personas.length; i++) {
      hosts += ' & ' + show.personas[i].name;
    }
  }

  return (
    <div className="pb-6">
      <div>
        <Image
          src={show.image ?? '/placeholder.png'}
          width={500}
          height={200}
          alt="show image"
          className="h-[300px] w-full border-2 border-black object-cover md:mt-1"
        />
        <h4 className="pt-4">{show.title}</h4>
        <p>hosted by: {hosts}</p>
        <div>
          {new Date(show.start).toLocaleTimeString('en-US', {
            weekday: 'long',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
          })}{' '}
          {' - '}
          {new Date(show.end).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
          })}
        </div>
      </div>
      <p className="mt-4">{trimSpinitronDescriptionString(show.description)}</p>
    </div>
  );
}

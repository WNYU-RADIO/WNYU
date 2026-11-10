'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/sanity/lib/image';
import type { ANNOUNCEMENTS_QUERYResult } from '../../sanity.types';
import 'swiper/css';
import 'swiper/css/navigation';

export default function AnnouncementsCarousel({
  announcements,
}: {
  announcements: ANNOUNCEMENTS_QUERYResult;
}) {
  return (
    <>
      <Swiper
        spaceBetween={1}
        slidesPerView={1}
        navigation
        modules={[Navigation]}
        className="h-full w-full border-2 border-black"
      >
        {announcements.map((announcement) => {
          const imageRef = announcement.announcementImage?.asset?._ref;
          const caption = (
            <div className="absolute bottom-0 w-full bg-black text-white md:h-1/5">
              <div className="mx-2 my-2 md:mx-4 md:my-4">
                <h4 className="break-words">{announcement.title}</h4>
                <p className="ml-1">{announcement.subtitle}</p>
              </div>
            </div>
          );

          return (
            <SwiperSlide key={announcement.id} className="relative">
              <Image
                src={
                  imageRef
                    ? urlFor(imageRef).width(500).height(300).url()
                    : '/placeholder.png'
                }
                fill
                className="object-cover"
                alt={announcement.title || ''}
              />
              {announcement.link ? (
                <Link href={announcement.link}>{caption}</Link>
              ) : (
                caption
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>
      <style jsx global>
        {`
          .swiper-button-next,
          .swiper-button-prev {
            color: white;
          }
        `}
      </style>
    </>
  );
}

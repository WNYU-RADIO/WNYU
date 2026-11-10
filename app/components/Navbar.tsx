'use client';

import Marquee from 'react-fast-marquee';
import { useContext } from 'react';
import { DropdownToggleContext } from '../providers/ToggleProvider';
import { CurrentDataContext } from '../providers/CurrentDataProvider';
import { getHosts, isPlaylistOnAir } from '../utils';
import DropDownPanel from './DropDownPanel';
import NavMenu from './NavMenu';
import Stream from './Stream';
import LogoBlock from './LogoBlock';

export default function Navbar({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const context = useContext(DropdownToggleContext);
  const current = useContext(CurrentDataContext);
  const { metadata } = current;
  const { show } = current;
  const isOnAir = isPlaylistOnAir(current.playlist);

  const handleClick = () => {
    context?.setToggle(!context?.toggle);
  };

  return (
    <>
      <div
        className={`fixed left-0 right-0 top-0 z-50 w-full justify-between border-b-2 border-black ${
          context?.toggle ? 'bg-black' : 'bg-white'
        } p-4 transition-all delay-150 md:h-16 md:bg-white`}
      >
        <div
          className={`flex justify-between transition-colors ease-in-out ${
            context?.toggle ? 'text-white' : ''
          } md:bg-white md:text-black`}
        >
          <LogoBlock />
          <Stream />
          <div
            onClick={handleClick}
            className="flex cursor-default items-center overflow-hidden"
          >
            {/* Marquee */}
            <div className="flex-grow">
              <Marquee
                autoFill={true}
                gradient={!context?.toggle}
                gradientWidth={100}
              >
                <div className="mr-2 flex-shrink-0 px-2">
                  <div className="h-[1rem] w-[1rem] rounded-full bg-red-500" />
                </div>

                <span>
                  {isOnAir
                    ? `Live Now: ${show?.title ?? metadata?.playlist_title ?? current.playlist?.title ?? 'Unknown show'} with ${show?.personas?.length ? getHosts(show) : (metadata?.dj ?? 'unhosted')}`
                    : ' You are listening to the WNYU JUKEBOX. Check out our schedule for upcoming shows! '}
                </span>
              </Marquee>
            </div>
          </div>
          <NavMenu />
        </div>
      </div>
      <DropDownPanel />
      {children}
    </>
  );
}

'use client';

import { useState, useContext } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { EllipsisVerticalIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { DropdownToggleContext } from '../providers/ToggleProvider';

export default function NavMenu() {
  const context = useContext(DropdownToggleContext);
  const [toggleMenu, setToggleMenu] = useState(false);

  const handleClick = () => {
    setToggleMenu((prev) => !prev);
    context?.setToggle(false);
  };

  const handleClose = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();
    setToggleMenu(false);
    context?.setToggle(false);
  };

  const close = (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();
    setToggleMenu(false);
    context?.setToggle(false);
  };

  return (
    <>
      <div className="md:hidden">
        <EllipsisVerticalIcon
          className="size-10 md:hidden"
          onClick={handleClick}
        />
        <motion.div
          onClick={handleClick}
          initial={{ y: '-100%' }}
          animate={toggleMenu ? { y: 0 } : { y: '-100%' }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed left-0 top-0 z-40 flex h-auto w-full items-start justify-start overflow-y-auto bg-black p-4"
        >
          {/* mobile dropdown */}
          <div className="h3 my-7 ml-7 flex cursor-pointer flex-col space-y-7 text-white">
            <Link href="/home" onClick={handleClose}>
              home
            </Link>
            <Link href="/schedule" onClick={handleClose}>
              schedule
            </Link>
            <Link href="/about" onClick={handleClose}>
              about
            </Link>
            <Link href="https://staticmag.org" onClick={handleClose}>
              static
            </Link>
            {/* <Link href="/podcasts" onClick={handleClose}>
              podcasts
            </Link>
            <Link href="/sports" onClick={handleClose}>
              sports
            </Link>
             */}
          </div>
          <XMarkIcon
            className="z-100 absolute right-0 top-0 size-14 text-white"
            onClick={close}
          />
        </motion.div>
      </div>
      {/* desktop bar */}
      <div className="hidden cursor-pointer flex-row items-end justify-end space-x-4 text-xl text-black md:flex">
        <Link className="hover:text-red-600" href="/home">
          HOME
        </Link>
        <Link
          className="transition-colors ease-in-out hover:text-red-600"
          href="/schedule"
        >
          SCHEDULE
        </Link>
        <Link
          className="transition-colors ease-in-out hover:text-red-600"
          href="/about"
        >
          ABOUT
        </Link>
        <Link
          className="transition-colors ease-in-out hover:text-red-600"
          href="https://staticmag.org"
        >
          STATIC
        </Link>
        <div className="cursor-not-allowed text-gray-400 transition-colors ease-in-out">
          PODCASTS
        </div>
        <div className="cursor-not-allowed text-gray-400 transition-colors ease-in-out">
          SPORTS
        </div>
      </div>
    </>
  );
}

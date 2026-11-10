'use client';

import { useState, useContext, useEffect } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDownIcon,
  EllipsisVerticalIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import { DropdownToggleContext } from '../providers/ToggleProvider';

export default function NavMenu() {
  const context = useContext(DropdownToggleContext);
  const [toggleMenu, setToggleMenu] = useState(false);
  const [departmentsOpen, setDepartmentsOpen] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      if (!event.target.closest('[data-departments-menu]')) {
        setDepartmentsOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleClick = () => {
    setToggleMenu((prev) => !prev);
    setDepartmentsOpen(false);
    context?.setToggle(false);
  };

  const handleClose = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();
    setToggleMenu(false);
    setDepartmentsOpen(false);
    context?.setToggle(false);
  };

  const handleDepartmentsClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setDepartmentsOpen((prev) => !prev);
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
            <div data-departments-menu>
              <button
                type="button"
                onClick={handleDepartmentsClick}
                aria-expanded={departmentsOpen}
                className="flex items-center gap-2 text-left"
              >
                departments
                <ChevronDownIcon
                  className={`size-6 transition-transform duration-200 ${
                    departmentsOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {departmentsOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, y: -8 }}
                    animate={{ height: 'auto', opacity: 1, y: 0 }}
                    exit={{ height: 0, opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="ml-6 mt-6 flex flex-col gap-3 overflow-hidden border-l-2 border-red-500 pl-4 text-2xl text-gray-400"
                  >
                    <span className="cursor-not-allowed">podcasts</span>
                    <span className="cursor-not-allowed">sports</span>
                    <Link
                      href="/archives"
                      prefetch={false}
                      onClick={handleClose}
                      className="text-white transition-colors hover:text-red-500"
                    >
                      archives
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
        <div
          className="relative"
          data-departments-menu
          onMouseEnter={() => setDepartmentsOpen(true)}
          onMouseLeave={() => setDepartmentsOpen(false)}
        >
          <button
            type="button"
            onClick={handleDepartmentsClick}
            aria-expanded={departmentsOpen}
            className={`flex items-center gap-1 transition-colors ease-in-out hover:text-red-600 ${
              departmentsOpen ? 'text-red-600' : ''
            }`}
          >
            DEPARTMENTS
            <ChevronDownIcon
              className={`size-5 transition-transform duration-200 ${
                departmentsOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
          <AnimatePresence initial={false}>
            {departmentsOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scaleY: 0.85 }}
                animate={{ opacity: 1, y: 0, scaleY: 1 }}
                exit={{ opacity: 0, y: -8, scaleY: 0.85 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="absolute right-0 top-full mt-3 flex w-full origin-top flex-col gap-2 border-2 border-t-4 border-black border-t-red-500 bg-white p-3 text-left text-xl shadow-[4px_4px_0px_#000]"
              >
                <span className="cursor-not-allowed border-b border-gray-200 pb-2 text-gray-400">
                  PODCASTS
                </span>
                <span className="cursor-not-allowed border-b border-gray-200 pb-2 text-gray-400">
                  SPORTS
                </span>
                <Link
                  href="/archives"
                  prefetch={false}
                  onClick={handleClose}
                  className="transition-colors hover:text-red-600"
                >
                  ARCHIVES
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

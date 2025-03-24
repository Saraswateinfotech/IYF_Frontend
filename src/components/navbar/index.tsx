'use client';
import React, { useEffect, useRef, useState } from 'react';
import Dropdown from 'components/dropdown';
import { FiAlignJustify } from 'react-icons/fi';
import NavLink from 'components/link/NavLink';

import { RiMoonFill, RiSunFill } from 'react-icons/ri';


import avatar from '/public/img/avatars/avatar4.png';
import Image from 'next/image';
import { IoPersonAddSharp } from 'react-icons/io5';
import FormModal from 'components/allifycomponents/Attendence/FormModal';
import { toast } from 'react-toastify';


const Navbar = (props: {
  onOpenSidenav: () => void;
  brandText: string;
  secondary?: boolean | string;
  [x: string]: any;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { onOpenSidenav, brandText, mini, hovered } = props;
  const [darkmode, setDarkmode] = React.useState(
    document.body.classList.contains('dark'),
  );

  return (

    <>
    
    <nav className="sticky top-4 z-40 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#0b14374d]">
    {/* <div className='flex items-center justify-between'> */}
      <div className="ml-[6px]">
        <div className="h-6 w-[170px] pt-1">
          <a
            className="text-sm font-normal text-navy-700 hover:underline dark:text-white dark:hover:text-white"
            href=" "
          >
            Pages
            <span className="mx-1 text-sm text-navy-700 hover:text-navy-700 dark:text-white">
              {' '}
              /{' '}
            </span>
          </a>
          <NavLink
            className="text-sm font-normal capitalize text-navy-700 hover:underline dark:text-white dark:hover:text-white"
            href="#"
          >
            {brandText}
          </NavLink>
        </div>
        <p className="shrink text-lg capitalize text-navy-700 dark:text-white">
            <NavLink href="#" className="font-bold capitalize hover:text-navy-700 dark:hover:text-white">
              {brandText}
            </NavLink>

            
           
          </p>

      </div>
     
    {/* </div> */}



   <div className="relative mt-[3px] flex h-[61px] w-[355px] flex-grow items-center justify-around gap-2 rounded-full bg-white px-2 py-2 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none md:w-[365px] md:flex-grow-0 md:gap-1 xl:w-[300px] xl:gap-2">
        <div className="flex items-center rounded-full text-navy-700 dark:bg-navy-900 dark:text-white ">
<button
  onClick={() => setIsModalOpen(true)}
  className="flex w-full items-center justify-center rounded-full bg-indigo-900 px-4 py-2 text-lg font-medium text-white hover:bg-indigo-800 sm:w-auto"
>
  <IoPersonAddSharp className="text-xl" />
  <span className="pl-2 hidden sm:block">Add Student</span>
</button>
        </div>

        <span
          className="flex cursor-pointer text-xl text-gray-600 dark:text-white xl:hidden"
          onClick={onOpenSidenav}
        >
          <FiAlignJustify className="h-5 w-5" />
        </span>
        <div
          className="cursor-pointer text-gray-600"
          onClick={() => {
            if (darkmode) {
              document.body.classList.remove('dark');
              setDarkmode(false);
            } else {
              document.body.classList.add('dark');
              setDarkmode(true);
            }
          }}
        >
          {darkmode ? (
            <RiSunFill className="h-4 w-4 text-gray-600 dark:text-white" />
          ) : (
            <RiMoonFill className="h-4 w-4 text-gray-600 dark:text-white" />
          )}
        </div>
        {/* Profile & Dropdown */}
        <Dropdown
          button={
            <Image
              width="2"
              height="20"
              className="h-10 w-10 rounded-full"
              src={avatar}
              alt="Elon Musk"
            />
          }
          classNames={'py-2 top-8 -left-[180px] w-max'}
        >
          <div className="flex h-48 w-56 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none">
            <div className="ml-4 mt-3">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-navy-700 dark:text-white">
                  👋 Hey, Adela
                </p>{' '}
              </div>
            </div>
            <div className="mt-3 h-px w-full bg-gray-200 dark:bg-white/20 " />

            <div className="ml-4 mt-3 flex flex-col">
              <a
                href=" "
                className="text-sm text-gray-800 dark:text-white hover:dark:text-white"
              >
                Profile Settings
              </a>
              <a
                href=" "
                className="mt-3 text-sm text-gray-800 dark:text-white hover:dark:text-white"
              >
                Newsletter Settings
              </a>
              <a
  href="/auth/sign-in"
  onClick={() => {
    localStorage.removeItem("token"); 
    toast.success("Logged out successfully!"); 
  }}
  className="mt-3 text-sm font-medium text-red-500 hover:text-red-500 cursor-pointer"
>
  Log Out
</a>

            </div>
          </div>
        </Dropdown>
      </div>
    </nav>
       {/* Modal Component */}
       <FormModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default Navbar;




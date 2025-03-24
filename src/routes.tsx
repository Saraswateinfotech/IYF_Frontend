import React from 'react';
import { PiStudentBold } from 'react-icons/pi';
import { MdHome, MdLock, MdAddTask } from 'react-icons/md';
import { FaPeopleGroup } from 'react-icons/fa6';
import { IoIosMan } from 'react-icons/io';

const routes = [
  {
    name: 'Main Dashboard',
    layout: '/admin',
    path: 'dashboard',
    icon: <MdHome className="h-6 w-6" />,
  },
  {
    name: 'Attendence',
    layout: '/admin',
    path: '/attendence',
    icon: <MdAddTask />,
  },

  {
    name: 'All Student',
    layout: '/admin',
    path: '/allstudent',
    icon: <PiStudentBold />,
  },

  {
    name: 'All Batches',
    layout: '/admin',
    path: '/batches',
    icon: <FaPeopleGroup />,
  },
  {
    name: 'Facilitators',
    layout: '/admin',
    path: '/facilitators',
    icon: <IoIosMan />,
  },
  {
    name: 'Das-Accounts',
    layout: '/admin',
    path: '/dasAccounts',
    icon: <FaPeopleGroup />,
  },
  {
    name: 'Sign In',
    layout: '/auth',
    path: 'sign-in',
    icon: <MdLock className="h-6 w-6" />,
  },
];
export default routes;

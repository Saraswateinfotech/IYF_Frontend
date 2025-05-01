

'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import routes from 'routes';
import {
  getActiveNavbar,
  getActiveRoute,
  isWindowAvailable,
} from 'utils/navigation';
import React from 'react';
import Navbar from 'components/navbar';
import Sidebar from 'components/sidebar';
import Footer from 'components/footer/Footer';
import { ToastContainer } from 'react-toastify';

export default function Admin({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false); // Prevent flash before redirect

  useEffect(() => {
    if (isWindowAvailable()) {
      document.documentElement.dir = 'ltr';
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/sign-in'); // 🔐 Redirect if token not found
      } else {
        setChecked(true); // token exists, allow render
      }
    }
  }, []);

  if (!checked) return null; // prevent layout flash before token check

  return (
    <>
    
    <ToastContainer/>
    <div className="flex h-full w-full bg-background-100 dark:bg-background-900">
      <Sidebar routes={routes} open={open} setOpen={setOpen} variant="admin" />
      <div className="h-full w-full font-dm dark:bg-navy-900">
        <main className={`mx-2.5 flex-none transition-all dark:bg-navy-900 md:pr-2 xl:ml-[323px]`}>
          <div>
            <Navbar
              onOpenSidenav={() => setOpen(!open)}
              brandText={getActiveRoute(routes, pathname)}
              secondary={getActiveNavbar(routes, pathname)}
            />
            <div className="mx-auto min-h-screen p-2 !pt-[10px] md:p-2">
              {children}
            </div>
            <div className="p-3">
              <Footer />
            </div>
          </div>
        </main>
      </div>
    </div>
    </>
  );
}

// /* eslint-disable */
// import React from 'react';
// import { useCallback } from 'react';
// import { usePathname } from 'next/navigation';
// import NavLink from 'components/link/NavLink';
// import DashIcon from 'components/icons/DashIcon';
// // chakra imports

// export const SidebarLinks = (props: { routes: RoutesType[] }): JSX.Element => {
//   // Chakra color mode
//   const pathname = usePathname();

//   const { routes } = props;

//   // verifies if routeName is the one active (in browser input)
//   const activeRoute = useCallback(
//     (routeName: string) => {
//       return pathname?.includes(routeName);
//     },
//     [pathname],
//   );

//   const createLinks = (routes: RoutesType[]) => {
//     return routes.map((route, index) => {
//       if (
//         route.layout === '/admin' ||
//         route.layout === '/auth' ||
//         route.layout === '/rtl'
//       ) {
//         return (
//           <NavLink key={index} href={route.layout + '/' + route.path}>
//             <div className="relative mb-3 flex hover:cursor-pointer">
//               <li
//                 className="my-[3px] flex cursor-pointer items-center px-8"
//                 key={index}
//               >
//                 <span
//                   className={`${
//                     activeRoute(route.path) === true
//                       ? 'font-bold text-brand-500 dark:text-white'
//                       : 'font-medium text-gray-600'
//                   }`}
//                 >
//                   {route.icon ? route.icon : <DashIcon />}{' '}
//                 </span>
//                 <p
//                   className={`leading-1 ml-4 flex ${
//                     activeRoute(route.path) === true
//                       ? 'font-bold text-navy-700 dark:text-white'
//                       : 'font-medium text-gray-600'
//                   }`}
//                 >
//                   {route.name}
//                 </p>
//               </li>
//               {activeRoute(route.path) ? (
//                 <div className="absolute right-0 top-px h-9 w-1 rounded-lg bg-brand-500 dark:bg-brand-400" />
//               ) : null}
//             </div>
//           </NavLink>
//         );
//       }
//     });
//   };
//   // BRAND
//   return <>{createLinks(routes)}</>;
// };

// export default SidebarLinks;




/* eslint-disable */
import React from 'react';
import { useCallback } from 'react';
import { usePathname } from 'next/navigation';
import NavLink from 'components/link/NavLink';
import DashIcon from 'components/icons/DashIcon';
import { RoutesType } from 'types/navigation';

interface SidebarLinksProps {
  routes: RoutesType[];
  setOpen?: (open: boolean) => void;
}

export const SidebarLinks = (props: SidebarLinksProps): JSX.Element => {
  const pathname = usePathname();
  const { routes, setOpen } = props;

  const activeRoute = useCallback(
    (routeName: string) => {
      return pathname?.includes(routeName);
    },
    [pathname],
  );

  const handleLinkClick = () => {
    if (setOpen) {
      setOpen(false);
    }
  };

  const createLinks = (routes: RoutesType[]) => {
    return routes.map((route, index) => {
      if (
        route.layout === '/admin' ||
        route.layout === '/auth' ||
        route.layout === '/rtl'
      ) {
        return (
          <div key={index} onClick={handleLinkClick}>
            <NavLink href={route.layout + '/' + route.path}>
              <div className="relative mb-3 flex hover:cursor-pointer">
                <li className="my-[3px] flex cursor-pointer items-center px-8">
                  <span
                    className={`${
                      activeRoute(route.path) === true
                        ? 'font-bold text-brand-500 dark:text-white'
                        : 'font-medium text-gray-600'
                    }`}
                  >
                    {route.icon || <DashIcon />}{' '}
                  </span>
                  <p
                    className={`leading-1 ml-4 flex ${
                      activeRoute(route.path) === true
                        ? 'font-bold text-navy-700 dark:text-white'
                        : 'font-medium text-gray-600'
                    }`}
                  >
                    {route.name}
                  </p>
                </li>
                {activeRoute(route.path) ? (
                  <div className="absolute right-0 top-px h-9 w-1 rounded-lg bg-brand-500 dark:bg-brand-400" />
                ) : null}
              </div>
            </NavLink>
          </div>
        );
      }
      return null;
    });
  };

  return <>{createLinks(routes)}</>;
};

export default SidebarLinks;

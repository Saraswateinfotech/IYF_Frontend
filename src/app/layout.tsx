// import React, { ReactNode } from 'react';
// import AppWrappers from './AppWrappers';
// import { ToastContainer } from 'react-toastify';
// // import '@asseinfo/react-kanban/dist/styles.css';
// // import '/public/styles/Plugins.css';

// export default function RootLayout({ children }: { children: ReactNode }) {
//   return (
//     <html lang="en">
//       <body id={'root'}>
//         <ToastContainer />
//         <AppWrappers>{children}</AppWrappers>
//       </body>
//     </html>
//   );
// }


import React, { ReactNode } from 'react';
import AppWrappers from './AppWrappers';
import { DashboardProvider } from 'contexts/DashboardContext';
// import '@asseinfo/react-kanban/dist/styles.css';
// import '/public/styles/Plugins.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body id={'root'}>
        {/* <AppWrappers>{children}</AppWrappers> */}
        <DashboardProvider> 
          <AppWrappers>{children}</AppWrappers>
        </DashboardProvider>
      </body>
    </html>
  );
}

// 'use client';
// import { useState, useEffect } from 'react';
// import { IoMdHome } from 'react-icons/io';
// import { IoDocuments } from 'react-icons/io5';
// import { MdBarChart } from 'react-icons/md';
// import Widget from 'components/widget/Widget';
// import CallingSystem from 'components/allifycomponents/callingSystem';
// import AssignedCalling from 'components/allifycomponents/callingSystem/AssignedCalling';

// const facilitators = [
//   {
//     id: 0,
//     name: 'All',
//     stats: {
//       total: 'Rs 2000',
//       pending: 'Rs 1262.39',
//       register: '5574',
//       weekly: '615',
//       students: '9333',
//     },
//   },
//   {
//     id: 1,
//     name: 'John Doe',
//     stats: {
//       total: 'Rs 500.5',
//       pending: 'Rs 200',
//       register: '1200',
//       weekly: '90',
//       students: '2200',
//     },
//   },
//   {
//     id: 2,
//     name: 'Jane Smith',
//     stats: {
//       total: 'Rs 340.5',
//       pending: 'Rs 642.39',
//       register: '1574',
//       weekly: '145',
//       students: '2433',
//     },
//   },
//   {
//     id: 3,
//     name: 'Alice Brown',
//     stats: {
//       total: 'Rs 700.0',
//       pending: 'Rs 300',
//       register: '1800',
//       weekly: '200',
//       students: '2600',
//     },
//   },
//   {
//     id: 4,
//     name: 'Robert Johnson',
//     stats: {
//       total: 'Rs 450.2',
//       pending: 'Rs 120',
//       register: '1000',
//       weekly: '80',
//       students: '2100',
//     },
//   },
// ];

// const Dashboard = () => {
//   const [selectedFacilitator, setSelectedFacilitator] = useState(
//     facilitators[0],
//   );

//   return (
//     <div className="mt-8">
//       {/* <nav className="sticky top-4 z-10 mt-5 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#0b14374d]">
//         <div>
//           <form className="mx-auto flex max-w-sm items-center space-x-2">
//             <select
//               id="facilitators"
//               className="block w-full rounded-lg border border-gray-300 bg-gray-50
//                          p-2 text-sm text-gray-900
//                          focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700
//                          dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500
//                          md:w-80 lg:w-[500px]"
//               onChange={(e) => {
//                 const selected = facilitators.find(
//                   (fac) => fac.id === Number(e.target.value),
//                 );
//                 setSelectedFacilitator(selected);
//               }}
//             >
//               {facilitators.map((facilitator) => (
//                 <option key={facilitator.id} value={facilitator.id}>
//                   {facilitator.name}
//                 </option>
//               ))}
//             </select>

//             <button
//               type="button"
//               className="rounded-lg bg-blue-900 px-4 py-2 text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
//             >
//               Show
//             </button>
//           </form>
//         </div>
//       </nav> */}

//       {/* Card widget */}
//       <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
//         <Widget
//           icon={<MdBarChart className="h-7 w-7" />}
//           title={'Total Amount'}
//           subtitle={selectedFacilitator.stats.total}
//         />
//         <Widget
//           icon={<IoDocuments className="h-6 w-6" />}
//           title={'Pending Amount'}
//           subtitle={selectedFacilitator.stats.pending}
//         />
//         <Widget
//           icon={<MdBarChart className="h-7 w-7" />}
//           title={'Total Register'}
//           subtitle={selectedFacilitator.stats.register}
//         />
//         <Widget
//           icon={<MdBarChart className="h-7 w-7" />}
//           title={'Weekly Total Registered'}
//           subtitle={selectedFacilitator.stats.weekly}
//         />
//         <Widget
//           icon={<IoMdHome className="h-6 w-6" />}
//           title={'Total Students'}
//           subtitle={selectedFacilitator.stats.students}
//         />
//       </div>

//       <div className="mt-10">
//         <CallingSystem />
//       </div>

//       <div className="mt-14">
//         <AssignedCalling />
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

'use client';
import { useEffect, useState } from 'react';
import CallingSystem from 'components/allifycomponents/callingSystem';
import FrontlinerCallingSystem from 'components/allifycomponents/FrontlinerDas/Frontliner';


const Dashboard = () => {
  
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    setRole(storedRole);
  }, []);

  return (
    <>
      <div className="mt-8">
        <>
          <div className="mt-8">
            {role === 'coordinator' ? (
              <div></div>
            ) : role === 'frontliner' ? (
              <>
                <div className="mt-14">
                  <FrontlinerCallingSystem />
                </div>
              </>
            ) : (
              <div>
                <div className="mt-10">
                  <CallingSystem />
                </div>
              </div>
            )}
          </div>
        </>
      </div>
    </>
  );
};

export default Dashboard;

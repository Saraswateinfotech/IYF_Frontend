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
import AssignedCalling from 'components/allifycomponents/callingSystem/AssignedCalling';
import { getdashboardReport } from 'services/apiCollection';
import FrontlinerReport from 'components/allifycomponents/FrontlinerReport';
import FrontlinerCallingSystem from 'components/allifycomponents/callingSystem/Frontliner';
import { FaCalendarCheck, FaClock, FaUsers, FaWallet } from 'react-icons/fa6';

const Dashboard = () => {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    setRole(storedRole);
  }, []);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await getdashboardReport();
        setReport(data[0]);
      } catch (err) {
        console.error('Failed to fetch dashboard report:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  if (loading) return <div className="p-4">Loading dashboard...</div>;

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
                  <FrontlinerReport />
                </div>
                <div className="mt-14">
                  <FrontlinerCallingSystem />
                </div>
                <div className="mt-14">
                  <AssignedCalling />
                </div>
              </>
            ) : (
              <div>
                <h2 className="mb-3 text-lg font-bold dark:text-white">
                  Dashboard Report
                </h2>
                
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
  {/* Total Registered */}
  <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex items-center space-x-4">
    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
      <FaUsers className="text-blue-500 dark:text-blue-300" size={24} />
    </div>
    <div>
      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Total Registered</h3>
      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{report.total_register}</p>
    </div>
  </div>

  {/* Total Amount */}
  <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex items-center space-x-4">
    <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
      <FaWallet className="text-green-500 dark:text-green-300" size={24} />
    </div>
    <div>
      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Total Amount</h3>
      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{report.total_amount}</p>
    </div>
  </div>

  {/* Pending Amount */}
  <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex items-center space-x-4">
    <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
      <FaClock className="text-yellow-500 dark:text-yellow-300" size={24} />
    </div>
    <div>
      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Pending Amount</h3>
      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{report.pending_amount}</p>
    </div>
  </div>

  {/* Weekly Registered */}
  <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex items-center space-x-4">
    <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
      <FaCalendarCheck className="text-purple-500 dark:text-purple-300" size={24} />
    </div>
    <div>
      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Weekly Registered</h3>
      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{report.weekly_total_registered_student_number}</p>
    </div>
  </div>
</div>

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

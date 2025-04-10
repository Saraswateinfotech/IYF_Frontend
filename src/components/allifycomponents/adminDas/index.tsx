// 'use client';

// import { useEffect, useMemo, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
// import { toast, ToastContainer } from 'react-toastify';
// import {
//   fetchAllFacilitatorOrFrontliner,
//   getdashboardReport,
// } from 'services/apiCollection';
// import Reports from '../Reports';
// import { FaPhoneAlt } from 'react-icons/fa';

// type Frontliner = {
//   user_id: number;
//   name: string;
//   phone_number: string;
//   role: string;
// };

// const AdminDas = () => {
//   const [frontliners, setFrontliners] = useState<Frontliner[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [report, setReport] = useState<any>(null);

//   const router = useRouter();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true);
//         const [frontlinerRes, dashboardReport] = await Promise.all([
//           fetchAllFacilitatorOrFrontliner(),
//           getdashboardReport(),
//         ]);

//         // Filter to only include items where role is 'frontliner'
//         const filteredFrontliners = frontlinerRes.filter(
//           (item: Frontliner) => item.role === 'frontliner'
//         );
//         setFrontliners(filteredFrontliners);

//         setReport(dashboardReport[0]);
//       } catch (err) {
//         console.error('Error fetching data:', err);
//         toast.error('Failed to load data');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const frontlinerColumns = useMemo<MRT_ColumnDef<Frontliner>[]>(() => [
//     { accessorKey: 'name', header: 'Name' },
//     { accessorKey: 'phone_number', header: 'Phone Number',Cell: ({ row }) => (
//                     <a
//                       href={`tel:${row.original.phone_number}`}
//                       onClick={(e) => e.stopPropagation()}
//                       className="inline-flex items-center space-x-5 px-6   py-2 rounded-lg bg-indigo-900 text-white hover:bg-indigo-800 transition duration-300 ease-in-out transform hover:scale-105"
//                     >
//                       <FaPhoneAlt className="text-xl" />
//                       <span className="text-sm md:text-base">{row.original.phone_number}</span>
//                     </a>
//                   ), },
//     // { accessorKey: 'role', header: 'Role' },
//   ], []);

//   const handleFrontlinerClick = (frontliner: Frontliner) => {
//     router.push(`/admin/dashboard/facilitator-frontliner/${frontliner.user_id}`);
//   };

//   if (isLoading) {
//     return <div className="mt-6 px-6 text-lg dark:bg-white">Loading...</div>;
//   }

//   return (
//     <>
//       <ToastContainer />
//       <div className="mt-8">
//         <h2 className="mb-5 text-lg font-bold dark:text-white">
//         Admin Report / Overall Report
//         </h2>

//         <Reports report={report} />

//         <div className="mb-5 mt-0 rounded-md bg-white p-5 shadow-2xl">
//           <MaterialReactTable
//             columns={frontlinerColumns}
//             data={frontliners}
//             enableSorting
//             muiTableHeadCellProps={{
//               sx: {
//                 backgroundColor: '#312e81',
//                 color: 'white',
//                 fontSize: '16px',
//                 fontWeight: 'bold',
//                 borderRadius: '2px',
//               },
//             }}
//             muiTableBodyRowProps={({ row }) => ({
//               onClick: () => handleFrontlinerClick(row.original),
//               style: { cursor: 'pointer' },
//             })}
//           />
//         </div>
//       </div>
//     </>
//   );
// };

// export default AdminDas;

'use client';

import { useEffect, useState } from 'react';
import FacilitatorReportDas from './FacilitatorReportDas';
// import { getGroupUserCount, getStudentGroupWise } from 'services/apiCollection';

const groupList = [
  'DYS',
  'Jagganath',
  'Nachiketa',
  'Shadev',
  'Nakul',
  'Arjun',
  'GourangSabha',
  'Bhima',
];

const monthList = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// 🔹 Dummy Data for Testing
const dummyReport = [
  {
    date: '2025-01-03',
    attended: 3,
    total_students: 15,
    total_classes: 5,
  },
  {
    date: '2025-01-10',
    attended: 10,
    total_students: 15,
    total_classes: 5,
  },
  {
    date: '2025-01-17',
    attended: 12,
    total_students: 15,
    total_classes: 5,
  },
  {
    date: '2025-01-24',
    attended: 9,
    total_students: 15,
    total_classes: 5,
  },
];
const dummyNewDYSCount = 4;

const getCurrentMonthName = () => {
  const now = new Date();
  return monthList[now.getMonth()];
};

const AdminDas = () => {
  const facilitatorId =
    typeof window !== 'undefined' ? localStorage.getItem('frontlinerId') : null;

  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [groupName, setGroupName] = useState('DYS');
  const [month, setMonth] = useState(getCurrentMonthName());

  const fetchGetStudentGroupWise = async (
    group_name: string,
    month: string,
  ) => {
    if (!facilitatorId) return;
    setIsLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 500));
      setData(
        dummyReport.map((item) => ({
          ...item,
          newStudentsInDYS: dummyNewDYSCount,
        })),
      );
    } catch (err) {
      console.log('Failed to fetch students by group');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (groupName && month) {
      fetchGetStudentGroupWise(groupName, month);
    }
  }, [groupName, month]);

  if (isLoading) {
    return <div className="mt-6 px-6 text-lg dark:bg-white">Loading...</div>;
  }

  return (
    <>
      <div className="mt-10">
        <h2 className="mb-5 text-lg font-bold dark:text-white">
          Admin Report / Overall Report
        </h2>

        {/* Group + Month Selector */}
        <div className="mb-4 mt-10 flex justify-end">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchGetStudentGroupWise(groupName, month);
            }}
            className="flex max-w-lg flex-wrap justify-end gap-2 "
          >
            <select
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="block w-48 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
            >
              <option disabled>Select a Group</option>
              {groupList.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>

            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="block w-48 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
            >
              <option disabled>Select a Month</option>
              {monthList.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="ml-1.5 rounded-lg bg-blue-900 px-4 py-2 font-medium text-white hover:bg-blue-800"
            >
              Show
            </button>
          </form>
        </div>

        {/* Result Cards */}
        <div className="mt-2 grid grid-cols-1 gap-6 md:grid-cols-2 ">
          {data.length === 0 ? (
            <p className="text-gray-700 dark:text-white">No data found.</p>
          ) : (
            data.map((entry: any, idx: number) => (
              <div
                key={idx}
                className="rounded-xl bg-gradient-to-r from-blue-900 to-indigo-700 p-5 text-white shadow-md transition-transform hover:scale-[1.02]"
              >
                <h3 className="text-md font-semibold">
                  {new Date(entry.date).toLocaleDateString()} :
                </h3>
                <p className="mt-2 text-2xl font-bold">
                  {entry.attended}/{entry.total_students}/{entry.total_classes}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
      <FacilitatorReportDas/>
    </>
  );
};

export default AdminDas;

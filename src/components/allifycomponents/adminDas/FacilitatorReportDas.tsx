// 'use client';

// import { useEffect, useMemo, useState } from 'react';
// import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
// import {  getStudentGroupWise } from 'services/apiCollection';
// import { FaPhoneAlt } from 'react-icons/fa';
// import { Users } from 'lucide-react';

// type Student = {
//   user_id: number;
//   name: string;
//   chanting_round: string;
//   action: string;
//   mobile_number: string;
//   total_report: string;
// };

// const groupList = [
//   'DYS',
//   'Jagganath',
//   'Nachiketa',
//   'Shadev',
//   'Nakul',
//   'Arjun',
//   'GourangSabha',
//   'Bhima',
// ];

// const monthList = [
//   'January',
//   'February',
//   'March',
//   'April',
//   'May',
//   'June',
//   'July',
//   'August',
//   'September',
//   'October',
//   'November',
//   'December',
// ];

// // Utility to get current month name
// const getCurrentMonthName = () => {
//   const now = new Date();
//   return monthList[now.getMonth()];
// };

// const FacilitatorReportDas = () => {
//   const facilitatorId =
//     typeof window !== 'undefined' ? localStorage.getItem('frontlinerId') : null;

//   const [data, setData] = useState<Student[]>([]);
//   const [groupData, setGroupData] = useState<any[]>([]);
//   const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [groupName, setGroupName] = useState('DYS');
//   const [month, setMonth] = useState(getCurrentMonthName());

//   const fetchGetStudentGroupWise = async (group_name: string, month: string) => {
//     if (!facilitatorId) return;
//     setIsLoading(true);
//     try {
//       const users = await getStudentGroupWise(facilitatorId, group_name, month);
//       setData(users.users);
//     } catch (err) {
//       console.log('Failed to fetch students by group');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (groupName && month) {
//       fetchGetStudentGroupWise(groupName, month);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [groupName, month]);

//   const columns = useMemo<MRT_ColumnDef<Student>[]>(() => [
//     {
//       accessorKey: 'name',
//       header: 'Name',
//       size: 200,
//     },
//     {
//       accessorKey: 'chanting_round',
//       header: 'Chanting',
//       size: 200,
//     },
//     {
//       accessorKey: 'total_report',
//       header: 'Total Report',
//       size: 200,
//     },
//     {
//       accessorKey: 'mobile_number',
//       header: 'Phone Number',
//       size: 150,
//       Cell: ({ row }) => (
//         <a
//           href={`tel:${row.original.mobile_number}`}
//           className="flex transform items-center space-x-4 rounded-lg bg-indigo-900 px-4 py-2 text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-indigo-800"
//         >
//           <FaPhoneAlt className="text-xl" />
//           <span className="text-sm md:text-base">
//             {row.original.mobile_number}
//           </span>
//         </a>
//       ),
//     },
//   ], []);

//   if (isLoading) {
//     return <div className="mt-6 px-6 text-lg dark:bg-white">Loading...</div>;
//   }

//   return (
//     <div className="mt-10">
//       {/* Group Count Cards */}
//       <div className="mx-auto max-w-7xl">
//         <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//           {groupData.map((group, idx) => (
//             <div
//               key={idx}
//               className={`rounded-xl p-4 text-white shadow-2xl transition-transform duration-300 hover:scale-105 ${group.color}`}
//             >
//               <div className="flex items-center justify-between">
//                 <h2 className="text-xl font-semibold">{group.group_name}</h2>
//                 <Users className="h-6 w-6" />
//               </div>
//               <p className="mt-2 text-4xl font-bold">{group.total_users}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Group + Month Selector */}
//       <div className="mb-4 mt-10 flex justify-end">
//         <form
//           onSubmit={(e) => {
//             e.preventDefault();
//             fetchGetStudentGroupWise(groupName, month);
//           }}
//           className="flex max-w-2xl flex-wrap justify-end gap-3 shadow-xl"
//         >
//           <select
//             id="groups"
//             value={groupName}
//             onChange={(e) => setGroupName(e.target.value)}
//             className="block w-48 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
//           >
//             <option disabled>Select a Group</option>
//             {groupList.map((group) => (
//               <option key={group} value={group}>
//                 {group}
//               </option>
//             ))}
//           </select>

//           <select
//             value={month}
//             onChange={(e) => setMonth(e.target.value)}
//             className="block w-48 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
//           >
//             <option disabled>Select a Month</option>
//             {monthList.map((m) => (
//               <option key={m} value={m}>
//                 {m}
//               </option>
//             ))}
//           </select>

//           <button
//             type="submit"
//             className="ml-1.5 rounded-lg bg-blue-900 px-4 py-2 font-medium text-white hover:bg-blue-800"
//           >
//             Show
//           </button>
//         </form>
//       </div>

//       {/* Table */}
//       <div className="mb-5 mt-0 rounded-md bg-white p-5 shadow-2xl">
//         <MaterialReactTable
//           columns={columns}
//           data={data}
//           enableSorting
//           onRowSelectionChange={setRowSelection}
//           state={{ rowSelection }}
//           getRowId={(row) => row.user_id.toString()}
//           muiTablePaperProps={{
//             sx: {
//               overflow: 'visible !important',
//             },
//           }}
//           muiTableBodyCellProps={{
//             sx: {
//               overflow: 'visible',
//             },
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// export default FacilitatorReportDas;


// 'use client';

// import { useEffect, useMemo, useState } from 'react';
// import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
// import { FaPhoneAlt } from 'react-icons/fa';

// type FacilitatorReport = {
//   user_id: number;
//   name: string;
//   mobile_number: string;
//   progress_report: string[];
//   average: string;
// };

// const groupList = [
//   'DYS',
//   'Jagganath',
//   'Nachiketa',
//   'Shadev',
//   'Nakul',
//   'Arjun',
//   'GourangSabha',
//   'Bhima',
// ];

// const monthList = [
//   'January',
//   'February',
//   'March',
//   'April',
//   'May',
//   'June',
//   'July',
//   'August',
//   'September',
//   'October',
//   'November',
//   'December',
// ];

// const getCurrentMonthName = () => {
//   const now = new Date();
//   return monthList[now.getMonth()];
// };

// //Dummy Data
// const dummyData: FacilitatorReport[] = [
//   {
//     user_id: 1,
//     name: 'Ramesh Sharma',
//     mobile_number: '9876543210',
//     progress_report: ['3/5/15', '15/5/22', '20/5/15', '18/5/22'],
//     average: '30',
//   },
//   {
//     user_id: 2,
//     name: 'Suresh Patel',
//     mobile_number: '9876501234',
//     progress_report: ['5/5/15', '12/5/22', '17/5/15', '22/5/22'],
//     average: '32',
//   },
// ];

// const FacilitatorReportDas = () => {
//   const [data, setData] = useState<FacilitatorReport[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [groupName, setGroupName] = useState('Nachiketa');
//   const [month, setMonth] = useState(getCurrentMonthName());

//   const fetchReportDummy = async (group: string, month: string) => {
//     setIsLoading(true);
//     await new Promise((res) => setTimeout(res, 500)); // simulate delay
//     setData(dummyData); // Set dummy data
//     setIsLoading(false);
//   };

//   useEffect(() => {
//     fetchReportDummy(groupName, month);
//   }, [groupName, month]);

//   const columns = useMemo<MRT_ColumnDef<FacilitatorReport>[]>(() => [
//     {
//       accessorKey: 'name',
//       header: 'Name',
//       size: 200,
//     },
//     {
//       accessorKey: 'mobile_number',
//       header: 'Phone Number',
//       size: 180,
//       Cell: ({ row }) => (
//         <a
//           href={`tel:${row.original.mobile_number}`}
//           className="flex transform items-center space-x-4 rounded-lg bg-indigo-900 px-4 py-2 text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-indigo-800"
//         >
//           <FaPhoneAlt className="text-xl" />
//           <span className="text-sm md:text-base">
//             {row.original.mobile_number}
//           </span>
//         </a>
//       ),
//     },
//     {
//       header: 'Progress Report',
//       accessorFn: (row) => row.progress_report.join(', '),
//       Cell: ({ row }) => (
//         <div className="flex flex-col gap-1 text-sm">
//           {row.original.progress_report.map((r, i) => (
//             <span key={i} className="rounded bg-blue-100 px-2 py-1 text-blue-800">
//               {r}
//             </span>
//           ))}
//         </div>
//       ),
//     },
//     {
//       header: 'Monthly Average',
//       accessorKey: 'average',
//       size: 100,
//       Cell: ({ row }) => (
//         <span className="inline-block rounded bg-green-100 px-2 py-1 text-green-800">
//           {row.original.average}
//         </span>
//       ),
//     },
//   ], []);

//   return (
//     <div className="mt-10">
//       <h2 className="mb-5 text-xl font-bold text-gray-800">Facilitator Report</h2>

//       {/* Filters */}
//       <div className="mb-5 flex flex-wrap justify-end gap-4">
//         <select
//           value={groupName}
//           onChange={(e) => setGroupName(e.target.value)}
//           className="block w-48 rounded-lg border border-gray-300 bg-gray-100 p-2 text-sm text-gray-900"
//         >
//           {groupList.map((group) => (
//             <option key={group} value={group}>
//               {group}
//             </option>
//           ))}
//         </select>

//         <select
//           value={month}
//           onChange={(e) => setMonth(e.target.value)}
//           className="block w-48 rounded-lg border border-gray-300 bg-gray-100 p-2 text-sm text-gray-900"
//         >
//           {monthList.map((m) => (
//             <option key={m} value={m}>
//               {m}
//             </option>
//           ))}
//         </select>

//         <button
//           onClick={() => fetchReportDummy(groupName, month)}
//           className="rounded-lg bg-blue-900 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
//         >
//           Apply Filter
//         </button>
//       </div>

//       {/* Table */}
//       <div className="rounded-lg bg-white p-5 shadow-xl">
//         <MaterialReactTable
//           columns={columns}
//           data={data}
//           enableSorting
//           state={{ isLoading }}
//           getRowId={(row) =>
//             row?.user_id ? row.user_id.toString() : Math.random().toString()
//           }
//           muiTablePaperProps={{
//             sx: {
//               overflow: 'visible !important',
//             },
//           }}
//           muiTableBodyCellProps={{
//             sx: {
//               overflow: 'visible',
//             },
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// export default FacilitatorReportDas;




// 'use client';

// import { useEffect, useMemo, useState } from 'react';
// import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
// import { FaPhoneAlt } from 'react-icons/fa';

// type FacilitatorReport = {
//   user_id: number;
//   name: string;
//   mobile_number: string;
//   progress_report_data: number[];
//   average: string;
// };

// const groupList = [
//   'Nachiketa',
//   'Bhima',
//   'Arjun',
//   'Shadev',
//   'Nakul',
//   'Jagganath',
//   'DYS',
// ];

// const monthList = [
//   'January', 'February', 'March', 'April',
//   'May', 'June', 'July', 'August',
//   'September', 'October', 'November', 'December',
// ];

// const getCurrentMonth = () => {
//   const now = new Date();
//   return monthList[now.getMonth()];
// };

// const FacilitatorReportDas = () => {
//   const [data, setData] = useState<FacilitatorReport[]>([]);
//   const [progressDates, setProgressDates] = useState<string[]>([]);
//   const [isLoading, setIsLoading] = useState(false);

//   const [groupName, setGroupName] = useState('Nachiketa');
//   const [month, setMonth] = useState(getCurrentMonth());

//   const fetchReport = async (group: string, month: string) => {
//     setIsLoading(true);
//     try {
//       // Replace with real API call using group & month
//       const response = await new Promise<{ progressDates: string[]; data: FacilitatorReport[] }>(
//         (resolve) =>
//           setTimeout(() => {
//             resolve({
//               progressDates: ['3/5/15', '15/5/22', '20/5/15', '18/5/22'],
//               data: [
//                 {
//                   user_id: 1,
//                   name: 'Ramesh Sharma',
//                   mobile_number: '9876543210',
//                   progress_report_data: [30, 10, 15, 30],
//                   average: '30',
//                 },
//                 {
//                   user_id: 2,
//                   name: 'Suresh Patel',
//                   mobile_number: '9876501234',
//                   progress_report_data: [31, 15, 20, 30],
//                   average: '32',
//                 },
//               ],
//             });
//           }, 500)
//       );

//       setProgressDates(response.progressDates);
//       setData(response.data);
//     } catch (err) {
//       console.error('Error fetching report', err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchReport(groupName, month);
//   }, []);

//   const columns = useMemo<MRT_ColumnDef<FacilitatorReport>[]>(() => [
//     {
//       accessorKey: 'name',
//       header: 'Name',
//       size: 200,
//     },
//     {
//       accessorKey: 'mobile_number',
//       header: 'Phone Number',
//       size: 180,
//       Cell: ({ row }) => (
//         <a
//           href={`tel:${row.original.mobile_number}`}
//           className="flex transform items-center space-x-4 rounded-lg bg-indigo-900 px-4 py-2 text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-indigo-800"
//         >
//           <FaPhoneAlt className="text-xl" />
//           <span className="text-sm md:text-base">{row.original.mobile_number}</span>
//         </a>
//       ),
//     },
//     ...progressDates.map((date, index) => ({
//       header: date,
//       accessorFn: (row: FacilitatorReport) =>
//         row.progress_report_data?.[index]?.toString() || '-',
//       id: `progress_${index}`,
//       size: 100,
//       Cell: ({ cell }) => {
//         const value = cell.getValue() as string;
//         return (
//           <span className="inline-block rounded bg-blue-100 px-2 py-1 text-blue-800">
//             {value !== '-' ? value : '-'}
//           </span>
//         );
//       },
//     })),
//     {
//       accessorKey: 'average',
//       header: 'Monthly Avg',
//       size: 100,
//       Cell: ({ row }) => (
//         <span className="inline-block rounded bg-green-100 px-2 py-1 text-green-800">
//           {row.original.average}
//         </span>
//       ),
//     },
//   ], [progressDates]);

//   return (
//     <div className="mt-10">
//       <h2 className="mb-5 text-xl font-bold text-gray-800 dark:text-white">Facilitator Report</h2>


//       {/* Table */}
//       {/* Filters */}
//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           fetchReport(groupName, month);
//         }}
//         className="mb-2 flex flex-wrap justify-end gap-2"
//       >
//         <select
//           value={groupName}
//           onChange={(e) => setGroupName(e.target.value)}
//           className="rounded-lg w-48 border border-gray-300 bg-gray-100 p-2 text-sm text-gray-900"
//         >
//           {groupList.map((group) => (
//             <option key={group} value={group}>
//               {group}
//             </option>
//           ))}
//         </select>

//         <select
//           value={month}
//           onChange={(e) => setMonth(e.target.value)}
//           className="rounded-lg w-48 border border-gray-300 bg-gray-100 p-2 text-sm text-gray-900"
//         >
//           {monthList.map((m) => (
//             <option key={m} value={m}>
//               {m}
//             </option>
//           ))}
//         </select>

//         <button
//           type="submit"
//           className="rounded-lg bg-blue-900 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
//         >
//           Apply Filter
//         </button>
//       </form>
//       <div className="rounded-lg bg-white p-5 shadow-xl">
//         <MaterialReactTable
//           columns={columns}
//           data={data}
//           enableSorting
//           state={{ isLoading }}
//           getRowId={(row) =>
//             row?.user_id ? row.user_id.toString() : Math.random().toString()
//           }
//           muiTablePaperProps={{ sx: { overflow: 'visible !important' } }}
//           muiTableBodyCellProps={{ sx: { overflow: 'visible' } }}
//         />
//       </div>
//     </div>
//   );
// };

// export default FacilitatorReportDas;


'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation'; // or 'next/router' if on Next.js 12
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { FaPhoneAlt } from 'react-icons/fa';

type FacilitatorReport = {
  user_id: number;
  name: string;
  mobile_number: string;
  progress_report_data: number[];
  average: string;
};

const groupList = [
  'Nachiketa',
  'Bhima',
  'Arjun',
  'Shadev',
  'Nakul',
  'Jagganath',
  'DYS',
];

const monthList = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December',
];

const getCurrentMonth = () => {
  const now = new Date();
  return monthList[now.getMonth()];
};

const FacilitatorReportDas = () => {
  const router = useRouter();
  const [data, setData] = useState<FacilitatorReport[]>([]);
  const [progressDates, setProgressDates] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [groupName, setGroupName] = useState('Nachiketa');
  const [month, setMonth] = useState(getCurrentMonth());

  const fetchReport = async (group: string, month: string) => {
    setIsLoading(true);
    try {
      // Replace with real API call using group & month
      const response = await new Promise<{
        progressDates: string[];
        data: FacilitatorReport[];
      }>((resolve) =>
        setTimeout(() => {
          resolve({
            progressDates: ['3/5/15', '15/5/22', '20/5/15', '18/5/22'],
            data: [
              {
                user_id: 1,
                name: 'Ramesh Sharma',
                mobile_number: '9876543210',
                progress_report_data: [30, 10, 15, 30],
                average: '30',
              },
              {
                user_id: 2,
                name: 'Suresh Patel',
                mobile_number: '9876501234',
                progress_report_data: [31, 15, 20, 30],
                average: '32',
              },
            ],
          });
        }, 500)
      );

      setProgressDates(response.progressDates);
      setData(response.data);
    } catch (err) {
      console.error('Error fetching report', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReport(groupName, month);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = useMemo<MRT_ColumnDef<FacilitatorReport>[]>(() => [
    {
      accessorKey: 'name',
      header: 'Name',
      size: 200,
    },
    {
      accessorKey: 'mobile_number',
      header: 'Phone Number',
      size: 180,
      Cell: ({ row }) => (
        <a
          href={`tel:${row.original.mobile_number}`}
          className="flex transform items-center space-x-4 rounded-lg bg-indigo-900 px-4 py-2 text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-indigo-800"
        >
          <FaPhoneAlt className="text-xl" />
          <span className="text-sm md:text-base">
            {row.original.mobile_number}
          </span>
        </a>
      ),
    },
    ...progressDates.map((date, index) => ({
      header: date,
      accessorFn: (row: FacilitatorReport) =>
        row.progress_report_data?.[index]?.toString() || '-',
      id: `progress_${index}`,
      size: 100,
      Cell: ({ cell }) => {
        const value = cell.getValue() as string;
        return (
          <span className="inline-block rounded bg-blue-100 px-2 py-1 text-blue-800">
            {value !== '-' ? value : '-'}
          </span>
        );
      },
    })),
    {
      accessorKey: 'average',
      header: 'Monthly Avg',
      size: 100,
      Cell: ({ row }) => (
        <span className="inline-block rounded bg-green-100 px-2 py-1 text-green-800">
          {row.original.average}
        </span>
      ),
    },
  ], [progressDates]);

  // Handler for row clicks
  const handleRowClick = (row: FacilitatorReport) => {
    router.push('/admin/facilitatorUserReport');
  };

  return (
    <div className="mt-10">
      <h2 className="mb-5 text-xl font-bold text-gray-800 dark:text-white">
        Facilitator Report
      </h2>

      {/* Filters */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchReport(groupName, month);
        }}
        className="mb-2 flex flex-wrap justify-end gap-2"
      >
        <select
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="w-48 rounded-lg border border-gray-300 bg-gray-100 p-2 text-sm text-gray-900"
        >
          {groupList.map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>

        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-48 rounded-lg border border-gray-300 bg-gray-100 p-2 text-sm text-gray-900"
        >
          {monthList.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="rounded-lg bg-blue-900 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
        >
          Apply Filter
        </button>
      </form>

      <div className="rounded-lg bg-white p-5 shadow-xl">
        <MaterialReactTable
          columns={columns}
          data={data}
          enableSorting
          state={{ isLoading }}
          getRowId={(row) =>
            row?.user_id ? row.user_id.toString() : Math.random().toString()
          }
          // Attach onClick to each row
          muiTableBodyRowProps={({ row }) => ({
            onClick: () => handleRowClick(row.original),
            style: { cursor: 'pointer' },
          })}
          muiTablePaperProps={{ sx: { overflow: 'visible !important' } }}
          muiTableBodyCellProps={{ sx: { overflow: 'visible' } }}
        />
      </div>
    </div>
  );
};

export default FacilitatorReportDas;

// 'use client';

// import { useEffect, useMemo, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
// import { toast, ToastContainer } from 'react-toastify';
// import { fetchAllStudents, getdashboardReport } from 'services/apiCollection';
// import { FaCheckCircle, FaPhoneAlt, FaTimesCircle } from 'react-icons/fa';
// import PaymentStatus from './PaymentStatus';
// import Reports from '../Reports';
// import 'react-toastify/dist/ReactToastify.css';

// type AllStudent = {
//   user_id: number;
//   name: string;
//   mobile_number: string;
//   payment_mode: string;
//   registration_date: string;
//   payment_status: string;
// };

// const CallingSystem = () => {
//   const [data, setData] = useState<AllStudent[]>([]);
//   const [selectedRowData, setSelectedRowData] = useState<AllStudent | null>(
//     null,
//   );
//   const [opens, setOpens] = useState(false);
//   const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [report, setReport] = useState<any>(null);

//   const router = useRouter();

//   const fetchData = async () => {
//     try {
//       setIsLoading(true);
//       const [studentsRes, dashboardReport] = await Promise.all([
//         fetchAllStudents(),
//         getdashboardReport(),
//       ]);
//       setData(studentsRes.students);
//       setReport(dashboardReport[0]);
//     } catch (err) {
//       console.error('Error fetching data:', err);
//       toast.error('Failed to load data');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const AllStudentColumns = useMemo<MRT_ColumnDef<AllStudent>[]>(
//     () => [
//       { accessorKey: 'name', header: 'Name', size: 180 },
//       { accessorKey: 'mobile_number', header: 'Phone Number', size: 80,Cell: ({ row }) => (
//               <a
//                 href={`tel:${row.original.mobile_number}`}
//                 className="flex items-center space-x-4 px-4 py-2 rounded-lg bg-indigo-900 text-white hover:bg-indigo-800 transition duration-300 ease-in-out transform hover:scale-105"
//               >
//                 <FaPhoneAlt className="text-xl" />
//                 <span className="text-sm md:text-base">{row.original.mobile_number}</span>
//               </a>
//             ), },
//       { accessorKey: 'payment_mode', header: 'Payment Mode', size: 80 },
//       {
//         accessorKey: 'registration_date',
//         header: 'Registration Date',
//         size: 80,
//       },
//       {
//         accessorKey: 'payment_status',
//         header: 'Payment Status',
//         size: 150,
//         Cell: ({ row, cell }) => {
//           const value = cell.getValue<string>();
//           const user = row.original;

//           const paymentStatusMap: Record<string, string> = {
//             received: 'Received',
//             not_received: 'Not Received',
//           };

//           const handleClick = () => {
//             if (value === 'not_received') {
//               setSelectedRowData(user);
//               setOpens(true);
//             }
//           };

//           return (
//             <span
//               onClick={handleClick}
//               style={{
//                 color: value === 'received' ? 'green' : 'red',
//                 fontWeight: 'bold',
//                 cursor: value === 'not_received' ? 'pointer' : 'default',
//                 display: 'flex',
//                 alignItems: 'center',
//               }}
//             >
//               {value === 'received' ? (
//                 <FaCheckCircle style={{ marginRight: '8px' }} />
//               ) : (
//                 <FaTimesCircle style={{ marginRight: '8px' }} />
//               )}
//               {paymentStatusMap[value] || value}
//             </span>
//           );
//         },
//       },
//     ],
//     [],
//   );

//   const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const isChecked = e.target.checked;
//     if (isChecked) {
//       router.push('/admin/dashboard/facilitator-frontliner');
//     }
//   };

//   if (isLoading) {
//     return <div className="mt-6 px-6 text-lg dark:bg-white">Loading...</div>;
//   }

//   return (
//     <>
//       <ToastContainer />
//       <div className="mt-4">
//         <h2 className="mb-5 text-lg font-bold dark:text-white">Dashboard Report</h2>
//         <Reports report={report} />
//         <div className="mb-5 mt-6 rounded-md bg-white p-5 shadow-2xl">
//           {/* Toggle Button */}
//           <div className="mb-4 mt-1 flex justify-end">
//             <label className="inline-flex cursor-pointer items-center">
//               <input
//                 type="checkbox"
//                 className="peer sr-only"
//                 onChange={handleToggle}
//               />
//               <div
//                 className="peer relative h-7 w-14 rounded-full bg-gray-200
//                   after:absolute after:start-[4px] after:top-0.5 after:h-6
//                   after:w-6 after:rounded-full after:border after:border-gray-300
//                   after:bg-white after:transition-all after:content-['']
//                   peer-checked:bg-blue-900 peer-checked:after:translate-x-full
//                   peer-checked:after:border-white peer-focus:outline-none
//                   peer-focus:ring-4 peer-focus:ring-blue-800 dark:border-gray-600
//                   dark:bg-gray-700 dark:peer-checked:bg-blue-900
//                   dark:peer-focus:ring-blue-800 rtl:peer-checked:after:-translate-x-full"
//               />
//             </label>
//           </div>

//           <h2 className="mb-5 mt-4 text-lg font-bold">Registration</h2>
//           <MaterialReactTable
//             columns={AllStudentColumns}
//             data={data}
//             enableSorting
//             enableRowSelection={false}
//             onRowSelectionChange={setRowSelection}
//             state={{ rowSelection }}
//             getRowId={(row) => row.user_id.toString()}
//             muiTableHeadCellProps={{
//               sx: {
//                 backgroundColor: '#312e81',
//                 color: 'white',
//                 fontSize: '16px',
//                 fontWeight: 'bold',
//                 borderRadius: '2px',
//               },
//             }}
//           />
//         </div>
//       </div>

//       <PaymentStatus
//         isOpens={opens}
//         closeModal={() => setOpens(false)}
//         selectedRow={selectedRowData}
//         onSuccess={fetchData}
//       />
//     </>
//   );
// };

// export default CallingSystem;



'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { toast, ToastContainer } from 'react-toastify';
import {
  fetchAllFacilitatorOrFrontliner,
  getdashboardReport,
} from 'services/apiCollection';
import Reports from '../Reports';
import { FaPhoneAlt } from 'react-icons/fa';

type Frontliner = {
  user_id: number;
  name: string;
  phone_number: string;
  role: string;
};

const CallingSystem = () => {
  const [frontliners, setFrontliners] = useState<Frontliner[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<any>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [frontlinerRes, dashboardReport] = await Promise.all([
          fetchAllFacilitatorOrFrontliner(),
          getdashboardReport(),
        ]);

        // Filter to only include items where role is 'frontliner'
        const filteredFrontliners = frontlinerRes.filter(
          (item: Frontliner) => item.role === 'frontliner'
        );
        setFrontliners(filteredFrontliners);

        setReport(dashboardReport[0]);
      } catch (err) {
        console.error('Error fetching data:', err);
        toast.error('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const frontlinerColumns = useMemo<MRT_ColumnDef<Frontliner>[]>(() => [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'phone_number', header: 'Phone Number',Cell: ({ row }) => (
                    <a
                      href={`tel:${row.original.phone_number}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center space-x-5 px-6   py-2 rounded-lg bg-indigo-900 text-white hover:bg-indigo-800 transition duration-300 ease-in-out transform hover:scale-105"
                    >
                      <FaPhoneAlt className="text-xl" />
                      <span className="text-sm md:text-base">{row.original.phone_number}</span>
                    </a>
                  ), },
    // { accessorKey: 'role', header: 'Role' },
  ], []);

  const handleFrontlinerClick = (frontliner: Frontliner) => {
    router.push(`/admin/dashboard/facilitator-frontliner/${frontliner.user_id}`);
  };

  if (isLoading) {
    return <div className="mt-6 px-6 text-lg dark:bg-white">Loading...</div>;
  }

  return (
    <>
      <ToastContainer />
      <div className="mt-8">
        <h2 className="mb-5 text-lg font-bold dark:text-white">
          Dashboard Report
        </h2>

        <Reports report={report} />

        <div className="mb-5 mt-0 rounded-md bg-white p-5 shadow-2xl">
          <MaterialReactTable
            columns={frontlinerColumns}
            data={frontliners}
            enableSorting
            muiTableHeadCellProps={{
              sx: {
                backgroundColor: '#312e81',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                borderRadius: '2px',
              },
            }}
            muiTableBodyRowProps={({ row }) => ({
              onClick: () => handleFrontlinerClick(row.original),
              style: { cursor: 'pointer' },
            })}
          />
        </div>
      </div>
    </>
  );
};

export default CallingSystem;

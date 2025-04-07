// 'use client';

// import { useEffect, useMemo, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
// import { toast, ToastContainer } from 'react-toastify';
// import {
//   fetchAllFacilitatorOrFrontliner,
//   updateCallingId,
//   getFrontlinerReport,
//   frontlinerStudentByIdOfcallingId,
// } from 'services/apiCollection';
// import { FaCheckCircle, FaPhoneAlt, FaTimesCircle } from 'react-icons/fa';
// import { Autocomplete, TextField } from '@mui/material';
// import ResponseModal from 'components/allifycomponents/callingSystem/ResponseModal';
// import PaymentStatus from 'components/allifycomponents/callingSystem/PaymentStatus';
// import Reports from 'components/allifycomponents/Reports';

// interface Student {
//   user_id: number;
//   name: string;
//   mobile_number: string;
//   payment_mode: string;
//   registration_date: string;
//   student_status: string;
//   student_status_date: string;
//   profession: string;
//   payment_status: string;
// }

// interface Frontliner {
//   user_id: number;
//   name: string;
//   phone_number: string;
//   role: string;
// }

// const FrontlinerCallingPage = () => {
//   const [frontliners, setFrontliners] = useState<Frontliner[]>([]);
//   const [frontlinerStudents, setFrontlinerStudents] = useState<Student[]>([]);
//   const [frontlinerReport, setFrontlinerReport] = useState<any>(null);
//   const [selectedRow, setSelectedRow] = useState<Student | null>(null);
//   const [open, setOpen] = useState(false);
//   const [opens, setOpens] = useState(false);
//   const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
//   const [selectedFrontliner, setSelectedFrontliner] = useState<Frontliner | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const { id: frontlinerId } = useParams();
//   const router = useRouter();

//   const fetchData = async () => {
//     try {
//       setIsLoading(true);
//       const [frontlinerRes, reportRes, studentRes] = await Promise.all([
//         fetchAllFacilitatorOrFrontliner(),
//         getFrontlinerReport(frontlinerId),
//         frontlinerStudentByIdOfcallingId(frontlinerId),
//       ]);
//       setFrontliners(frontlinerRes);
//       setFrontlinerReport(reportRes[0]);
//       setFrontlinerStudents(studentRes.data);
//     } catch (err) {
//       console.error('Error fetching data:', err);
//       toast.error('Failed to load data');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (frontlinerId) fetchData();
//   }, [frontlinerId]);

//   const refreshStudentAndReport = async () => {
//     if (frontlinerId) {
//       const [studentRes, reportRes] = await Promise.all([
//         frontlinerStudentByIdOfcallingId(frontlinerId),
//         getFrontlinerReport(frontlinerId),
//       ]);
//       setFrontlinerStudents(studentRes.data);
//       setFrontlinerReport(reportRes[0]);
//     }
//   };

//   const studentColumns = useMemo<MRT_ColumnDef<Student>[]>(() => [
//     { accessorKey: 'name', header: 'Name', size: 180 },
//     { accessorKey: 'mobile_number', header: 'Phone Number', size: 80 , Cell: ({ row }) => (
//       <a
//         href={`tel:${row.original.mobile_number}`}
//         className="flex items-center space-x-4 px-4 py-2 rounded-lg bg-indigo-900 text-white hover:bg-indigo-800 transition duration-300 ease-in-out transform hover:scale-105"
//       >
//         <FaPhoneAlt className="text-xl" />
//         <span className="text-sm md:text-base">{row.original.mobile_number}</span>
//       </a>
//     ),},
//     { accessorKey: 'payment_mode', header: 'Payment Mode', size: 80 },
//     {
//       accessorKey: 'registration_date',
//       header: 'Registration Date',
//       size: 80,
//     },
//     { accessorKey: 'profession', header: 'Profession', size: 80 },
//     {
//       accessorKey: 'student_status_date',
//       header: 'Student Status Date',
//       size: 80,
//     },
//     {
//       accessorKey: 'student_status',
//       header: 'Student Status',
//       size: 80,
//       Cell: ({ cell }) => {
//         const value = cell.getValue<string>();
//         const statusMap: Record<string, string> = {
//           will_come: 'Will Come',
//           not_interested: 'Not Interested',
//           busy: 'Busy',
//           might_come: 'Might Come',
//         };
//         return <span>{statusMap[value] || value}</span>;
//       },
//     },
//     {
//       accessorKey: 'response',
//       header: 'Calling Response',
//       size: 150,
//       Cell: ({ row }) => (
//         <button
//           onClick={(e) => {
//             e.stopPropagation();
//             setSelectedRow(row.original);
//             setOpen(true);
//           }}
//           className="rounded bg-indigo-900 px-3 py-1 text-white hover:bg-indigo-800"
//         >
//           Respond
//         </button>
//       ),
//     },
//     {
//       accessorKey: 'payment_status',
//       header: 'Payment Status',
//       size: 150,
//       Cell: ({ row, cell }) => {
//         const value = cell.getValue<string>();
//         const user = row.original;

//         const paymentStatusMap: Record<string, string> = {
//           received: 'Received',
//           not_received: 'Not Received',
//         };

//         const handleClick = () => {
//           if (value === 'not_received') {
//             setSelectedRow(user);
//             setOpens(true);
//           }
//         };

//         return (
//           <span
//             onClick={handleClick}
//             style={{
//               color: value === 'received' ? 'green' : 'red',
//               fontWeight: 'bold',
//               cursor: value === 'not_received' ? 'pointer' : 'default',
//               display: 'flex',
//               alignItems: 'center',
//             }}
//           >
//             {value === 'received' ? (
//               <FaCheckCircle style={{ marginRight: '8px' }} />
//             ) : (
//               <FaTimesCircle style={{ marginRight: '8px' }} />
//             )}
//             {paymentStatusMap[value] || value}
//           </span>
//         );
//       },
//     },
//   ], []);

//   const handleAssign = async () => {
//     const selectedUserIds = frontlinerStudents
//       .filter((row) => rowSelection[row.user_id.toString()])
//       .map((row) => row.user_id);

//     if (!selectedUserIds.length || !selectedFrontliner) {
//       toast.error('Please select at least one student and ensure a frontliner is selected');
//       return;
//     }

//     try {
//       setIsLoading(true);
//       await updateCallingId(selectedUserIds, String(selectedFrontliner.user_id));
//       toast.success('Calling ID assigned successfully!');

//       await refreshStudentAndReport();

//       // Clear selected checkboxes
//       setRowSelection({});
//     } catch (err) {
//       console.error(err);
//       toast.error('Failed to assign calling ID');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <>
//       <ToastContainer />
//       <div className="mt-8">
//         <div className="mb-6 flex justify-end">
//           <button
//             onClick={() => router.back()}
//             className="rounded-md bg-red-800 px-4 py-2 text-white hover:bg-red-700"
//           >
//             ← Back
//           </button>
//         </div>
//         <h2 className="mb-5 text-lg font-bold dark:text-white">Frontliner Report</h2>

//         <Reports report={frontlinerReport} />

//         <div className="mb-5 rounded-md bg-white p-5 shadow-2xl">
//           <div className="mx-auto mb-5 flex w-full flex-col rounded-md bg-white p-5 shadow-2xl md:flex-row">
//             <Autocomplete
//               id="frontliner-select"
//               options={frontliners.filter(
//                 (f) => String(f.user_id) !== String(frontlinerId)
//               )}

//               loading={isLoading}
//               getOptionLabel={(option) =>
//                 `${option.user_id} - ${option.name} (${option.role})`
//               }
//               onChange={(_, newValue) => setSelectedFrontliner(newValue)}
//               className="w-full md:flex-grow"
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   label="Select Frontliner and Facilitator"
//                   placeholder="Search..."
//                   fullWidth
//                 />
//               )}
//             />

//             <button
//               type="button"
//               onClick={handleAssign}
//               className="mt-4 rounded-lg bg-indigo-900 px-8 py-3.5 text-lg text-white hover:bg-indigo-800 md:ml-2 md:mt-0"
//             >
//               {isLoading ? 'Assigning...' : 'Assign'}
//             </button>
//           </div>

//           <MaterialReactTable
//             columns={studentColumns}
//             data={frontlinerStudents}
//             enableSorting
//             enableRowSelection
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
//         selectedRow={selectedRow}
//         onSuccess={refreshStudentAndReport}
//       />

//       <ResponseModal
//         isOpen={open}
//         closeModal={() => setOpen(false)}
//         selectedRow={selectedRow}
//         onSuccess={refreshStudentAndReport}
//       />
//     </>
//   );
// };

// export default FrontlinerCallingPage;










// 'use client';

// import { useEffect, useMemo, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
// import { toast, ToastContainer } from 'react-toastify';
// import {
//   fetchAllFacilitatorOrFrontliner,
//   updateCallingId,
//   getFrontlinerReport,
//   frontlinerStudentByIdOfcallingId,
//   frontlinerStudentById,
// } from 'services/apiCollection';
// import { FaCheckCircle, FaPhoneAlt, FaTimesCircle } from 'react-icons/fa';
// import { Autocomplete, TextField } from '@mui/material';
// import ResponseModal from 'components/allifycomponents/callingSystem/ResponseModal';
// import PaymentStatus from 'components/allifycomponents/callingSystem/PaymentStatus';
// import Reports from 'components/allifycomponents/Reports';

// interface Student {
//   user_id: number;
//   name: string;
//   mobile_number: string;
//   payment_mode: string;
//   registration_date: string;
//   student_status: string;
//   student_status_date: string;
//   profession: string;
//   payment_status: string;
// }

// interface Frontliner {
//   user_id: number;
//   name: string;
//   phone_number: string;
//   role: string;
// }

// const FrontlinerCallingPage = () => {
//   const [frontliners, setFrontliners] = useState<Frontliner[]>([]);
//   const [allfrontlinerStudents, setAllFrontlinerStudents] = useState<Student[]>(
//     [],
//   );
//   const [callingStudents, setCallingStudents] = useState<Student[]>([]);
//   const [frontlinerReport, setFrontlinerReport] = useState<any>(null);
//   const [selectedRow, setSelectedRow] = useState<Student | null>(null);
//   const [open, setOpen] = useState(false);
//   const [opens, setOpens] = useState(false);
//   const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
//   const [selectedFrontliner, setSelectedFrontliner] =
//     useState<Frontliner | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showCallingTable, setShowCallingTable] = useState(false);

//   const { id: frontlinerId } = useParams();
//   const router = useRouter();

//   const fetchData = async () => {
//     try {
//       setIsLoading(true);
//       const [frontlinerRes, reportRes, allstudentRes] = await Promise.all([
//         fetchAllFacilitatorOrFrontliner(),
//         getFrontlinerReport(frontlinerId),
//         frontlinerStudentById(frontlinerId),
//       ]);
//       setFrontliners(frontlinerRes);
//       setFrontlinerReport(reportRes[0]);
//       setAllFrontlinerStudents(allstudentRes.users);
//     } catch (err) {
//       console.error('Error fetching data:', err);
//       toast.error('Failed to load data');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (frontlinerId) fetchData();
//   }, [frontlinerId]);

//   const refreshStudentAndReport = async () => {
//     if (frontlinerId) {
//       const [allstudentRes, reportRes] = await Promise.all([
//         frontlinerStudentById(frontlinerId),
//         getFrontlinerReport(frontlinerId),
//       ]);
//       setAllFrontlinerStudents(allstudentRes.users);
//       setFrontlinerReport(reportRes[0]);
//     }
//   };
//   const refreshStudentAndReports = async () => {
//     if (frontlinerId) {
//       const [allstudentRess, reportRes] = await Promise.all([
//         frontlinerStudentByIdOfcallingId(frontlinerId),
//         getFrontlinerReport(frontlinerId),
//       ]);
//       setAllFrontlinerStudents(allstudentRess.data);
//       setFrontlinerReport(reportRes[0]);
//     }
//   };

//   const handleToggle = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const isChecked = e.target.checked;
//     setShowCallingTable(isChecked);

//     if (isChecked && frontlinerId) {
//       try {
//         setIsLoading(true);
//         const res = await frontlinerStudentByIdOfcallingId(frontlinerId);
//         setCallingStudents(res.data);
//       } catch (err) {
//         console.error(err);
//         toast.error('Failed to load calling ID students');
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   };

//   const allstudentColumns = useMemo<MRT_ColumnDef<Student>[]>(
//     () => [
//       { accessorKey: 'name', header: 'Name', size: 180 },
//       {
//         accessorKey: 'mobile_number',
//         header: 'Phone Number',
//         size: 80,
//         Cell: ({ row }) => (
//           <a
//             href={`tel:${row.original.mobile_number}`}
//             className="flex transform items-center space-x-4 rounded-lg bg-indigo-900 px-4 py-2 text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-indigo-800"
//           >
//             <FaPhoneAlt className="text-xl" />
//             <span className="text-sm md:text-base">
//               {row.original.mobile_number}
//             </span>
//           </a>
//         ),
//       },
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
//               setSelectedRow(user);
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

//   const callingStudentColumns = useMemo<MRT_ColumnDef<Student>[]>(
//     () => [
//       { accessorKey: 'name', header: 'Name' },
//       { accessorKey: 'profession', header: 'Profession' },
//       {
//         accessorKey: 'student_status',
//         header: 'Student Status',
//         Cell: ({ cell }) => {
//           const value = cell.getValue<string>();
//           const statusMap: Record<string, string> = {
//             will_come: 'Will Come',
//             not_interested: 'Not Interested',
//             busy: 'Busy',
//             might_come: 'Might Come',
//           };
//           return <span>{statusMap[value] || value}</span>;
//         },
//       },
//       {
//         accessorKey: 'response',
//         header: 'Calling Response',
//         Cell: ({ row }) => (
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               setSelectedRow(row.original);
//               setOpen(true);
//             }}
//             className="rounded bg-indigo-900 px-3 py-1 text-white hover:bg-indigo-800"
//           >
//             Respond
//           </button>
//         ),
//       },
//       { accessorKey: 'student_status_date', header: 'Last Calling Date' },
//       {
//         accessorKey: 'mobile_number',
//         header: 'Phone Number',
//         size: 80,
//         Cell: ({ row }) => (
//           <a
//             href={`tel:${row.original.mobile_number}`}
//             className="flex transform items-center space-x-4 rounded-lg bg-indigo-900 px-4 py-2 text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-indigo-800"
//           >
//             <FaPhoneAlt className="text-xl" />
//             <span className="text-sm md:text-base">
//               {row.original.mobile_number}
//             </span>
//           </a>
//         ),
//       },
//     ],
//     [],
//   );

//   const handleAssign = async () => {
//     const selectedUserIds = callingStudents
//       .filter((row) => rowSelection[row.user_id.toString()])
//       .map((row) => row.user_id);

//     if (!selectedUserIds.length || !selectedFrontliner) {
//       toast.error(
//         'Please select at least one student and ensure a frontliner is selected',
//       );
//       return;
//     }

//     try {
//       setIsLoading(true);
//       await updateCallingId(
//         selectedUserIds,
//         String(selectedFrontliner.user_id),
//       );
//       toast.success('Calling ID assigned successfully!');
//       await refreshStudentAndReport();
//       const res = await frontlinerStudentByIdOfcallingId(frontlinerId);
//       setCallingStudents(res.data);
//       setRowSelection({});
//     } catch (err) {
//       console.error(err);
//       toast.error('Failed to assign calling ID');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <>
//       <ToastContainer />
//       <div className="mt-8">
//         <div className="mb-6 flex justify-end">
//           <button
//             onClick={() => router.back()}
//             className="rounded-md bg-red-800 px-4 py-2 text-white hover:bg-red-700"
//           >
//             ← Back
//           </button>
//         </div>

//         <h2 className="mb-5 text-lg font-bold dark:text-white">
//           Frontliner Report
//         </h2>
//         <Reports report={frontlinerReport} />

//         <div className="mb-5 rounded-md bg-white p-5 shadow-2xl">
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

//           {!showCallingTable && (
//             <MaterialReactTable
//               columns={allstudentColumns}
//               data={allfrontlinerStudents}
//               enableSorting
//               onRowSelectionChange={setRowSelection}
//               state={{ rowSelection }}
//               getRowId={(row) => row.user_id.toString()}
//               muiTableHeadCellProps={{
//                 sx: {
//                   backgroundColor: '#312e81',
//                   color: 'white',
//                   fontSize: '16px',
//                   fontWeight: 'bold',
//                   borderRadius: '2px',
//                 },
//               }}
//             />
//           )}

//           {showCallingTable && (
//             <>
//               <div className="mx-auto mb-5 flex w-full flex-col rounded-md bg-white p-5 shadow-2xl md:flex-row">
//                 <Autocomplete
//                   id="frontliner-select"
//                   options={frontliners.filter(
//                     (f) => String(f.user_id) !== String(frontlinerId),
//                   )}
//                   loading={isLoading}
//                   getOptionLabel={(option) =>
//                     `${option.user_id} - ${option.name} (${option.role})`
//                   }
//                   onChange={(_, newValue) => setSelectedFrontliner(newValue)}
//                   className="w-full md:flex-grow"
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       label="Select Frontliner and Facilitator"
//                       placeholder="Search..."
//                       fullWidth
//                     />
//                   )}
//                 />
//                 <button
//                   type="button"
//                   onClick={handleAssign}
//                   className="mt-4 rounded-lg bg-indigo-900 px-8 py-3.5 text-lg text-white hover:bg-indigo-800 md:ml-2 md:mt-0"
//                 >
//                   {isLoading ? 'Assigning...' : 'Assign'}
//                 </button>
//               </div>

//               <MaterialReactTable
//                 columns={callingStudentColumns}
//                 data={callingStudents}
//                 enableSorting
//                 enableRowSelection
//                 onRowSelectionChange={setRowSelection}
//                 state={{ rowSelection }}
//                 getRowId={(row) => row.user_id.toString()}
//                 muiTableHeadCellProps={{
//                   sx: {
//                     backgroundColor: '#312e81',
//                     color: 'white',
//                     fontSize: '16px',
//                     fontWeight: 'bold',
//                     borderRadius: '2px',
//                   },
//                 }}
//               />
//             </>
//           )}
//         </div>
//       </div>

//       <PaymentStatus
//         isOpens={opens}
//         closeModal={() => setOpens(false)}
//         selectedRow={selectedRow}
//         onSuccess={refreshStudentAndReport}
//       />

//       <ResponseModal
//         isOpen={open}
//         closeModal={() => setOpen(false)}
//         selectedRow={selectedRow}
//         onSuccess={refreshStudentAndReports}
//       />
//     </>
//   );
// };

// export default FrontlinerCallingPage;




'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { toast, ToastContainer } from 'react-toastify';
import {
  fetchAllFacilitatorOrFrontliner,
  updateCallingId,
  getFrontlinerReport,
  frontlinerStudentByIdOfcallingId,
  frontlinerStudentById,
} from 'services/apiCollection';
import { FaCheckCircle, FaPhoneAlt, FaTimesCircle } from 'react-icons/fa';
import { Autocomplete, TextField } from '@mui/material';
import ResponseModal from 'components/allifycomponents/callingSystem/ResponseModal';
import PaymentStatus from 'components/allifycomponents/callingSystem/PaymentStatus';
import Reports from 'components/allifycomponents/Reports';

interface Student {
  user_id: number;
  name: string;
  mobile_number: string;
  payment_mode: string;
  registration_date: string;
  student_status: string;
  student_status_date: string;
  profession: string;
  payment_status: string;
}

interface Frontliner {
  user_id: number;
  name: string;
  phone_number: string;
  role: string;
}

const FrontlinerCallingPage = () => {
  const [frontliners, setFrontliners] = useState<Frontliner[]>([]);
  const [allfrontlinerStudents, setAllFrontlinerStudents] = useState<Student[]>([]);
  const [callingStudents, setCallingStudents] = useState<Student[]>([]);
  const [frontlinerReport, setFrontlinerReport] = useState<any>(null);
  const [selectedRow, setSelectedRow] = useState<Student | null>(null);
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [selectedFrontliner, setSelectedFrontliner] = useState<Frontliner | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCallingTable, setShowCallingTable] = useState(false);

  const { id: frontlinerId } = useParams();
  const router = useRouter();

  const fetchData = useCallback(async () => {
    if (!frontlinerId) return;
    setIsLoading(true);
    try {
      const [frontlinerRes, reportRes, allstudentRes] = await Promise.all([
        fetchAllFacilitatorOrFrontliner(),
        getFrontlinerReport(frontlinerId),
        frontlinerStudentById(frontlinerId),
      ]);
      setFrontliners(frontlinerRes);
      setFrontlinerReport(reportRes[0]);
      setAllFrontlinerStudents(allstudentRes.users);
    } catch (err) {
      console.error('Error fetching data:', err);
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  }, [frontlinerId]);

  useEffect(() => {
    if (frontlinerId) fetchData();
  }, [frontlinerId, fetchData]);

  const refreshStudentAndReport = useCallback(async () => {
    if (!frontlinerId) return;
    try {
      const [allstudentRes, reportRes] = await Promise.all([
        frontlinerStudentById(frontlinerId),
        getFrontlinerReport(frontlinerId),
      ]);
      setAllFrontlinerStudents(allstudentRes.users);
      setFrontlinerReport(reportRes[0]);
    } catch (err) {
      console.error(err);
      toast.error('Failed to refresh data');
    }
  }, [frontlinerId]);

  const refreshStudentAndReports = useCallback(async () => {
    if (!frontlinerId) return;
    try {
      const [allstudentResss, reportRes] = await Promise.all([
        frontlinerStudentByIdOfcallingId(frontlinerId),
        getFrontlinerReport(frontlinerId),
      ]);
      setAllFrontlinerStudents(allstudentResss.data);
      setFrontlinerReport(reportRes[0]);
    } catch (err) {
      console.error(err);
      toast.error('Failed to refresh data');
    }
  }, [frontlinerId]);

  const handleToggle = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = e.target.checked;
      setShowCallingTable(isChecked);

      if (isChecked && frontlinerId) {
        setIsLoading(true);
        try {
          const res = await frontlinerStudentByIdOfcallingId(frontlinerId);
          setCallingStudents(res.data);
        } catch (err) {
          console.error(err);
          toast.error('Failed to load calling ID students');
        } finally {
          setIsLoading(false);
        }
      }
    },
    [frontlinerId],
  );

  const handleAssign = useCallback(async () => {
    if (!selectedFrontliner) {
      toast.error('Please select a frontliner');
      return;
    }
    const selectedUserIds = callingStudents
      .filter((row) => rowSelection[row.user_id.toString()])
      .map((row) => row.user_id);

    if (!selectedUserIds.length) {
      toast.error('Please select at least one student');
      return;
    }

    setIsLoading(true);
    try {
      await updateCallingId(selectedUserIds, String(selectedFrontliner.user_id));
      toast.success('Calling ID assigned successfully!');
      await refreshStudentAndReport();
      if (frontlinerId) {
        const res = await frontlinerStudentByIdOfcallingId(frontlinerId);
        setCallingStudents(res.data);
      }
      setRowSelection({});
    } catch (err) {
      console.error(err);
      toast.error('Failed to assign calling ID');
    } finally {
      setIsLoading(false);
    }
  }, [callingStudents, rowSelection, selectedFrontliner, refreshStudentAndReport, frontlinerId]);

  const allstudentColumns = useMemo<MRT_ColumnDef<Student>[]>(
    () => [
      { accessorKey: 'name', header: 'Name', size: 180 },
      {
        accessorKey: 'mobile_number',
        header: 'Phone Number',
        size: 80,
        Cell: ({ row }) => (
          <a
            href={`tel:${row.original.mobile_number}`}
            className="flex transform items-center space-x-4 rounded-lg bg-indigo-900 px-4 py-2 text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-indigo-800"
          >
            <FaPhoneAlt className="text-xl" />
            <span className="text-sm md:text-base">{row.original.mobile_number}</span>
          </a>
        ),
      },
      { accessorKey: 'payment_mode', header: 'Payment Mode', size: 80 },
      { accessorKey: 'registration_date', header: 'Registration Date', size: 80 },
      {
        accessorKey: 'payment_status',
        header: 'Payment Status',
        size: 150,
        Cell: ({ row, cell }) => {
          const value = cell.getValue<string>();
          const user = row.original;
          const paymentStatusMap: Record<string, string> = {
            received: 'Received',
            not_received: 'Not Received',
          };

          const handleClick = () => {
            if (value === 'not_received') {
              setSelectedRow(user);
              setPaymentModalOpen(true);
            }
          };

          return (
            <span
              onClick={handleClick}
              style={{
                color: value === 'received' ? 'green' : 'red',
                fontWeight: 'bold',
                cursor: value === 'not_received' ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {value === 'received' ? (
                <FaCheckCircle style={{ marginRight: '8px' }} />
              ) : (
                <FaTimesCircle style={{ marginRight: '8px' }} />
              )}
              {paymentStatusMap[value] || value}
            </span>
          );
        },
      },
    ],
    [],
  );

  const callingStudentColumns = useMemo<MRT_ColumnDef<Student>[]>(
    () => [
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'profession', header: 'Profession' },
      {
        accessorKey: 'student_status',
        header: 'Student Status',
        Cell: ({ cell }) => {
          const value = cell.getValue<string>();
          const statusMap: Record<string, string> = {
            will_come: 'Will Come',
            not_interested: 'Not Interested',
            busy: 'Busy',
            might_come: 'Might Come',
          };
          return <span>{statusMap[value] || value}</span>;
        },
      },
      {
        accessorKey: 'response',
        header: 'Calling Response',
        Cell: ({ row }) => (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedRow(row.original);
              setResponseModalOpen(true);
            }}
            className="rounded bg-indigo-900 px-3 py-1 text-white hover:bg-indigo-800"
          >
            Respond
          </button>
        ),
      },
      { accessorKey: 'student_status_date', header: 'Last Calling Date' },
      {
        accessorKey: 'mobile_number',
        header: 'Phone Number',
        size: 80,
        Cell: ({ row }) => (
          <a
            href={`tel:${row.original.mobile_number}`}
            className="flex transform items-center space-x-4 rounded-lg bg-indigo-900 px-4 py-2 text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-indigo-800"
          >
            <FaPhoneAlt className="text-xl" />
            <span className="text-sm md:text-base">{row.original.mobile_number}</span>
          </a>
        ),
      },
    ],
    [],
  );

  return (
    <>
      <ToastContainer />
      <div className="mt-8">
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => router.back()}
            className="rounded-md bg-red-800 px-4 py-2 text-white hover:bg-red-700"
          >
            ← Back
          </button>
        </div>

        <h2 className="mb-5 text-lg font-bold dark:text-white">Frontliner Report</h2>
        <Reports report={frontlinerReport} />

        <div className="mb-5 rounded-md bg-white p-5 shadow-2xl">
          <div className="mb-4 mt-1 flex justify-end">
            <label className="inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                className="peer sr-only"
                onChange={handleToggle}
              />
              <div
                className="peer relative h-7 w-14 rounded-full bg-gray-200
                  after:absolute after:start-[4px] after:top-0.5 after:h-6
                  after:w-6 after:rounded-full after:border after:border-gray-300
                  after:bg-white after:transition-all after:content-['']
                  peer-checked:bg-blue-900 peer-checked:after:translate-x-full
                  peer-checked:after:border-white peer-focus:outline-none
                  peer-focus:ring-4 peer-focus:ring-blue-800 dark:border-gray-600
                  dark:bg-gray-700 dark:peer-checked:bg-blue-900
                  dark:peer-focus:ring-blue-800 rtl:peer-checked:after:-translate-x-full"
              />
            </label>
          </div>

          {!showCallingTable ? (
            <MaterialReactTable
              columns={allstudentColumns}
              data={allfrontlinerStudents}
              enableSorting
              onRowSelectionChange={setRowSelection}
              state={{ rowSelection }}
              getRowId={(row) => row.user_id.toString()}
              muiTableHeadCellProps={{
                sx: {
                  backgroundColor: '#312e81',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  borderRadius: '2px',
                },
              }}
            />
          ) : (
            <>
              <div className="mx-auto mb-5 flex w-full flex-col rounded-md bg-white p-5 shadow-2xl md:flex-row">
                <Autocomplete
                  id="frontliner-select"
                  options={frontliners.filter(
                    (f) => String(f.user_id) !== String(frontlinerId),
                  )}
                  loading={isLoading}
                  getOptionLabel={(option) =>
                    `${option.user_id} - ${option.name} (${option.role})`
                  }
                  onChange={(_, newValue) => setSelectedFrontliner(newValue)}
                  className="w-full md:flex-grow"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Frontliner and Facilitator"
                      placeholder="Search..."
                      fullWidth
                    />
                  )}
                />
                <button
                  type="button"
                  onClick={handleAssign}
                  className="mt-4 rounded-lg bg-indigo-900 px-8 py-3.5 text-lg text-white hover:bg-indigo-800 md:ml-2 md:mt-0"
                >
                  {isLoading ? 'Assigning...' : 'Assign'}
                </button>
              </div>

              <MaterialReactTable
                columns={callingStudentColumns}
                data={callingStudents}
                enableSorting
                enableRowSelection
                onRowSelectionChange={setRowSelection}
                state={{ rowSelection }}
                getRowId={(row) => row.user_id.toString()}
                muiTableHeadCellProps={{
                  sx: {
                    backgroundColor: '#312e81',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    borderRadius: '2px',
                  },
                }}
              />
            </>
          )}
        </div>
      </div>

      <PaymentStatus
        isOpens={paymentModalOpen}
        closeModal={() => setPaymentModalOpen(false)}
        selectedRow={selectedRow}
        onSuccess={refreshStudentAndReport}
      />

      <ResponseModal
        isOpen={responseModalOpen}
        closeModal={() => setResponseModalOpen(false)}
        selectedRow={selectedRow}
        onSuccess={refreshStudentAndReports}
      />
    </>
  );
};

export default FrontlinerCallingPage;

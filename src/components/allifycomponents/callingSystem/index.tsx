// 'use client';

// import { useEffect, useMemo, useState } from 'react';
// import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
// import { Autocomplete, TextField } from '@mui/material';
// import { toast } from 'react-toastify';
// import {
//   fetchAllStudents,
//   fetchDashboardAccounts,
//   frontlinerStudentById,
//   updateCallingId,
// } from 'services/apiCollection';
// import PaymentStatus from './PaymentStatus';
// import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

// // Student type
// type Student = {
//   user_id: number;
//   name: string;
//   mobile_number: string;
//   payment_mode: string;
//   registration_date: string;
//   payment_status: string;
// };

// type Frontliner = {
//   user_id: number;
//   name: string;
//   phone_number: string;
//   role: string;
// };

// const CallingSystem = () => {
//   const [data, setData] = useState<Student[]>([]);
//   const [selectedRow, setSelectedRow] = useState<Student | null>(null);
//   const [open, setOpen] = useState(false);
//   const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
//   const [frontliners, setFrontliners] = useState<Frontliner[]>([]);
//   const [selectedFrontliner, setSelectedFrontliner] =
//     useState<Frontliner | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showAssignmentUI, setShowAssignmentUI] = useState(false);

//   const [role, setRole] = useState(null);

//   useEffect(() => {
//     const storedRole = localStorage.getItem('role');
//     setRole(storedRole);
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true);
//         const frontlinerId = localStorage.getItem('frontlinerId');

//         const [studentsRes, frontlinerRes] = await Promise.all([
//           // frontlinerStudentById(frontlinerId),
//           fetchAllStudents(),
//           fetchDashboardAccounts(),
//         ]);

//         // setData(studentsRes.users);
//         setData(studentsRes.students);
//         setFrontliners(frontlinerRes);
//       } catch (err) {
//         console.error('Error fetching data:', err);
//         toast.error('Failed to load data');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const columns = useMemo<MRT_ColumnDef<Student>[]>(
//     () => [
//       { accessorKey: 'name', header: 'Name', size: 200 },
//       { accessorKey: 'mobile_number', header: 'Phone Number', size: 150 },
//       { accessorKey: 'payment_mode', header: 'Payment Mode', size: 150 },
//       {
//         accessorKey: 'registration_date',
//         header: 'Registration Date',
//         size: 150,
//       },
//       {
//         accessorKey: 'payment_status',
//         header: 'Payment Status',
//         size: 150,
//         Cell: ({ row, cell }) => {
//           const value = cell.getValue<string>();
//           const user = row.original;

//           const handleClick = () => {
//             if (value === 'not_received') {
//               setSelectedRow(user);
//               setOpen(true);
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
//               {value}
//             </span>
//           );
//         },
//       },
//     ],
//     [],
//   );

//   const handleAssign = async () => {
//     const selectedUserIds = data
//       .filter((row) => rowSelection[row.user_id.toString()])
//       .map((row) => row.user_id);

//     if (!selectedUserIds.length || !selectedFrontliner) {
//       toast.error('Please select at least one student and a frontliner');
//       return;
//     }

//     const callingId = `${selectedFrontliner.user_id}`;

//     try {
//       setIsLoading(true);
//       await updateCallingId(selectedUserIds, callingId);
//       toast.success('Calling ID assigned successfully!');
//     } catch (err) {
//       console.error(err);
//       toast.error('Failed to assign calling ID');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (isLoading) {
//     return <div className="mt-6 px-6 text-lg dark:bg-white">Loading...</div>;
//   }

//   return (
//     <>
//       <div className="mt-12">
//         <h2 className="mb-3 text-lg font-bold dark:text-white">
//           {showAssignmentUI ? <> Calling System</> : <>Registration</>}
//         </h2>

//         <div className="mb-5 mt-0 rounded-md bg-white p-5 shadow-2xl">
//           {/* Toggle Button */}
//           {role === 'frontliner' ? (
//             <></>
//           ) : (
//             <>
//               <div className="mb-4 mt-1 flex justify-end">
//                 <label className="inline-flex cursor-pointer items-center">
//                   <input
//                     type="checkbox"
//                     className="peer sr-only"
//                     checked={showAssignmentUI}
//                     onChange={(e) => setShowAssignmentUI(e.target.checked)}
//                   />
//                   <div className="peer relative h-7 w-14 rounded-full bg-gray-200 after:absolute after:start-[4px] after:top-0.5 after:h-6 after:w-6 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-900 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 dark:border-gray-600 dark:bg-gray-700 dark:peer-checked:bg-blue-900 dark:peer-focus:ring-blue-800 rtl:peer-checked:after:-translate-x-full" />
//                 </label>
//               </div>
//             </>
//           )}

//           {/* Frontliner Selector */}
//           {showAssignmentUI && (
//             <div className="mx-auto mb-5 flex w-full flex-col rounded-md bg-white p-5 shadow-2xl md:flex-row">
//               <Autocomplete
//                 id="frontliner-select"
//                 options={frontliners}
//                 loading={isLoading}
//                 getOptionLabel={(option) =>
//                   `${option.user_id} - ${option.name} (${option.role})`
//                 }
//                 onChange={(event, newValue) => setSelectedFrontliner(newValue)}
//                 className="w-full md:flex-grow"
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     label="Select Frontliner"
//                     placeholder="Search..."
//                     fullWidth
//                   />
//                 )}
//               />

//               <button
//                 type="button"
//                 onClick={handleAssign}
//                 className="mt-4 rounded-lg bg-indigo-900 bg-gradient-to-br px-8 py-3.5 text-center text-lg font-medium text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 md:ml-2 md:mt-0"
//               >
//                 {isLoading ? 'Assigning...' : 'Assign'}
//               </button>
//             </div>
//           )}

//           {/* Table */}
//           <MaterialReactTable
//             columns={columns}
//             data={data}
//             enableSorting
//             enableRowSelection={showAssignmentUI}
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
//         isOpen={role !== 'frontliner' && open} // Only open if role is not 'frontliner'
//         closeModal={() => setOpen(false)}
//         selectedRow={selectedRow}
//         onSuccess={fetchAllStudents}
//       />
//     </>
//   );
// };

// export default CallingSystem;






// 'use client';

// import { useEffect, useMemo, useState } from 'react';
// import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
// import { Autocomplete, TextField } from '@mui/material';
// import { toast } from 'react-toastify';
// import {
//   fetchAllStudents,
//   fetchDashboardAccounts,
//   updateCallingId,
// } from 'services/apiCollection';
// import PaymentStatus from './PaymentStatus';
// import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

// // Student type
// type Student = {
//   user_id: number;
//   name: string;
//   mobile_number: string;
//   payment_mode: string;
//   registration_date: string;
//   payment_status: string;
// };

// type Frontliner = {
//   user_id: number;
//   name: string;
//   phone_number: string;
//   role: string;
// };

// const CallingSystem = () => {
//   const [data, setData] = useState<Student[]>([]);
//   const [selectedRow, setSelectedRow] = useState<Student | null>(null);
//   const [open, setOpen] = useState(false);
//   const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
//   const [frontliners, setFrontliners] = useState<Frontliner[]>([]);
//   const [selectedFrontliner, setSelectedFrontliner] =
//     useState<Frontliner | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showAssignmentUI, setShowAssignmentUI] = useState(false);



//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true);

//         const [studentsRes, frontlinerRes] = await Promise.all([
//           fetchAllStudents(),
//           fetchDashboardAccounts(),
//         ]);

//         // setData(studentsRes.users);
//         setData(studentsRes.students);
//         setFrontliners(frontlinerRes);
//       } catch (err) {
//         console.error('Error fetching data:', err);
//         toast.error('Failed to load data');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const columns = useMemo<MRT_ColumnDef<Student>[]>(
//     () => [
//       { accessorKey: 'name', header: 'Name', size: 200 },
//       { accessorKey: 'mobile_number', header: 'Phone Number', size: 150 },
//       { accessorKey: 'payment_mode', header: 'Payment Mode', size: 150 },
//       {
//         accessorKey: 'registration_date',
//         header: 'Registration Date',
//         size: 150,
//       },
//       {
//         accessorKey: 'payment_status',
//         header: 'Payment Status',
//         size: 150,
//         Cell: ({ row, cell }) => {
//           const value = cell.getValue<string>();
//           const user = row.original;

//           const handleClick = () => {
//             if (value === 'not_received') {
//               setSelectedRow(user);
//               setOpen(true);
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
//               {value}
//             </span>
//           );
//         },
//       },
//     ],
//     [],
//   );

//   const handleAssign = async () => {
//     const selectedUserIds = data
//       .filter((row) => rowSelection[row.user_id.toString()])
//       .map((row) => row.user_id);

//     if (!selectedUserIds.length || !selectedFrontliner) {
//       toast.error('Please select at least one student and a frontliner');
//       return;
//     }

//     const callingId = `${selectedFrontliner.user_id}`;

//     try {
//       setIsLoading(true);
//       await updateCallingId(selectedUserIds, callingId);
//       toast.success('Calling ID assigned successfully!');
//     } catch (err) {
//       console.error(err);
//       toast.error('Failed to assign calling ID');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (isLoading) {
//     return <div className="mt-6 px-6 text-lg dark:bg-white">Loading...</div>;
//   }

//   return (
//     <>
//       <div className="mt-12">
//         <h2 className="mb-3 text-lg font-bold dark:text-white">
//           {showAssignmentUI ? <> Calling System</> : <>Registration</>}
//         </h2>

//         <div className="mb-5 mt-0 rounded-md bg-white p-5 shadow-2xl">
//           {/* Toggle Button */}
    
//               <div className="mb-4 mt-1 flex justify-end">
//                 <label className="inline-flex cursor-pointer items-center">
//                   <input
//                     type="checkbox"
//                     className="peer sr-only"
//                     checked={showAssignmentUI}
//                     onChange={(e) => setShowAssignmentUI(e.target.checked)}
//                   />
//                   <div className="peer relative h-7 w-14 rounded-full bg-gray-200 after:absolute after:start-[4px] after:top-0.5 after:h-6 after:w-6 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-900 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 dark:border-gray-600 dark:bg-gray-700 dark:peer-checked:bg-blue-900 dark:peer-focus:ring-blue-800 rtl:peer-checked:after:-translate-x-full" />
//                 </label>
//               </div>
      

//           {/* Frontliner Selector */}
//           {showAssignmentUI && (
//             <div className="mx-auto mb-5 flex w-full flex-col rounded-md bg-white p-5 shadow-2xl md:flex-row">
//               <Autocomplete
//                 id="frontliner-select"
//                 options={frontliners}
//                 loading={isLoading}
//                 getOptionLabel={(option) =>
//                   `${option.user_id} - ${option.name} (${option.role})`
//                 }
//                 onChange={(event, newValue) => setSelectedFrontliner(newValue)}
//                 className="w-full md:flex-grow"
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     label="Select Frontliner"
//                     placeholder="Search..."
//                     fullWidth
//                   />
//                 )}
//               />

//               <button
//                 type="button"
//                 onClick={handleAssign}
//                 className="mt-4 rounded-lg bg-indigo-900 bg-gradient-to-br px-8 py-3.5 text-center text-lg font-medium text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 md:ml-2 md:mt-0"
//               >
//                 {isLoading ? 'Assigning...' : 'Assign'}
//               </button>
//             </div>
//           )}

//           {/* Table */}
//           <MaterialReactTable
//             columns={columns}
//             data={data}
//             enableSorting
//             enableRowSelection={showAssignmentUI}
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
//         isOpen={open} // Only open if role is not 'frontliner'
//         closeModal={() => setOpen(false)}
//         selectedRow={selectedRow}
//         onSuccess={fetchAllStudents}
//       />
//     </>
//   );
// };

// export default CallingSystem;



// 'use client';

// import { useEffect, useMemo, useState } from 'react';
// import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
// import { Autocomplete, TextField } from '@mui/material';
// import { toast } from 'react-toastify';
// import {
//   fetchAllStudents,
//   fetchDashboardAccounts,
//   updateCallingId,
// } from 'services/apiCollection';
// import PaymentStatus from './PaymentStatus';
// import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

// // Student type
// type Student = {
//   user_id: number;
//   name: string;
//   mobile_number: string;
//   payment_mode: string;
//   registration_date: string;
//   payment_status: string;
// };

// type Frontliner = {
//   user_id: number;
//   name: string;
//   phone_number: string;
//   role: string;
// };

// const CallingSystem = () => {
//   const [data, setData] = useState<(Student | Frontliner)[]>([]);
//   const [frontliners, setFrontliners] = useState<Frontliner[]>([]);
//   const [selectedRow, setSelectedRow] = useState<Student | null>(null);
//   const [open, setOpen] = useState(false);
//   const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
//   const [selectedFrontliner, setSelectedFrontliner] = useState<Frontliner | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showAssignmentUI, setShowAssignmentUI] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true);
//         const [studentsRes, frontlinerRes] = await Promise.all([
//           fetchAllStudents(),
//           fetchDashboardAccounts(),
//         ]);
//         setData(studentsRes.students);
//         setFrontliners(frontlinerRes);
//       } catch (err) {
//         console.error('Error fetching data:', err);
//         toast.error('Failed to load data');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     if (showAssignmentUI) {
//       // अगर toggle ऑन है तो table में frontliners दिखाओ
//       setData(frontliners);
//     } else {
//       // नहीं तो students दिखाओ
//       fetchAllStudents()
//         .then((res) => setData(res.students))
//         .catch(() => toast.error('Failed to fetch students'));
//     }
//   }, [showAssignmentUI, frontliners]);

//   const columns = useMemo<MRT_ColumnDef<any>[]>(() => {
//     if (showAssignmentUI) {
//       // Frontliners View
//       return [
//         { accessorKey: 'user_id', header: 'ID' },
//         { accessorKey: 'name', header: 'Name' },
//         { accessorKey: 'phone_number', header: 'Phone Number' },
//         { accessorKey: 'role', header: 'Role' },
//       ];
//     } else {
//       // Students View
//       return [
//         { accessorKey: 'name', header: 'Name', size: 200 },
//         { accessorKey: 'mobile_number', header: 'Phone Number', size: 150 },
//         { accessorKey: 'payment_mode', header: 'Payment Mode', size: 150 },
//         {
//           accessorKey: 'registration_date',
//           header: 'Registration Date',
//           size: 150,
//         },
//         {
//           accessorKey: 'payment_status',
//           header: 'Payment Status',
//           size: 150,
//           Cell: ({ row, cell }) => {
//             const value = cell.getValue<string>();
//             const user = row.original;

//             const handleClick = () => {
//               if (value === 'not_received') {
//                 setSelectedRow(user);
//                 setOpen(true);
//               }
//             };

//             return (
//               <span
//                 onClick={handleClick}
//                 style={{
//                   color: value === 'received' ? 'green' : 'red',
//                   fontWeight: 'bold',
//                   cursor: value === 'not_received' ? 'pointer' : 'default',
//                   display: 'flex',
//                   alignItems: 'center',
//                 }}
//               >
//                 {value === 'received' ? (
//                   <FaCheckCircle style={{ marginRight: '8px' }} />
//                 ) : (
//                   <FaTimesCircle style={{ marginRight: '8px' }} />
//                 )}
//                 {value}
//               </span>
//             );
//           },
//         },
//       ];
//     }
//   }, [showAssignmentUI]);

//   const handleAssign = async () => {
//     const selectedUserIds = data
//       .filter((row: any) => rowSelection[row.user_id.toString()])
//       .map((row: any) => row.user_id);

//     if (!selectedUserIds.length || !selectedFrontliner) {
//       toast.error('Please select at least one student and a frontliner');
//       return;
//     }

//     const callingId = `${selectedFrontliner.user_id}`;

//     try {
//       setIsLoading(true);
//       await updateCallingId(selectedUserIds, callingId);
//       toast.success('Calling ID assigned successfully!');
//     } catch (err) {
//       console.error(err);
//       toast.error('Failed to assign calling ID');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleRowClick = (row: any) => {
//     if (showAssignmentUI) {
//       setSelectedFrontliner(row);
//     }
//   };

//   if (isLoading) {
//     return <div className="mt-6 px-6 text-lg dark:bg-white">Loading...</div>;
//   }

//   return (
//     <>
//       <div className="mt-12">
//         <h2 className="mb-3 text-lg font-bold dark:text-white">
//           {showAssignmentUI ? <>Calling System</> : <>Registration</>}
//         </h2>

//         <div className="mb-5 mt-0 rounded-md bg-white p-5 shadow-2xl">
//           {/* Toggle Button */}
//           <div className="mb-4 mt-1 flex justify-end">
//             <label className="inline-flex cursor-pointer items-center">
//               <input
//                 type="checkbox"
//                 className="peer sr-only"
//                 checked={showAssignmentUI}
//                 onChange={(e) => setShowAssignmentUI(e.target.checked)}
//               />
//               <div className="peer relative h-7 w-14 rounded-full bg-gray-200 after:absolute after:start-[4px] after:top-0.5 after:h-6 after:w-6 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-900 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 dark:border-gray-600 dark:bg-gray-700 dark:peer-checked:bg-blue-900 dark:peer-focus:ring-blue-800 rtl:peer-checked:after:-translate-x-full" />
//             </label>
//           </div>

//           {/* Frontliner Selector */}
//           {showAssignmentUI && (
//             <div className="mx-auto mb-5 flex w-full flex-col rounded-md bg-white p-5 shadow-2xl md:flex-row">
//               <Autocomplete
//                 id="frontliner-select"
//                 options={frontliners}
//                 loading={isLoading}
//                 getOptionLabel={(option) =>
//                   `${option.user_id} - ${option.name} (${option.role})`
//                 }
//                 onChange={(event, newValue) => setSelectedFrontliner(newValue)}
//                 className="w-full md:flex-grow"
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     label="Select Frontliner"
//                     placeholder="Search..."
//                     fullWidth
//                   />
//                 )}
//               />

//               <button
//                 type="button"
//                 onClick={handleAssign}
//                 className="mt-4 rounded-lg bg-indigo-900 bg-gradient-to-br px-8 py-3.5 text-center text-lg font-medium text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 md:ml-2 md:mt-0"
//               >
//                 {isLoading ? 'Assigning...' : 'Assign'}
//               </button>
//             </div>
//           )}

//           {/* Table */}
//           <MaterialReactTable
//   columns={columns}
//   data={data}
//   enableSorting
//   // enableRowSelection={showAssignmentUI}
//   onRowSelectionChange={setRowSelection}
//   state={{ rowSelection }}
//   getRowId={(row) => row.user_id.toString()}
//   muiTableHeadCellProps={{
//     sx: {
//       backgroundColor: '#312e81',
//       color: 'white',
//       fontSize: '16px',
//       fontWeight: 'bold',
//       borderRadius: '2px',
//     },
//   }}
//   muiTableBodyRowProps={({ row }) => ({
//     onClick: () => handleRowClick(row.original),
//     style: { cursor: 'pointer' },
//   })}
// />

//         </div>
//       </div>

//       <PaymentStatus
//         isOpen={open}
//         closeModal={() => setOpen(false)}
//         selectedRow={selectedRow}
//         onSuccess={fetchAllStudents}
//       />
//     </>
//   );
// };

// export default CallingSystem;



// 'use client';

// import { useEffect, useMemo, useState } from 'react';
// import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
// import { toast } from 'react-toastify';
// import {
//   fetchAllStudents,
//   fetchDashboardAccounts,
//   updateCallingId,
//   getFrontlinerReport,
//   frontlinerStudentById,
// } from 'services/apiCollection';
// import PaymentStatus from './PaymentStatus';
// import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

// type Student = {
//   user_id: number;
//   name: string;
//   mobile_number: string;
//   payment_mode: string;
//   registration_date: string;
//   payment_status: string;
// };

// type Frontliner = {
//   user_id: number;
//   name: string;
//   phone_number: string;
//   role: string;
// };

// const CallingSystem = () => {
//   const [data, setData] = useState<Student[]>([]);
//   const [frontliners, setFrontliners] = useState<Frontliner[]>([]);
//   const [frontlinerStudents, setFrontlinerStudents] = useState<Student[]>([]);
//   const [frontlinerReport, setFrontlinerReport] = useState<any>(null);
//   const [selectedRow, setSelectedRow] = useState<Student | null>(null);
//   const [open, setOpen] = useState(false);
//   const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
//   const [selectedFrontliner, setSelectedFrontliner] = useState<Frontliner | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showAssignmentUI, setShowAssignmentUI] = useState(false);

//   // Initial fetch for students and frontliners
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true);
//         const [studentsRes, frontlinerRes] = await Promise.all([
//           fetchAllStudents(),
//           fetchDashboardAccounts(),
//         ]);
//         setData(studentsRes.students);
//         setFrontliners(frontlinerRes);
//       } catch (err) {
//         console.error('Error fetching data:', err);
//         toast.error('Failed to load data');
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   // When toggling assignment mode, clear selections and API data.
//   useEffect(() => {
//     if (!showAssignmentUI) {
//       // Normal view: show students
//       fetchAllStudents()
//         .then((res) => setData(res.students))
//         .catch(() => toast.error('Failed to fetch students'));
//       setSelectedFrontliner(null);
//       setFrontlinerStudents([]);
//       setFrontlinerReport(null);
//       setRowSelection({});
//     }
//   }, [showAssignmentUI]);

//   // Columns for students table (Registration view or frontliner students)
//   const studentColumns = useMemo<MRT_ColumnDef<Student>[]>(() => [
//     { accessorKey: 'name', header: 'Name', size: 200 },
//     { accessorKey: 'mobile_number', header: 'Phone Number', size: 150 },
//     { accessorKey: 'payment_mode', header: 'Payment Mode', size: 150 },
//     { accessorKey: 'registration_date', header: 'Registration Date', size: 150 },
//     {
//       accessorKey: 'payment_status',
//       header: 'Payment Status',
//       size: 150,
//       Cell: ({ row, cell }) => {
//         const value = cell.getValue<string>();
//         const user = row.original;
//         const handleClick = () => {
//           if (value === 'not_received') {
//             setSelectedRow(user);
//             setOpen(true);
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
//             {value}
//           </span>
//         );
//       },
//     },
//   ], []);

//   // Columns for frontliner selection table
//   const frontlinerColumns = useMemo<MRT_ColumnDef<Frontliner>[]>(() => [
//     { accessorKey: 'user_id', header: 'ID' },
//     { accessorKey: 'name', header: 'Name' },
//     { accessorKey: 'phone_number', header: 'Phone Number' },
//     { accessorKey: 'role', header: 'Role' },
//   ], []);

//   // When a frontliner row is clicked, call both APIs.
//   const handleFrontlinerClick = async (frontliner: Frontliner) => {
//     setSelectedFrontliner(frontliner);
//     try {
//       setIsLoading(true);
//       const studentRes = await frontlinerStudentById(frontliner.user_id);
//       setFrontlinerStudents(studentRes.students);
//       const reportRes = await getFrontlinerReport(frontliner.user_id);
//       setFrontlinerReport(reportRes);
//     } catch (error) {
//       console.error(error);
//       toast.error('Failed to fetch frontliner details');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // For assigning calling ID from frontliner student view.
//   const handleAssign = async () => {
//     const selectedUserIds = frontlinerStudents
//       .filter((row) => rowSelection[row.user_id.toString()])
//       .map((row) => row.user_id);

//     if (!selectedUserIds.length || !selectedFrontliner) {
//       toast.error('Please select at least one student and ensure a frontliner is selected');
//       return;
//     }

//     const callingId = `${selectedFrontliner.user_id}`;

//     try {
//       setIsLoading(true);
//       await updateCallingId(selectedUserIds, callingId);
//       toast.success('Calling ID assigned successfully!');
//     } catch (err) {
//       console.error(err);
//       toast.error('Failed to assign calling ID');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (isLoading) {
//     return <div className="mt-6 px-6 text-lg dark:bg-white">Loading...</div>;
//   }

//   return (
//     <>
//       <div className="mt-12">
//         <h2 className="mb-3 text-lg font-bold dark:text-white">
//           {showAssignmentUI ? (
//             selectedFrontliner ? (
//               <>Calling System - {selectedFrontliner.name}</>
//             ) : (
//               <>Select a Frontliner</>
//             )
//           ) : (
//             <>Registration</>
//           )}
//         </h2>

//         <div className="mb-5 mt-0 rounded-md bg-white p-5 shadow-2xl">
//           {/* Toggle Button */}
//           <div className="mb-4 mt-1 flex justify-end">
//             <label className="inline-flex cursor-pointer items-center">
//               <input
//                 type="checkbox"
//                 className="peer sr-only"
//                 checked={showAssignmentUI}
//                 onChange={(e) => {
//                   setShowAssignmentUI(e.target.checked);
//                   setSelectedFrontliner(null);
//                   setFrontlinerStudents([]);
//                   setFrontlinerReport(null);
//                   setRowSelection({});
//                 }}
//               />
//               <div className="peer relative h-7 w-14 rounded-full bg-gray-200 after:absolute after:start-[4px] after:top-0.5 after:h-6 after:w-6 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-900 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 dark:border-gray-600 dark:bg-gray-700 dark:peer-checked:bg-blue-900 dark:peer-focus:ring-blue-800 rtl:peer-checked:after:-translate-x-full" />
//             </label>
//           </div>

//           {showAssignmentUI ? (
//             selectedFrontliner ? (
//               <>
//                 {/* Report Boxes from getFrontlinerReport() */}
//                 <div className="grid grid-cols-2 gap-4 mb-4">
//                   <div className="p-4 bg-gray-100 rounded">
//                     {frontlinerReport?.box1 || 'Box 1'}
//                   </div>
//                   <div className="p-4 bg-gray-100 rounded">
//                     {frontlinerReport?.box2 || 'Box 2'}
//                   </div>
//                   <div className="p-4 bg-gray-100 rounded">
//                     {frontlinerReport?.box3 || 'Box 3'}
//                   </div>
//                   <div className="p-4 bg-gray-100 rounded">
//                     {frontlinerReport?.box4 || 'Box 4'}
//                   </div>
//                 </div>

//                 {/* Frontliner Student Table with checkboxes */}
//                 <MaterialReactTable
//                   columns={studentColumns}
//                   data={frontlinerStudents}
//                   enableSorting
//                   enableRowSelection
//                   onRowSelectionChange={setRowSelection}
//                   state={{ rowSelection }}
//                   getRowId={(row) => row.user_id.toString()}
//                   muiTableHeadCellProps={{
//                     sx: {
//                       backgroundColor: '#312e81',
//                       color: 'white',
//                       fontSize: '16px',
//                       fontWeight: 'bold',
//                       borderRadius: '2px',
//                     },
//                   }}
//                 />

//                 <div className="mt-4 flex justify-end">
//                   <button
//                     type="button"
//                     onClick={handleAssign}
//                     className="mt-4 rounded-lg bg-indigo-900 bg-gradient-to-br px-8 py-3.5 text-center text-lg font-medium text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
//                   >
//                     {isLoading ? 'Assigning...' : 'Assign'}
//                   </button>
//                 </div>
//               </>
//             ) : (
//               // Frontliner Table (for selection) without checkboxes.
//               <MaterialReactTable
//                 columns={frontlinerColumns}
//                 data={frontliners}
//                 enableSorting
//                 muiTableHeadCellProps={{
//                   sx: {
//                     backgroundColor: '#312e81',
//                     color: 'white',
//                     fontSize: '16px',
//                     fontWeight: 'bold',
//                     borderRadius: '2px',
//                   },
//                 }}
//                 muiTableBodyRowProps={({ row }) => ({
//                   onClick: () => handleFrontlinerClick(row.original),
//                   style: { cursor: 'pointer' },
//                 })}
//               />
//             )
//           ) : (
//             // Registration view: Students Table
//             <MaterialReactTable
//               columns={studentColumns}
//               data={data}
//               enableSorting
//               enableRowSelection={false}
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
//         </div>
//       </div>

//       <PaymentStatus
//         isOpen={open}
//         closeModal={() => setOpen(false)}
//         selectedRow={selectedRow}
//         onSuccess={fetchAllStudents}
//       />
//     </>
//   );
// };

// export default CallingSystem;



'use client';

import { useEffect, useMemo, useState } from 'react';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { toast } from 'react-toastify';
import {
  fetchAllStudents,
  fetchDashboardAccounts,
  updateCallingId,
  getFrontlinerReport,
  frontlinerStudentById,
} from 'services/apiCollection';
import PaymentStatus from './PaymentStatus';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { Autocomplete, TextField } from '@mui/material';
import ResponseModal from './ResponseModal';
import { FaCalendarCheck, FaClock, FaUsers, FaWallet } from 'react-icons/fa6';

type Student = {
  user_id: number;
  name: string;
  mobile_number: string;
  payment_mode: string;
  registration_date: string;
  student_status: string;
  student_status_date: string;
  profession: string;
  payment_status: string;
};

type Frontliner = {
  user_id: number;
  name: string;
  phone_number: string;
  role: string;
};

const CallingSystem = () => {
  const [data, setData] = useState<Student[]>([]);
  const [frontliners, setFrontliners] = useState<Frontliner[]>([]);
  const [frontlinerStudents, setFrontlinerStudents] = useState<Student[]>([]);
  const [frontlinerReport, setFrontlinerReport] = useState<any>(null);
  const [selectedRow, setSelectedRow] = useState<Student | null>(null);
  const [open, setOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [selectedFrontliner, setSelectedFrontliner] = useState<Frontliner | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAssignmentUI, setShowAssignmentUI] = useState(false);

  // Initial fetch for students and frontliners
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [studentsRes, frontlinerRes] = await Promise.all([
          fetchAllStudents(),
          fetchDashboardAccounts(),
        ]);
        setData(studentsRes.students);
        setFrontliners(frontlinerRes);
      } catch (err) {
        console.error('Error fetching data:', err);
        toast.error('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // When toggling assignment mode, clear selections and API data.
  useEffect(() => {
    if (!showAssignmentUI) {
      // Normal view: show students
      fetchAllStudents()
        .then((res) => setData(res.students))
        .catch(() => toast.error('Failed to fetch students'));
      setSelectedFrontliner(null);
      setFrontlinerStudents([]);
      setFrontlinerReport(null);
      setRowSelection({});
    }
  }, [showAssignmentUI]);

  // Columns for students table (Registration view or frontliner students)
  const studentColumns = useMemo<MRT_ColumnDef<Student>[]>(() => [
    { accessorKey: 'name', header: 'Name', size: 180 },
    { accessorKey: 'mobile_number', header: 'Phone Number', size: 80 },
    { accessorKey: 'payment_mode', header: 'Payment Mode', size: 80 },
    { accessorKey: 'registration_date', header: 'Registration Date', size: 80 },
    { accessorKey: 'profession', header: 'Profession', size: 80 },
    { accessorKey: 'student_status_date', header: 'Student Status Date', size: 80 },
    { accessorKey: 'student_status', header: 'Student Status', size: 80 },
    {
      accessorKey: 'response',
      header: 'Calling Response',
      size: 150,
      Cell: ({ row }) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedRow(row.original);
            setOpen(true);
          }}
          className="rounded bg-indigo-900 px-3 py-1 text-white hover:bg-indigo-800"
        >
          Respond
        </button>
      ),
    },

    {
      accessorKey: 'payment_status',
      header: 'Payment Status',
      size: 150,
      Cell: ({ row, cell }) => {
        const value = cell.getValue<string>();
        const user = row.original;
        const handleClick = () => {
          if (value === 'not_received') {
            setSelectedRow(user);
            setOpen(true);
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
            {value}
          </span>
        );
      },
    },
  ], []);

  // Columns for frontliner selection table
  const frontlinerColumns = useMemo<MRT_ColumnDef<Frontliner>[]>(() => [
    // { accessorKey: 'user_id', header: 'ID' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'phone_number', header: 'Phone Number' },
    { accessorKey: 'role', header: 'Role' },
  ], []);

  // When a frontliner row is clicked, call both APIs.
  const handleFrontlinerClick = async (frontliner: Frontliner) => {
    setSelectedFrontliner(frontliner);
    try {
      setIsLoading(true);

      // Make sure to check if studentRes.students exists
      const studentRes = await frontlinerStudentById(frontliner.user_id);
      setFrontlinerStudents(studentRes.users);  // Default to empty array if undefined

      // getFrontlinerReport
      const reportRes = await getFrontlinerReport(frontliner.user_id);
      setFrontlinerReport(reportRes[0]);  // Default to empty object if undefined
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch frontliner details');
    } finally {
      setIsLoading(false);
    }
  };

  // For assigning calling ID from frontliner student view.
  const handleAssign = async () => {
    const selectedUserIds = frontlinerStudents
      .filter((row) => rowSelection[row.user_id.toString()])
      .map((row) => row.user_id);

    if (!selectedUserIds.length || !selectedFrontliner) {
      toast.error('Please select at least one student and ensure a frontliner is selected');
      return;
    }

    const callingId = `${selectedFrontliner.user_id}`;

    try {
      setIsLoading(true);
      await updateCallingId(selectedUserIds, callingId);
      toast.success('Calling ID assigned successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to assign calling ID');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="mt-6 px-6 text-lg dark:bg-white">Loading...</div>;
  }

  return (
    <>
      <div className="mt-12">
        <h2 className="mb-3 text-lg font-bold dark:text-white">
          {showAssignmentUI ? (
            selectedFrontliner ? (
              <>Calling System - {selectedFrontliner.name}</>
            ) : (
              <>Select a Frontliner</>
            )
          ) : (
            <>Registration</>
          )}
        </h2>

        <div className="mb-5 mt-0 rounded-md bg-white p-5 shadow-2xl">
          {/* Toggle Button */}
          <div className="mb-4 mt-1 flex justify-end">
            <label className="inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={showAssignmentUI}
                onChange={(e) => {
                  setShowAssignmentUI(e.target.checked);
                  setSelectedFrontliner(null);
                  setFrontlinerStudents([]);
                  setFrontlinerReport(null);
                  setRowSelection({});
                }}
              />
              <div className="peer relative h-7 w-14 rounded-full bg-gray-200 after:absolute after:start-[4px] after:top-0.5 after:h-6 after:w-6 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-900 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 dark:border-gray-600 dark:bg-gray-700 dark:peer-checked:bg-blue-900 dark:peer-focus:ring-blue-800 rtl:peer-checked:after:-translate-x-full" />
            </label>
          </div>

          {showAssignmentUI ? (
            selectedFrontliner ? (
              <>
                {/* Report Boxes from getFrontlinerReport() */}
            


<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
  {/* Total Registered */}
  <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex items-center space-x-4">
    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
      <FaUsers className="text-blue-500 dark:text-blue-300" size={24} />
    </div>
    <div>
      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Total Registered</h3>
      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{frontlinerReport.total_register}</p>
    </div>
  </div>

  {/* Total Amount */}
  <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex items-center space-x-4">
    <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
      <FaWallet className="text-green-500 dark:text-green-300" size={24} />
    </div>
    <div>
      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Total Amount</h3>
      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{frontlinerReport.total_amount}</p>
    </div>
  </div>

  {/* Pending Amount */}
  <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex items-center space-x-4">
    <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
      <FaClock className="text-yellow-500 dark:text-yellow-300" size={24} />
    </div>
    <div>
      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Pending Amount</h3>
      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{frontlinerReport.pending_amount}</p>
    </div>
  </div>

  {/* Weekly Registered */}
  <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex items-center space-x-4">
    <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
      <FaCalendarCheck className="text-purple-500 dark:text-purple-300" size={24} />
    </div>
    <div>
      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Weekly Registered</h3>
      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{frontlinerReport.weekly_total_registered_student_number}</p>
    </div>
  </div>
</div>


            <div className="mx-auto mb-5 flex w-full flex-col rounded-md bg-white p-5 shadow-2xl md:flex-row">
              <Autocomplete
                id="frontliner-select"
                options={frontliners}
                loading={isLoading}
                getOptionLabel={(option) =>
                  `${option.user_id} - ${option.name} (${option.role})`
                }
                onChange={(event, newValue) => setSelectedFrontliner(newValue)}
                className="w-full md:flex-grow"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Frontliner"
                    placeholder="Search..."
                    fullWidth
                  />
                )}
              />

              <button
                type="button"
                onClick={handleAssign}
                className="mt-4 rounded-lg bg-indigo-900 bg-gradient-to-br px-8 py-3.5 text-center text-lg font-medium text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 md:ml-2 md:mt-0"
              >
                {isLoading ? 'Assigning...' : 'Assign'}
              </button>
            </div>
                {/* Frontliner Student Table with checkboxes */}
                <MaterialReactTable
                  columns={studentColumns}
                  data={frontlinerStudents ?? []}  // Always pass an array to avoid undefined error
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
            ) : (
              // Frontliner Table (for selection) without checkboxes.
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
            )
          ) : (
            // Registration view: Students Table
            <MaterialReactTable
              columns={studentColumns}
              data={data}
              enableSorting
              enableRowSelection={false}
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
          )}
        </div>
      </div>

      <PaymentStatus
        isOpen={open}
        closeModal={() => setOpen(false)}
        selectedRow={selectedRow}
        onSuccess={fetchAllStudents}
      />
       <ResponseModal
              isOpen={open}
              closeModal={() => setOpen(false)}
              selectedRow={selectedRow}
              onSuccess={frontlinerStudentById}
            />
    </>
  );
};

export default CallingSystem;

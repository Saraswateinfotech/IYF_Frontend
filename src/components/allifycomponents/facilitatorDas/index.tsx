// 'use client';

// import { useEffect, useMemo, useState } from 'react';
// import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
// import { getGroupUserCount, getStudentGroupWise } from 'services/apiCollection';
// import { FaPhoneAlt } from 'react-icons/fa';
// import ChangeGroup from 'components/allifycomponents/facilitators/ChangeGroup';
// import { BsThreeDotsVertical } from 'react-icons/bs';
// import { Users } from 'lucide-react';

// type Student = {
//   user_id: number;
//   name: string;
//   mobile_number: string;
//   profession: string;
// };
// const groupList = [
//   "DYS", "Jagganath", "Nachiketa", "Shadev",
//   "Nakul", "Arjun", "GourangSabha", "Bhima"
// ];

// const darkColors = [
//   "bg-blue-700",
//   "bg-green-700",
//   "bg-yellow-600",
//   "bg-purple-700",
//   "bg-pink-700",
//   "bg-indigo-700",
//   "bg-orange-700",
//   "bg-teal-700",
// ];
// const FacilitatorDas = () => {
//   const facilitatorId = localStorage.getItem('user');

//   const [data, setData] = useState<Student[]>([]);
//   const [selectedRow, setSelectedRow] = useState<Student | null>(null);
//   const [open, setOpen] = useState(false);
//   const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [groupName, setGroupName] = useState('DYS');

//     const [groupData, setGroupData] = useState([]);

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const rawData = await getGroupUserCount();
//         const formatted = groupList.map((group, index) => {
//           const match = rawData.find(d => d.group_name === group);
//           return {
//             group_name: group,
//             total_users: match ? match.total_users : 0,
//             color: darkColors[index % darkColors.length]
//           };
//         });
//         setGroupData(formatted);
//       } catch (err) {
//         console.error('Failed to fetch group count', err);
//       }
//     }

//     fetchData();
//   }, []);

//   const fetchGetStudentGroupWise = async (group_name: string) => {
//     try {
//       setIsLoading(true);
//       const users = await getStudentGroupWise(facilitatorId, group_name);
//       setData(users.users);
//     } catch (err) {
//       console.log('Failed to fetch students by group');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchGetStudentGroupWise(groupName);
//   }, []);

//   const formatProfession = (profession: string) => {
//     switch (profession) {
//       case 'job_candidate':
//         return 'Job Candidate';
//       default:
//         return profession;
//     }
//   };

//   const columns = useMemo<MRT_ColumnDef<Student>[]>(
//     () => [
//       {
//         accessorKey: 'name',
//         header: 'Name',
//         size: 200,
//       },
//       {
//         accessorKey: 'mobile_number',
//         header: 'Phone Number',
//         size: 150,
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
//       {
//         accessorKey: 'Total Report',
//         header: 'Total Report',
//         size: 150,
//         Cell: ({ row }) => (
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               setSelectedRow(row.original);
//               setOpen(true);
//             }}
//             className="rounded bg-indigo-900 px-3 py-1 text-white hover:bg-indigo-800"
//           >
//             <BsThreeDotsVertical size={18} />
//           </button>
//         ),
//       },

//     ],
//     [],
//   );

//   if (isLoading) {
//     return <div className="mt-6 px-6 text-lg dark:bg-white">Loading...</div>;
//   }

//   return (
//     <>
//       <div className="mt-10">

//          <div className="max-w-7xl mx-auto">
//    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
//       {groupData.map((group, idx) => (
//   <div
//     key={idx}
//     className={`rounded-xl shadow-2xl p-4 transition-transform hover:scale-105 duration-300 text-white ${group.color}`}
//   >
//     <div className="flex justify-between items-center">
//       <h2 className="text-xl font-semibold">{group.group_name}</h2>
//       <Users className="w-6 h-6" />
//     </div>
//     <p className="text-4xl font-bold mt-2">{group.total_users}</p>
//   </div>
// ))}

//       </div>
//     </div>

//         <div className="mt-10 mb-4 flex justify-end">
//           <form
//             onSubmit={(e) => {
//               e.preventDefault();
//               fetchGetStudentGroupWise(groupName);
//             }}
//             className="flex max-w-lg justify-end shadow-xl"
//           >
//             <select
//               id="groups"
//               value={groupName}
//               onChange={(e) => setGroupName(e.target.value)}
//               className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-900 focus:ring-blue-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-900 dark:focus:ring-blue-900"
//             >
//               <option disabled>Select a Group</option>
//               <option value="DYS">DYS</option>
//               <option value="Jagganath">Jagganath</option>
//               <option value="Nachiketa">Nachiketa</option>
//               <option value="Shadev">Shadev</option>
//               <option value="Nakul">Nakul</option>
//               <option value="Arjun">Arjun</option>
//               <option value="GourangSabha">GourangSabha</option>
//               <option value="Bhima">Bhima</option>
//             </select>

//             <button
//               type="submit"
//               className="ml-1.5 rounded-lg bg-blue-900 px-4 py-2 font-medium text-white hover:bg-blue-800"
//             >
//               Show
//             </button>
//           </form>
//         </div>

//         <div className="mb-5 mt-0 rounded-md bg-white p-5 shadow-2xl">
//           <MaterialReactTable
//             columns={columns}
//             data={data}
//             enableSorting
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
//             muiTableBodyRowProps={{
//               sx: {
//                 '&:hover': {
//                   backgroundColor: '#f3f4f6',
//                 },
//                 cursor: 'pointer',
//               },
//             }}
//           />
//         </div>
//       </div>

//       <ChangeGroup
//         isOpens={open}
//         closeModal={() => setOpen(false)}
//         selectedRow={selectedRow}
//         onSuccess={() => fetchGetStudentGroupWise(groupName)}
//       />
//     </>
//   );
// };

// export default FacilitatorDas;

// 'use client';

// import { useEffect, useMemo, useState } from 'react';
// import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
// import { getGroupUserCount, getStudentGroupWise } from 'services/apiCollection';
// import { FaPhoneAlt } from 'react-icons/fa';
// import ChangeGroup from 'components/allifycomponents/facilitators/ChangeGroup';
// import { BsThreeDotsVertical } from 'react-icons/bs';
// import { Users } from 'lucide-react';
// import { useRouter } from 'next/router';

// type Student = {
//   user_id: number;
//   name: string;
//   chanting_round: string;
//   action: string;
//   mobile_number: string;
// };

// const groupList = [
//   "DYS", "Jagganath", "Nachiketa", "Shadev",
//   "Nakul", "Arjun", "GourangSabha", "Bhima"
// ];

// const darkColors = [
//   "bg-blue-700",
//   "bg-green-700",
//   "bg-yellow-600",
//   "bg-purple-700",
//   "bg-pink-700",
//   "bg-indigo-700",
//   "bg-orange-700",
//   "bg-teal-700",
// ];

// const monthList = [
//   'Jan', 'Feb', 'Mar', 'Apr',
//   'May', 'Jun', 'Jul', 'Aug',
//   'Sep', 'Oct', 'Nov', 'Dec'
// ];

// const ActionCell = ({ row }) => {
//   const [openPopover, setOpenPopover] = useState(false);
//   const router = useRouter();

//   const togglePopover = (e) => {
//     e.stopPropagation();
//     setOpenPopover((prev) => !prev);
//   };

//   const handleRouteOne = (e) => {
//     e.stopPropagation();
//     router.push(`/route-one/${row.original.user_id}`);
//     setOpenPopover(false);
//   };

//   const handleRouteTwo = (e) => {
//     e.stopPropagation();
//     router.push(`/route-two/${row.original.user_id}`);
//     setOpenPopover(false);
//   };

//   return (
//     <div className="relative">
//       <button
//         onClick={togglePopover}
//         className="rounded bg-indigo-900 px-3 py-1 text-white hover:bg-indigo-800"
//       >
//         <BsThreeDotsVertical size={18} />
//       </button>
//       {openPopover && (
//         <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-md z-10">
//           <button
//             onClick={handleRouteOne}
//             className="block w-full text-left px-4 py-2 hover:bg-gray-100"
//           >
//             Route One
//           </button>
//           <button
//             onClick={handleRouteTwo}
//             className="block w-full text-left px-4 py-2 hover:bg-gray-100"
//           >
//             Route Two
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// const FacilitatorDas = () => {
//   const facilitatorId = localStorage.getItem('frontlinerId');

//   const [data, setData] = useState<Student[]>([]);
//   const [selectedRow, setSelectedRow] = useState<Student | null>(null);
//   const [open, setOpen] = useState(false);
//   const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [groupName, setGroupName] = useState('DYS');
//   const [selectedMonth, setSelectedMonth] = useState('');

//   const [groupData, setGroupData] = useState([]);

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const rawData = await getGroupUserCount(facilitatorId);
//         const formatted = groupList.map((group, index) => {
//           const match = rawData.find(d => d.group_name === group);
//           return {
//             group_name: group,
//             total_users: match ? match.total_users : 0,
//             color: darkColors[index % darkColors.length]
//           };
//         });
//         setGroupData(formatted);
//       } catch (err) {
//         console.error('Failed to fetch group count', err);
//       }
//     }

//     fetchData();
//   }, [facilitatorId]);

//   const fetchGetStudentGroupWise = async (group_name: string) => {
//     try {
//       setIsLoading(true);
//       const users = await getStudentGroupWise(facilitatorId, group_name);
//       setData(users.users);
//     } catch (err) {
//       console.log('Failed to fetch students by group');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchGetStudentGroupWise(groupName);
//   }, []);

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
//     {
//       accessorKey: 'action',
//       header: 'Action',
//       size: 150,
//       Cell: ({ row }) => <ActionCell row={row} />,
//     },
//     // {
//     //   accessorKey: 'action',
//     //   header: 'Action',
//     //   size: 150,
//     //   Cell: ({ row }) => (
//     //     <button
//     //       onClick={(e) => {
//     //         e.stopPropagation();
//     //         setSelectedRow(row.original);
//     //         setOpen(true);
//     //       }}
//     //       className="rounded bg-indigo-900 px-3 py-1 text-white hover:bg-indigo-800"
//     //     >
//     //       <BsThreeDotsVertical size={18} />
//     //     </button>
//     //   ),
//     // },
//   ], []);

//   if (isLoading) {
//     return <div className="mt-6 px-6 text-lg dark:bg-white">Loading...</div>;
//   }

//   return (
//     <>
//       <div className="mt-10">
//         <div className="max-w-7xl mx-auto">
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
//             {groupData.map((group, idx) => (
//               <div
//                 key={idx}
//                 className={`rounded-xl shadow-2xl p-4 transition-transform hover:scale-105 duration-300 text-white ${group.color}`}
//               >
//                 <div className="flex justify-between items-center">
//                   <h2 className="text-xl font-semibold">{group.group_name}</h2>
//                   <Users className="w-6 h-6" />
//                 </div>
//                 <p className="text-4xl font-bold mt-2">{group.total_users}</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="mt-10 mb-4 flex justify-end">
//           <form
//             onSubmit={(e) => {
//               e.preventDefault();
//               fetchGetStudentGroupWise(groupName);
//               // future: can include selectedMonth here
//             }}
//             className="flex flex-wrap gap-3 max-w-2xl justify-end shadow-xl"
//           >
//             <select
//               id="groups"
//               value={groupName}
//               onChange={(e) => setGroupName(e.target.value)}
//               className="block w-48 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-900 focus:ring-blue-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
//             >
//               <option disabled>Select a Group</option>
//               {groupList.map((group) => (
//                 <option key={group} value={group}>
//                   {group}
//                 </option>
//               ))}
//             </select>

//             <select
//               id="month"
//               value={selectedMonth}
//               onChange={(e) => setSelectedMonth(e.target.value)}
//               className="block w-36 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-900 focus:ring-blue-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
//             >
//               <option disabled value="">Select Month</option>
//               {monthList.map((month) => (
//                 <option key={month} value={month}>
//                   {month}
//                 </option>
//               ))}
//             </select>

//             <button
//               type="submit"
//               className="ml-1.5 rounded-lg bg-blue-900 px-4 py-2 font-medium text-white hover:bg-blue-800"
//             >
//               Show
//             </button>
//           </form>
//         </div>

//         <div className="mb-5 mt-0 rounded-md bg-white p-5 shadow-2xl">
//           <MaterialReactTable
//             columns={columns}
//             data={data}
//             enableSorting
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
//             muiTableBodyRowProps={{
//               sx: {
//                 '&:hover': {
//                   backgroundColor: '#f3f4f6',
//                 },
//                 cursor: 'pointer',
//               },
//             }}
//           />
//         </div>
//       </div>
//     </>
//   );
// };

// export default FacilitatorDas;

// 'use client';

// import { useEffect, useMemo, useState } from 'react';
// import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
// import { getGroupUserCount, getStudentGroupWise } from 'services/apiCollection';
// import { FaPhoneAlt } from 'react-icons/fa';
// import { BsThreeDotsVertical } from 'react-icons/bs';
// import { Users } from 'lucide-react';
// import { useRouter } from 'next/navigation';

// type Student = {
//   user_id: number;
//   name: string;
//   chanting_round: string;
//   action: string;
//   mobile_number: string;
// };

// const groupList = [
//   "DYS", "Jagganath", "Nachiketa", "Shadev",
//   "Nakul", "Arjun", "GourangSabha", "Bhima"
// ];

// const darkColors = [
//   "bg-blue-700", "bg-green-700", "bg-yellow-600", "bg-purple-700",
//   "bg-pink-700", "bg-indigo-700", "bg-orange-700", "bg-teal-700"
// ];

// const ActionCell = ({ row }) => {
//   const [openPopover, setOpenPopover] = useState(false);
//   const router = useRouter();

//   const togglePopover = (e) => {
//     e.stopPropagation();
//     setOpenPopover(prev => !prev);
//   };

//   const handleRouteOne = (e) => {
//     e.stopPropagation();
//     router.push(`/user/profile/${row.original.user_id}`);
//     setOpenPopover(false);
//   };

//   const handleRouteTwo = (e) => {
//     e.stopPropagation();
//     router.push(`/user/edit/${row.original.user_id}`);
//     setOpenPopover(false);
//   };

//   return (
// <div className="relative z-50">
//   <button
//     onClick={togglePopover}
//     className="rounded bg-indigo-900 px-3 py-1 text-white hover:bg-indigo-800"
//   >
//     <BsThreeDotsVertical size={18} />
//   </button>
//   {openPopover && (
//     <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-md z-50">
//       <button
//         onClick={handleRouteOne}
//         className="block w-full text-left px-4 py-2 hover:bg-gray-100"
//       >
//         Route One
//       </button>
//       <button
//         onClick={handleRouteTwo}
//         className="block w-full text-left px-4 py-2 hover:bg-gray-100"
//       >
//         Route Two
//       </button>
//     </div>
//   )}
// </div>

//   );
// };

// const FacilitatorDas = () => {
//   const facilitatorId = localStorage.getItem('frontlinerId');

//   const [data, setData] = useState<Student[]>([]);
//   const [groupData, setGroupData] = useState([]);
//   const [selectedRow, setSelectedRow] = useState<Student | null>(null);
//   const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [groupName, setGroupName] = useState('DYS');

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const rawData = await getGroupUserCount(facilitatorId);
//         const formatted = groupList.map((group, index) => {
//           const match = rawData.find(d => d.group_name === group);
//           return {
//             group_name: group,
//             total_users: match ? match.total_users : 0,
//             color: darkColors[index % darkColors.length]
//           };
//         });
//         setGroupData(formatted);
//       } catch (err) {
//         console.error('Failed to fetch group count', err);
//       }
//     }

//     fetchData();
//   }, [facilitatorId]);

//   const fetchGetStudentGroupWise = async (group_name: string) => {
//     try {
//       setIsLoading(true);
//       const users = await getStudentGroupWise(facilitatorId, group_name);
//       setData(users.users);
//     } catch (err) {
//       console.log('Failed to fetch students by group');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchGetStudentGroupWise(groupName);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [groupName]);

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
//     {
//       accessorKey: 'action',
//       header: 'Action',
//       size: 150,
//       Cell: ({ row }) => <ActionCell row={row} />,
//     },
//   ], []);

//   if (isLoading) {
//     return <div className="mt-6 px-6 text-lg dark:bg-white">Loading...</div>;
//   }

//   return (
//     <>
//       <div className="mt-10">
//         <div className="max-w-7xl mx-auto">
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
//             {groupData.map((group, idx) => (
//               <div
//                 key={idx}
//                 className={`rounded-xl shadow-2xl p-4 transition-transform hover:scale-105 duration-300 text-white ${group.color}`}
//               >
//                 <div className="flex justify-between items-center">
//                   <h2 className="text-xl font-semibold">{group.group_name}</h2>
//                   <Users className="w-6 h-6" />
//                 </div>
//                 <p className="text-4xl font-bold mt-2">{group.total_users}</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="mt-10 mb-4 flex justify-end">
//           <form
//             onSubmit={(e) => {
//               e.preventDefault();
//               fetchGetStudentGroupWise(groupName);
//             }}
//             className="flex flex-wrap gap-3 max-w-2xl justify-end shadow-xl"
//           >
//             <select
//               id="groups"
//               value={groupName}
//               onChange={(e) => setGroupName(e.target.value)}
//               className="block w-48 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:bg-gray-700 dark:text-white"
//             >
//               <option disabled>Select a Group</option>
//               {groupList.map((group) => (
//                 <option key={group} value={group}>
//                   {group}
//                 </option>
//               ))}
//             </select>

//             <button
//               type="submit"
//               className="ml-1.5 rounded-lg bg-blue-900 px-4 py-2 font-medium text-white hover:bg-blue-800"
//             >
//               Show
//             </button>
//           </form>
//         </div>

//         <div className="mb-5 mt-0 rounded-md bg-white p-5 shadow-2xl">
//           <MaterialReactTable
//             columns={columns}
//             data={data}
//             enableSorting
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
//             muiTableBodyRowProps={{
//               sx: {
//                 '&:hover': {
//                   backgroundColor: '#f3f4f6',
//                 },
//                 cursor: 'pointer',
//               },
//             }}
//           />
//         </div>
//       </div>
//     </>
//   );
// };

// export default FacilitatorDas;

// 'use client';

// import { useEffect, useMemo, useState } from 'react';
// import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
// import { getGroupUserCount, getStudentGroupWise } from 'services/apiCollection';
// import { FaPhoneAlt } from 'react-icons/fa';
// import { BsThreeDotsVertical } from 'react-icons/bs';
// import { useRouter } from 'next/navigation';
// import { createPortal } from 'react-dom';
// import { Users } from 'lucide-react';

// type Student = {
//   user_id: number;
//   name: string;
//   chanting_round: string;
//   action: string;
//   mobile_number: string;
// };

// const groupList = [
//   'DYS', 'Jagganath', 'Nachiketa', 'Shadev',
//   'Nakul', 'Arjun', 'GourangSabha', 'Bhima',
// ];

// const darkColors = [
//   'bg-blue-700', 'bg-green-700', 'bg-yellow-600', 'bg-purple-700',
//   'bg-pink-700', 'bg-indigo-700', 'bg-orange-700', 'bg-teal-700',
// ];

// const ActionCell = ({ row }: { row: any }) => {
//   const router = useRouter();
//   const [open, setOpen] = useState(false);
//   const [btnPosition, setBtnPosition] = useState({ x: 0, y: 0 });

//   const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
//     e.stopPropagation();
//     const rect = (e.target as HTMLButtonElement).getBoundingClientRect();
//     setBtnPosition({ x: rect.right, y: rect.bottom });
//     setOpen((prev) => !prev);
//   };

//   const handleRouteOne = (e: React.MouseEvent<HTMLButtonElement>) => {
//     e.stopPropagation();
//     router.push(`/user/profile/${row.original.user_id}`);
//     setOpen(false);
//   };

//   const handleRouteTwo = (e: React.MouseEvent<HTMLButtonElement>) => {
//     e.stopPropagation();
//     router.push(`/user/edit/${row.original.user_id}`);
//     setOpen(false);
//   };

//   const popDownMenu = (
//     <div
//       style={{ position: 'fixed', top: btnPosition.y, left: btnPosition.x }}
//       className="z-[9999] mt-2 w-40 bg-white border border-gray-200 rounded shadow-md"
//     >
//       <button
//         onClick={handleRouteOne}
//         className="block w-full px-4 py-2 text-left hover:bg-gray-100"
//       >
//         Route One
//       </button>
//       <button
//         onClick={handleRouteTwo}
//         className="block w-full px-4 py-2 text-left hover:bg-gray-100"
//       >
//         Route Two
//       </button>
//     </div>
//   );

//   return (
//     <>
//       <button
//         onClick={handleToggle}
//         className="rounded bg-indigo-900 px-3 py-1 text-white hover:bg-indigo-800 relative"
//       >
//         <BsThreeDotsVertical size={18} />
//       </button>
//       {open && typeof document !== 'undefined' &&
//         createPortal(popDownMenu, document.body)
//       }
//     </>
//   );
// };

// const FacilitatorDas = () => {
//   const facilitatorId =
//     typeof window !== 'undefined' ? localStorage.getItem('frontlinerId') : null;

//   const [data, setData] = useState<Student[]>([]);
//   const [groupData, setGroupData] = useState<any[]>([]);
//   const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [groupName, setGroupName] = useState('DYS');

//   useEffect(() => {
//     async function fetchData() {
//       if (!facilitatorId) return;
//       try {
//         const rawData = await getGroupUserCount(facilitatorId);
//         const formatted = groupList.map((group, index) => {
//           const match = rawData.find((d: any) => d.group_name === group);
//           return {
//             group_name: group,
//             total_users: match ? match.total_users : 0,
//             color: darkColors[index % darkColors.length],
//           };
//         });
//         setGroupData(formatted);
//       } catch (err) {
//         console.error('Failed to fetch group count', err);
//       }
//     }
//     fetchData();
//   }, [facilitatorId]);

//   const fetchGetStudentGroupWise = async (group_name: string) => {
//     if (!facilitatorId) return;
//     setIsLoading(true);
//     try {
//       const users = await getStudentGroupWise(facilitatorId, group_name);
//       setData(users.users);
//     } catch (err) {
//       console.log('Failed to fetch students by group');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (groupName) {
//       fetchGetStudentGroupWise(groupName);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [groupName]);

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
//     {
//       accessorKey: 'action',
//       header: 'Action',
//       size: 150,
//       Cell: ({ row }) => <ActionCell row={row} />,
//     },
//   ], []);

//   if (isLoading) {
//     return (
//       <div className="mt-6 px-6 text-lg dark:bg-white">
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <div className="mt-10">
//       <div className="max-w-7xl mx-auto">
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
//           {groupData.map((group, idx) => (
//             <div
//               key={idx}
//               className={`rounded-xl shadow-2xl p-4 transition-transform hover:scale-105 duration-300 text-white ${group.color}`}
//             >
//               <div className="flex justify-between items-center">
//                 <h2 className="text-xl font-semibold">{group.group_name}</h2>
//                 <Users className="w-6 h-6" />
//               </div>
//               <p className="text-4xl font-bold mt-2">{group.total_users}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="mt-10 mb-4 flex justify-end">
//         <form
//           onSubmit={(e) => {
//             e.preventDefault();
//             fetchGetStudentGroupWise(groupName);
//           }}
//           className="flex flex-wrap gap-3 max-w-2xl justify-end shadow-xl"
//         >
//           <select
//             id="groups"
//             value={groupName}
//             onChange={(e) => setGroupName(e.target.value)}
//             className="block w-48 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:bg-gray-700 dark:text-white"
//           >
//             <option disabled>Select a Group</option>
//             {groupList.map((group) => (
//               <option key={group} value={group}>
//                 {group}
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
//           muiTableHeadCellProps={{
//             sx: {
//               backgroundColor: '#312e81',
//               color: 'white',
//               fontSize: '16px',
//               fontWeight: 'bold',
//               borderRadius: '2px',
//             },
//           }}
//           muiTableBodyRowProps={{
//             sx: {
//               '&:hover': {
//                 backgroundColor: '#f3f4f6',
//               },
//               cursor: 'pointer',
//             },
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// export default FacilitatorDas;

// 'use client';

// import { useEffect, useMemo, useState } from 'react';
// import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
// import { getGroupUserCount, getStudentGroupWise } from 'services/apiCollection';
// import { createPortal } from 'react-dom';
// import { useRouter } from 'next/navigation';
// import { FaPhoneAlt } from 'react-icons/fa';
// import { BsThreeDotsVertical } from 'react-icons/bs';
// import { Users } from 'lucide-react';

// type Student = {
//   user_id: number;
//   name: string;
//   chanting_round: string;
//   action: string;
//   mobile_number: string;
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

// const darkColors = [
//   'bg-blue-700',
//   'bg-green-700',
//   'bg-yellow-600',
//   'bg-purple-700',
//   'bg-pink-700',
//   'bg-indigo-700',
//   'bg-orange-700',
//   'bg-teal-700',
// ];

// /**
//  * ActionCell
//  * Three-dots button which shows a pop-down menu on click.
//  * Auto-closes on scroll. Uses Portal so it won't be clipped by table.
//  */
// const ActionCell = ({ row }: { row: any }) => {
//   const router = useRouter();
//   const [open, setOpen] = useState(false);
//   const [btnPosition, setBtnPosition] = useState({ x: 0, y: 0 });

//   // Toggle pop-down
//   const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
//     e.stopPropagation();
//     // Calculate position of button for pop-down
//     const rect = (e.target as HTMLButtonElement).getBoundingClientRect();
//     setBtnPosition({ x: rect.right, y: rect.bottom });
//     setOpen((prev) => !prev);
//   };

//   // Close menu when user scrolls
//   useEffect(() => {
//     const handleScroll = () => {
//       if (open) setOpen(false);
//     };

//     if (open) {
//       window.addEventListener('scroll', handleScroll);
//     }
//     return () => {
//       window.removeEventListener('scroll', handleScroll);
//     };
//   }, [open]);

//   // Example route button
//   const handleRouteOne = (e: React.MouseEvent<HTMLButtonElement>) => {
//     e.stopPropagation();
//     router.push(`/admin/facilitators/attendanceReport`);
//     setOpen(false);
//   };

//   const handleRouteTwo = (e: React.MouseEvent<HTMLButtonElement>) => {
//     e.stopPropagation();
//     const dataString = encodeURIComponent(JSON.stringify(row.original));
//     router.push(
//       `/admin/batches/BatchId/edit/${row.original.user_id}?data=${dataString}`,
//     );
//     setOpen(false);
//   };
//   // The actual pop-down menu
//   const popDownMenu = (
//     <div
//       style={{
//         position: 'fixed',
//         top: btnPosition.y,
//         left: btnPosition.x,
//       }}
//       className="z-[9999] mt-2 w-40 rounded border border-gray-200 bg-white shadow-md"
//     >
//       <button
//         onClick={handleRouteOne}
//         className="block w-full px-4 py-2 text-left hover:bg-gray-100"
//       >
//         Attendance Report
//       </button>
//       <button
//         onClick={handleRouteTwo}
//         className="block w-full px-4 py-2 text-left hover:bg-gray-100"
//       >
//         Edit detail{' '}
//       </button>
//     </div>
//   );

//   return (
//     <>
//       <button
//         onClick={handleToggle}
//         className="relative rounded bg-indigo-900 px-3 py-1 text-white hover:bg-indigo-800"
//       >
//         <BsThreeDotsVertical size={18} />
//       </button>

//       {/* Render in Portal so it's not clipped by table overflow */}
//       {open &&
//         typeof document !== 'undefined' &&
//         createPortal(popDownMenu, document.body)}
//     </>
//   );
// };

// const FacilitatorDas = () => {
//   // Safely fetch localStorage item in client
//   const facilitatorId =
//     typeof window !== 'undefined' ? localStorage.getItem('frontlinerId') : null;

//   const [data, setData] = useState<Student[]>([]);
//   const [groupData, setGroupData] = useState<any[]>([]);
//   const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [groupName, setGroupName] = useState('DYS');

//   // Fetch group counts
//   useEffect(() => {
//     async function fetchData() {
//       if (!facilitatorId) return;
//       try {
//         const rawData = await getGroupUserCount(facilitatorId);
//         const formatted = groupList.map((group, index) => {
//           const match = rawData.find((d: any) => d.group_name === group);
//           return {
//             group_name: group,
//             total_users: match ? match.total_users : 0,
//             color: darkColors[index % darkColors.length],
//           };
//         });
//         setGroupData(formatted);
//       } catch (err) {
//         console.error('Failed to fetch group count', err);
//       }
//     }
//     fetchData();
//   }, [facilitatorId]);

//   // Fetch user data for the selected group
//   const fetchGetStudentGroupWise = async (group_name: string) => {
//     if (!facilitatorId) return;
//     setIsLoading(true);
//     try {
//       const users = await getStudentGroupWise(facilitatorId, group_name);
//       setData(users.users);
//     } catch (err) {
//       console.log('Failed to fetch students by group');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Re-fetch whenever groupName changes
//   useEffect(() => {
//     if (groupName) {
//       fetchGetStudentGroupWise(groupName);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [groupName]);

//   // Define columns for MaterialReactTable
//   const columns = useMemo<MRT_ColumnDef<Student>[]>(
//     () => [
//       {
//         accessorKey: 'name',
//         header: 'Name',
//         size: 200,
//       },
//       {
//         accessorKey: 'chanting_round',
//         header: 'Chanting',
//         size: 200,
//       },
//       {
//         accessorKey: 'total_report',
//         header: 'Total Report',
//         size: 200,
//       },
//       {
//         accessorKey: 'mobile_number',
//         header: 'Phone Number',
//         size: 150,
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
//       {
//         accessorKey: 'action',
//         header: 'Action',
//         size: 150,
//         Cell: ({ row }) => <ActionCell row={row} />,
//       },
//     ],
//     [],
//   );

//   // Loading state
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

//       {/* Group Selector */}
//       <div className="mb-4 mt-10 flex justify-end">
//         <form
//           onSubmit={(e) => {
//             e.preventDefault();
//             fetchGetStudentGroupWise(groupName);
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
//           // Optional: If you want no clipping:
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

// export default FacilitatorDas;

'use client';

import { useEffect, useState } from 'react';
import { getGroupUserCount } from 'services/apiCollection';

import { Users } from 'lucide-react';
import FacilitatorUserReport from './FacilitatorUserReport';

type Student = {
  user_id: number;
  name: string;
  chanting_round: string;
  action: string;
  mobile_number: string;
};

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

const darkColors = [
  'bg-blue-700',
  'bg-green-700',
  'bg-yellow-600',
  'bg-purple-700',
  'bg-pink-700',
  'bg-indigo-700',
  'bg-orange-700',
  'bg-teal-700',
];

const FacilitatorDas = () => {
  const facilitatorId =
    typeof window !== 'undefined' ? localStorage.getItem('frontlinerId') : null;

  const [groupData, setGroupData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!facilitatorId) return;
      try {
        const rawData = await getGroupUserCount(facilitatorId);
        const formatted = groupList.map((group, index) => {
          const match = rawData.find((d: any) => d.group_name === group);
          return {
            group_name: group,
            total_users: match ? match.total_users : 0,
            color: darkColors[index % darkColors.length],
          };
        });
        setGroupData(formatted);
      } catch (err) {
        console.error('Failed to fetch group count', err);
      }
    }
    fetchData();
  }, [facilitatorId]);

  if (isLoading) {
    return <div className="mt-6 px-6 text-lg dark:bg-white">Loading...</div>;
  }

  return (
    <div className="mt-10">
      {/* Group Count Cards */}
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {groupData.map((group, idx) => (
            <div
              key={idx}
              className={`rounded-xl p-4 text-white shadow-2xl transition-transform duration-300 hover:scale-105 ${group.color}`}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{group.group_name}</h2>
                <Users className="h-6 w-6" />
              </div>
              <p className="mt-2 text-4xl font-bold">{group.total_users}</p>
            </div>
          ))}
        </div>
      </div>
      <FacilitatorUserReport/>
    </div>
  );
};

export default FacilitatorDas;

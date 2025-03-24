// 'use client';

// import { useMemo, useState } from 'react';
// import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
// import DetailesModal from './DetailesModal';

// // Example data type
// type Student = {
//   id: number;
//   name: string;
//   facilitatorName: string;
//   phoneNumber: string;
//   age: number;
//   profession: string;
//   paymentReceived: boolean;
//   studentStatus: string;
// };

// // Sample data with IDs
// const initialData: Student[] = [
//   { id: 1, name: 'Rahul Sharma', facilitatorName: 'Amit Verma', phoneNumber: '9876543210', age: 22, profession: 'Student', paymentReceived: true, studentStatus: 'Active' },
//   { id: 2, name: 'Pooja Singh', facilitatorName: 'Neha Gupta', phoneNumber: '8765432109', age: 25, profession: 'Teacher', paymentReceived: false, studentStatus: 'Inactive' },
//   { id: 3, name: 'Aarav Mehta', facilitatorName: 'Rajesh Kumar', phoneNumber: '7654321098', age: 20, profession: 'Engineer', paymentReceived: true, studentStatus: 'Active' },
//   { id: 4, name: 'Kiran Yadav', facilitatorName: 'Suman Sharma', phoneNumber: '6543210987', age: 23, profession: 'Doctor', paymentReceived: false, studentStatus: 'Pending' },
// ];

// const CallingSystem = () => {
//   const [data, setData] = useState(initialData);
//   const [selectedRow, setSelectedRow] = useState<Student | null>(null);
//   const [open, setOpen] = useState(false);

//   const columns = useMemo<MRT_ColumnDef<Student>[]>(() => [
//     { accessorKey: 'name', header: 'Name', size: 200 },
//     { accessorKey: 'facilitatorName', header: 'Facilitator Name', size: 200 },
//     { accessorKey: 'phoneNumber', header: 'Phone Number', size: 150 },
//     { accessorKey: 'age', header: 'Age', size: 100 },
//     { accessorKey: 'profession', header: 'Profession', size: 150 },
//     { accessorKey: 'paymentReceived', header: 'Payment Received', size: 150, Cell: ({ cell }) => (cell.getValue() ? 'Yes' : 'No') },
//     { accessorKey: 'studentStatus', header: 'Student Status', size: 150 },
//   ], []);

//   // Row click handler
//   const handleRowClick = (row: Student) => {
//     setSelectedRow(row);
//     setOpen(true);
//   };

//   return (
//     <>
//       <div className='bg-white mt-0 p-5 mb-5 rounded-md shadow-2xl'>
//         <MaterialReactTable
//           columns={columns}
//           data={data}
//           enableSorting
//           getRowId={(row) => row.id.toString()} // Unique row ID
//           muiTableBodyRowProps={({ row }) => ({
//             onClick: () => handleRowClick(row.original),
//             style: { cursor: 'pointer' }
//           })}
//         />
//       </div>

//       {/* Beautiful Modal/Dialog */}
//       <DetailesModal  isOpen={open} closeModal={() => setOpen(false)} selectedRow={selectedRow}/>
//     </>
//   );
// };

// export default CallingSystem;

// // 'use client';

// // import { useState } from 'react';
// // import DetailesModal from './DetailesModal';

// // type Student = {
// //   id: number;
// //   name: string;
// //   facilitatorName: string;
// //   phoneNumber: string;
// //   age: number;
// //   profession: string;
// //   paymentReceived: boolean;
// //   studentStatus: string;
// // };

// // const initialData: Student[] = [
// //   { id: 1, name: 'Rahul Sharma', facilitatorName: 'Amit Verma', phoneNumber: '9876543210', age: 22, profession: 'Student', paymentReceived: true, studentStatus: 'Active' },
// //   { id: 2, name: 'Pooja Singh', facilitatorName: 'Neha Gupta', phoneNumber: '8765432109', age: 25, profession: 'Teacher', paymentReceived: false, studentStatus: 'Inactive' },
// //   { id: 3, name: 'Aarav Mehta', facilitatorName: 'Rajesh Kumar', phoneNumber: '7654321098', age: 20, profession: 'Engineer', paymentReceived: true, studentStatus: 'Active' },
// //   { id: 4, name: 'Kiran Yadav', facilitatorName: 'Suman Sharma', phoneNumber: '6543210987', age: 23, profession: 'Doctor', paymentReceived: false, studentStatus: 'Pending' },
// // ];

// // const CustomTable = () => {
// //   const [selectedRow, setSelectedRow] = useState<Student | null>(null);
// //   const [open, setOpen] = useState(false);
// //   const [searchQuery, setSearchQuery] = useState('');

// //   // 🔍 Search Logic
// //   const filteredData = initialData.filter((student) =>
// //     student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
// //     student.facilitatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
// //     student.phoneNumber.includes(searchQuery)
// //   );

// //   const handleRowClick = (row: Student) => {
// //     setSelectedRow(row);
// //     setOpen(true);
// //   };

// //   return (
// //     <>
// //       {/* 🔍 Search Bar */}
// //       <div className="mb-4">
// //         <input
// //           type="text"
// //           placeholder="Search by name, facilitator, or phone..."
// //           className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
// //           value={searchQuery}
// //           onChange={(e) => setSearchQuery(e.target.value)}
// //         />
// //       </div>

// //       {/* 📋 Table */}
// //       <div className="bg-white p-5 rounded-md shadow-lg overflow-x-auto">
// //         <table className="w-full border border-gray-300 rounded-lg shadow-md">
// //           <thead className="bg-blue-900 text-white">
// //             <tr>
// //               <th className="p-3 text-left">Name</th>
// //               <th className="p-3 text-left">Facilitator Name</th>
// //               <th className="p-3 text-left">Phone Number</th>
// //               <th className="p-3 text-left">Age</th>
// //               <th className="p-3 text-left">Profession</th>
// //               <th className="p-3 text-left">Payment Received</th>
// //               <th className="p-3 text-left">Student Status</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {filteredData.length > 0 ? (
// //               filteredData.map((student) => (
// //                 <tr
// //                   key={student.id}
// //                   onClick={() => handleRowClick(student)}
// //                   className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
// //                 >
// //                   <td className="p-3">{student.name}</td>
// //                   <td className="p-3">{student.facilitatorName}</td>
// //                   <td className="p-3">{student.phoneNumber}</td>
// //                   <td className="p-3">{student.age}</td>
// //                   <td className="p-3">{student.profession}</td>
// //                   <td className="p-3">{student.paymentReceived ? 'Yes' : 'No'}</td>
// //                   <td className="p-3">{student.studentStatus}</td>
// //                 </tr>
// //               ))
// //             ) : (
// //               <tr>
// //                 <td colSpan={7} className="p-3 text-center text-gray-500">
// //                   No results found.
// //                 </td>
// //               </tr>
// //             )}
// //           </tbody>
// //         </table>
// //       </div>

// //       {/* Modal */}
// //       <DetailesModal isOpen={open} closeModal={() => setOpen(false)} selectedRow={selectedRow} />
// //     </>
// //   );
// // };

// // export default CustomTable;

// 'use client';

// import { useState } from 'react';
// import DetailesModal from './DetailesModal';
// import { CheckCircle, XCircle } from 'lucide-react';

// type Student = {
//   id: number;
//   name: string;
//   facilitatorName: string;
//   phoneNumber: string;
//   age: number;
//   profession: string;
//   paymentReceived: boolean;
//   studentStatus: string;
// };

// const initialData: Student[] = [
//   { id: 1, name: 'Rahul Sharma', facilitatorName: 'Amit Verma', phoneNumber: '9876543210', age: 22, profession: 'Student', paymentReceived: true, studentStatus: 'Active' },
//   { id: 2, name: 'Pooja Singh', facilitatorName: 'Neha Gupta', phoneNumber: '8765432109', age: 25, profession: 'Teacher', paymentReceived: false, studentStatus: 'Inactive' },
//   { id: 3, name: 'Aarav Mehta', facilitatorName: 'Rajesh Kumar', phoneNumber: '7654321098', age: 20, profession: 'Engineer', paymentReceived: true, studentStatus: 'Active' },
//   { id: 4, name: 'Kiran Yadav', facilitatorName: 'Suman Sharma', phoneNumber: '6543210987', age: 23, profession: 'Doctor', paymentReceived: false, studentStatus: 'Pending' },
// ];

// const CustomTable = () => {
//   const [selectedRow, setSelectedRow] = useState<Student | null>(null);
//   const [open, setOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');

//   const filteredData = initialData.filter((student) =>
//     student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     student.facilitatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     student.phoneNumber.includes(searchQuery)
//   );

//   const handleRowClick = (row: Student) => {
//     setSelectedRow(row);
//     setOpen(true);
//   };

//   return (
//     <>
//       <div className="mb-4">
//         <input
//           type="text"
//           placeholder="Search by name, facilitator, or phone..."
//           className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//       </div>

//       <div className="bg-white dark:bg-gray-900 p-5 rounded-md shadow-lg overflow-x-auto">
//         <table className="w-full border border-gray-300 rounded-lg shadow-md">
//           <thead className="bg-blue-900 text-white">
//             <tr>
//               <th className="p-3 text-left">Name</th>
//               <th className="p-3 text-left">Facilitator Name</th>
//               <th className="p-3 text-left">Phone Number</th>
//               <th className="p-3 text-left">Age</th>
//               <th className="p-3 text-left">Profession</th>
//               <th className="p-3 text-left">Payment Received</th>
//               <th className="p-3 text-left">Student Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredData.length > 0 ? (
//               filteredData.map((student) => (
//                 <tr
//                   key={student.id}
//                   onClick={() => handleRowClick(student)}
//                   className="border-b border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer dark:text-white"
//                 >
//                   <td className="p-3">{student.name}</td>
//                   <td className="p-3">{student.facilitatorName}</td>
//                   <td className="p-3">{student.phoneNumber}</td>
//                   <td className="p-3">{student.age}</td>
//                   <td className="p-3">{student.profession}</td>
//                   <td className="p-3 flex items-center">
//                     {student.paymentReceived ? (
//                       <><CheckCircle className="text-green-500 mr-2" /> Yes</>
//                     ) : (
//                       <><XCircle className="text-red-500 mr-2" /> No</>
//                     )}
//                   </td>
//                   <td className="p-3">{student.studentStatus}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={7} className="p-3 text-center text-gray-500 dark:text-gray-400">
//                   No results found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       <DetailesModal isOpen={open} closeModal={() => setOpen(false)} selectedRow={selectedRow} />
//     </>
//   );
// };

// export default CustomTable;

// 'use client';

// import { useMemo, useState } from 'react';
// import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
// import DetailesModal from './DetailesModal';

// // Example data type
// type Student = {
//   id: number;
//   name: string;
//   facilitatorName: string;
//   phoneNumber: string;
//   age: number;
//   profession: string;
//   paymentReceived: boolean;
//   studentStatus: string;
// };

// // Sample data with IDs
// const initialData: Student[] = [
//   { id: 1, name: 'Rahul Sharma', facilitatorName: 'Amit Verma', phoneNumber: '9876543210', age: 22, profession: 'Student', paymentReceived: true, studentStatus: 'Active' },
//   { id: 2, name: 'Pooja Singh', facilitatorName: 'Neha Gupta', phoneNumber: '8765432109', age: 25, profession: 'Teacher', paymentReceived: false, studentStatus: 'Inactive' },
//   { id: 3, name: 'Aarav Mehta', facilitatorName: 'Rajesh Kumar', phoneNumber: '7654321098', age: 20, profession: 'Engineer', paymentReceived: true, studentStatus: 'Active' },
//   { id: 4, name: 'Kiran Yadav', facilitatorName: 'Suman Sharma', phoneNumber: '6543210987', age: 23, profession: 'Doctor', paymentReceived: false, studentStatus: 'Pending' },
// ];

// const CallingSystem = () => {
//   const [data, setData] = useState(initialData);
//   const [selectedRow, setSelectedRow] = useState<Student | null>(null);
//   const [open, setOpen] = useState(false);
//   const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({}); // State for row selection

//   const columns = useMemo<MRT_ColumnDef<Student>[]>(() => [
//     { accessorKey: 'name', header: 'Name', size: 200 },
//     { accessorKey: 'facilitatorName', header: 'Facilitator Name', size: 200 },
//     { accessorKey: 'phoneNumber', header: 'Phone Number', size: 150 },
//     { accessorKey: 'age', header: 'Age', size: 100 },
//     { accessorKey: 'profession', header: 'Profession', size: 150 },
//     { accessorKey: 'paymentReceived', header: 'Payment Received', size: 150, Cell: ({ cell }) => (cell.getValue() ? 'Yes' : 'No') },
//     { accessorKey: 'studentStatus', header: 'Student Status', size: 150 },
//   ], []);

//   // Row click handler
//   const handleRowClick = (row: Student) => {
//     setSelectedRow(row);
//     setOpen(true);
//   };

//   return (
//     <>
//       <div className='bg-white mt-0 p-5 mb-5 rounded-md shadow-2xl'>
//         <MaterialReactTable
//           columns={columns}
//           data={data}
//           enableSorting
//           enableRowSelection // Enable row selection
//           onRowSelectionChange={setRowSelection} // Handle row selection changes
//           state={{ rowSelection }} // Pass the row selection state
//           getRowId={(row) => row.id.toString()} // Unique row ID
//           muiTableBodyRowProps={({ row }) => ({
//             onClick: () => handleRowClick(row.original),
//             style: { cursor: 'pointer' },
//           })}
//         />
//       </div>

//       {/* Beautiful Modal/Dialog */}
//       <DetailesModal isOpen={open} closeModal={() => setOpen(false)} selectedRow={selectedRow} />
//     </>
//   );
// };

// export default CallingSystem;

// 'use client';

// import { useMemo, useState } from 'react';
// import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
// import DetailesModal from './DetailesModal';

// // Example data type
// type Student = {
//   id: number;
//   name: string;
//   facilitatorName: string;
//   phoneNumber: string;
//   age: number;
//   profession: string;
//   paymentReceived: boolean;
//   studentStatus: string;
// };

// // Sample data with IDs
// const initialData: Student[] = [
//   { id: 1, name: 'Rahul Sharma', facilitatorName: 'Amit Verma', phoneNumber: '9876543210', age: 22, profession: 'Student', paymentReceived: true, studentStatus: 'Active' },
//   { id: 2, name: 'Pooja Singh', facilitatorName: 'Neha Gupta', phoneNumber: '8765432109', age: 25, profession: 'Teacher', paymentReceived: false, studentStatus: 'Inactive' },
//   { id: 3, name: 'Aarav Mehta', facilitatorName: 'Rajesh Kumar', phoneNumber: '7654321098', age: 20, profession: 'Engineer', paymentReceived: true, studentStatus: 'Active' },
//   { id: 4, name: 'Kiran Yadav', facilitatorName: 'Suman Sharma', phoneNumber: '6543210987', age: 23, profession: 'Doctor', paymentReceived: false, studentStatus: 'Pending' },
// ];

// const CallingSystem = () => {
//   const [data, setData] = useState(initialData);
//   const [selectedRow, setSelectedRow] = useState<Student | null>(null);
//   const [open, setOpen] = useState(false);
//   const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

//   const columns = useMemo<MRT_ColumnDef<Student>[]>(() => [
//     { accessorKey: 'name', header: 'Name', size: 200 },
//     { accessorKey: 'facilitatorName', header: 'Facilitator Name', size: 200 },
//     { accessorKey: 'phoneNumber', header: 'Phone Number', size: 150 },
//     { accessorKey: 'age', header: 'Age', size: 100 },
//     { accessorKey: 'profession', header: 'Profession', size: 150 },
//     {
//       accessorKey: 'paymentReceived',
//       header: 'Payment Received',
//       size: 150,
//       Cell: ({ cell }) => (
//         <span
//           style={{
//             color: cell.getValue() ? 'green' : 'red',
//             fontWeight: 'bold',
//           }}
//         >
//           {cell.getValue() ? 'Yes' : 'No'}
//         </span>
//       ),
//     },
//     { accessorKey: 'studentStatus', header: 'Student Status', size: 150 },
//   ], []);

//   // Row click handler
//   const handleRowClick = (row: Student) => {
//     setSelectedRow(row);
//     setOpen(true);
//   };

//   return (
//     <>
//       <div className='bg-white mt-0 p-5 mb-5 rounded-md shadow-2xl'>
//         <MaterialReactTable
//           columns={columns}
//           data={data}
//           enableSorting
//           enableRowSelection
//           onRowSelectionChange={setRowSelection}
//           state={{ rowSelection }}
//           getRowId={(row) => row.id.toString()}
//           muiTableHeadCellProps={{
//             sx: {
//               backgroundColor: '#4f46e5', // Header background color
//               color: 'white', // Header text color
//               fontSize: '16px', // Header font size
//               fontWeight: 'bold', // Header font weight
//             },
//           }}
//           muiTableBodyRowProps={({ row }) => ({
//             sx: {
//               backgroundColor: rowSelection[row.id] ? '#e0e7ff' : 'white', // Selected row background color
//               '&:hover': {
//                 backgroundColor: '#f3f4f6', // Row hover background color
//               },
//             },
//           })}
//           muiTablePaperProps={{
//             sx: {
//               border: '1px solid #e5e7eb', // Table border
//               boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Table shadow
//             },
//           }}
//         />
//       </div>

//       {/* Beautiful Modal/Dialog */}
//       <DetailesModal isOpen={open} closeModal={() => setOpen(false)} selectedRow={selectedRow} />
//     </>
//   );
// };

// export default CallingSystem;

'use client';

import { useMemo, useState } from 'react';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import DetailesModal from './DetailesModal';
import { Autocomplete, TextField } from '@mui/material';
// Example data type
type Person = {
  id: number;
  name: { firstName: string; lastName: string };
  number: number;
  address: string;
  city: string;
  state: string;
};

// Sample students (not in table initially)
const allStudents: Person[] = [
  {
    id: 1,
    name: { firstName: 'John', lastName: 'Doe' },
    number: 56663666612,
    address: '261 Erdman Ford',
    city: 'East Daphne',
    state: 'Kentucky',
  },
  {
    id: 2,
    name: { firstName: 'Jane', lastName: 'Doe' },
    number: 64196456525,
    address: '769 Dominic Grove',
    city: 'Columbus',
    state: 'Ohio',
  },
  {
    id: 3,
    name: { firstName: 'Alice', lastName: 'Smith' },
    number: 64188456525,
    address: '123 Maple Street',
    city: 'New York',
    state: 'New York',
  },
  {
    id: 4,
    name: { firstName: 'John', lastName: 'Doe' },
    number: 56663666613,
    address: '261 Erdman Ford',
    city: 'East Daphne',
    state: 'Kentucky',
  },
];
// Example data type
type Student = {
  id: number;
  name: string;
  facilitatorName: string;
  phoneNumber: string;
  age: number;
  profession: string;
  paymentReceived: boolean;
  studentStatus: string;
};

// Sample data with IDs
const initialData: Student[] = [
  {
    id: 1,
    name: 'Rahul Sharma',
    facilitatorName: 'Amit Verma',
    phoneNumber: '9876543210',
    age: 22,
    profession: 'Student',
    paymentReceived: true,
    studentStatus: 'Active',
  },
  {
    id: 2,
    name: 'Pooja Singh',
    facilitatorName: 'Neha Gupta',
    phoneNumber: '8765432109',
    age: 25,
    profession: 'Teacher',
    paymentReceived: false,
    studentStatus: 'Inactive',
  },
  {
    id: 3,
    name: 'Aarav Mehta',
    facilitatorName: 'Rajesh Kumar',
    phoneNumber: '7654321098',
    age: 20,
    profession: 'Engineer',
    paymentReceived: true,
    studentStatus: 'Active',
  },
  {
    id: 4,
    name: 'Kiran Yadav',
    facilitatorName: 'Suman Sharma',
    phoneNumber: '6543210987',
    age: 23,
    profession: 'Doctor',
    paymentReceived: false,
    studentStatus: 'Pending',
  },
];

const CallingSystem = () => {
  const [data, setData] = useState(initialData);
  const [selectedRow, setSelectedRow] = useState<Student | null>(null);
  const [open, setOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const columns = useMemo<MRT_ColumnDef<Student>[]>(
    () => [
      { accessorKey: 'name', header: 'Name', size: 200 },
      { accessorKey: 'facilitatorName', header: 'Facilitator Name', size: 200 },
      { accessorKey: 'phoneNumber', header: 'Phone Number', size: 150 },
      { accessorKey: 'age', header: 'Age', size: 100 },
      { accessorKey: 'profession', header: 'Profession', size: 150 },
      {
        accessorKey: 'paymentReceived',
        header: 'Payment Received',
        size: 150,
        Cell: ({ cell }) => (
          <span
            style={{
              color: cell.getValue() ? 'green' : 'red',
              fontWeight: 'bold',
            }}
          >
            {cell.getValue() ? 'Yes' : 'No'}
          </span>
        ),
      },
      { accessorKey: 'studentStatus', header: 'Student Status', size: 150 },
    ],
    [],
  );

  // Row click handler
  const handleRowClick = (row: Student) => {
    setSelectedRow(row);
    setOpen(true);
  };

  return (
    <>
      <div className="mb-5 mt-0 rounded-md bg-white p-5 shadow-2xl">

      <div className="flex flex-col md:flex-row w-full md:max-w-full lg:max-w-full xl:max-w-full mx-auto mb-5 rounded-md bg-white p-5 shadow-2xl">
  <Autocomplete
    multiple
    id="checkboxes-tags-demo"
    options={allStudents}
    getOptionLabel={(option) =>
      `${option.name.firstName} ${option.name.lastName} ${option.number}`
    }
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
    className="text-white mt-4 md:mt-0 md:ml-2 bg-gradient-to-br bg-indigo-900 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-lg px-8 py-3.5 text-center"
  >
    Assign
  </button>
</div>
        <MaterialReactTable
          columns={columns}
          data={data}
          enableSorting
          enableRowSelection
          onRowSelectionChange={setRowSelection}
          state={{ rowSelection }}
          getRowId={(row) => row.id.toString()}
          muiTableHeadCellProps={{
            sx: {
              backgroundColor: '#312e81',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              borderRadius:"2px"
            },
          }}
          muiTableBodyRowProps={({ row }) => ({
            onClick: () => handleRowClick(row.original),
            sx: {
              '&:hover': {
                backgroundColor: '#f3f4f6', 
              },
              cursor: 'pointer',
            },
          })}
        />
      </div>

      {/* Beautiful Modal/Dialog */}
      <DetailesModal
        isOpen={open}
        closeModal={() => setOpen(false)}
        selectedRow={selectedRow}
      />
    </>
  );
};

export default CallingSystem;

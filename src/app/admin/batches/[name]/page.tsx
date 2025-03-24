// "use client";

// import { useParams } from 'next/navigation';
// import { useState, useEffect } from 'react';

// const BatchDetails = () => {
//   const params = useParams();
//   const batchName = params.name;

//   const [students, setStudents] = useState([{ id: 1, name: 'Student A' },
//     { id: 2, name: 'Student B' },
//     { id: 3, name: 'Student C' }]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchStudents = async () => {
//       try {
//         const response = await fetch(`/api/batches/${batchName}`);
//         const data = await response.json();
//         setStudents(data.students);
//       } catch (error) {
//         console.error("Error fetching students:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStudents();
//   }, [batchName]);

//   return (
//     <div className="p-2 mt-2">
//       <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
//         Batch {batchName} Students
//       </h2>

//       {loading ? (
//         <p className="text-gray-700 dark:text-gray-300">Loading...</p>
//       ) : students.length > 0 ? (
//         <ul className="border rounded-lg p-4 shadow bg-white dark:bg-gray-900 dark:border-gray-600">
//           {students.map((student) => (
//             <li key={student.id} className="p-2 border-b last:border-b-0 dark:border-gray-700 dark:text-white">
//               {student.name}
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p className="text-gray-700 dark:text-gray-300">No students found.</p>
//       )}
//     </div>
//   );
// };

// export default BatchDetails;



'use client';

import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';

// Sample Data (Default Data)
const demoData = [
  { id: 1, firstName: 'Rahul', lastName: 'Sharma', address: 'Street 1', city: 'Delhi', state: 'Delhi', group: 'DYS-1' },
  { id: 2, firstName: 'Priya', lastName: 'Verma', address: 'Street 2', city: 'Mumbai', state: 'Maharashtra', group: 'DYS-2' },
  { id: 3, firstName: 'Amit', lastName: 'Kumar', address: 'Street 3', city: 'Kolkata', state: 'West Bengal', group: 'DYS-3' },
  { id: 4, firstName: 'Neha', lastName: 'Singh', address: 'Street 4', city: 'Bangalore', state: 'Karnataka', group: 'DYS-4' },
  { id: 5, firstName: 'Vikas', lastName: 'Yadav', address: 'Street 5', city: 'Pune', state: 'Maharashtra', group: 'DYS-5' },
];

type Student = {
  id: number;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  group: string;
};

const BatchDetails = () => {
  const params = useParams();
  const batchName = params.name;

  const [students, setStudents] = useState<Student[]>(demoData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`/api/batches/${batchName}`);
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [batchName]);

  const columns = useMemo<MRT_ColumnDef<Student>[]>(() => [
    { accessorKey: 'firstName', header: 'First Name', size: 150 },
    { accessorKey: 'lastName', header: 'Last Name', size: 150 },
    { accessorKey: 'address', header: 'Address', size: 200 },
    { accessorKey: 'group', header: 'Group', size: 150 },
    { accessorKey: 'city', header: 'City', size: 150 },
    { accessorKey: 'state', header: 'State', size: 150 },
  ], []);

  return (
    <div className="p-2 mt-2">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Batch {batchName} Students
      </h2>

      {loading ? (
        <p className="text-gray-700 dark:text-gray-300">Loading...</p>
      ) : (
        <div className="bg-white mt-7 p-5 mb-5 rounded-md shadow-2xl">
          <MaterialReactTable columns={columns} data={students} enableSorting />
        </div>
      )}
    </div>
  );
};

export default BatchDetails;

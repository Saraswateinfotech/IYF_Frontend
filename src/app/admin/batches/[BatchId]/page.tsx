// 'use client';

// import { useParams } from 'next/navigation';
// import { useEffect, useMemo, useState } from 'react';
// import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
// import { getUsersByBatchId } from 'services/apiCollection';
// import { FiEdit } from 'react-icons/fi';
// import { useRouter } from 'next/navigation';

// type Student = {
//   Name: string;
//   mobile_number: string;
//   group_name: string;
//   profession: string;
// };

// const BatchDetails = () => {
//   const router = useRouter();
//   const params = useParams();
//   const BatchId = params.BatchId;

//   const [students, setStudents] = useState<Student[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchStudents = async () => {
//       try {
//         const users = await getUsersByBatchId(BatchId);
//         setStudents(users);
//       } catch (error) {
//         console.error("Error fetching students:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStudents();
//   }, [BatchId]);

//   const columns = useMemo<MRT_ColumnDef<Student>[]>(() => [
//     { accessorKey: 'name', header: 'Name', size: 150 },
//     { accessorKey: 'mobile_number', header: 'Mobile Number', size: 200 },
//     { accessorKey: 'group_name', header: 'Group', size: 150 },
//     { accessorKey: 'profession', header: 'profession', size: 150 },
//  {
//         accessorKey: 'edit',
//         header: 'Edit',
//         Cell: ({ row }) => (
//           <button
//             className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 flex items-center gap-2"
//             onClick={() => router.push(`/admin/allstudent/batches/${BatchId}/edit/${students.user_id}`)}

//           >
//             <FiEdit size={16} />
//             Edit
//           </button>
//         ),
//       },  ], []);

//   return (
//     <div className="p-2 mt-2">
//       <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
//         Batch {BatchId} Students
//       </h2>

//       {loading ? (
//         <p className="text-gray-700 dark:text-gray-300">Loading...</p>
//       ) : (
//         <div className="bg-white mt-7 p-5 mb-5 rounded-md shadow-2xl">
//           <MaterialReactTable columns={columns} data={students} enableSorting />
//         </div>
//       )}
//     </div>
//   );
// };

// export default BatchDetails;



// 'use client';

// import { useParams } from 'next/navigation';
// import { useEffect, useMemo, useState } from 'react';
// import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
// import { getUsersByBatchId } from 'services/apiCollection';
// import { FiEdit } from 'react-icons/fi';
// import { useRouter } from 'next/navigation';

// type Student = {
//   user_id: string; // Make sure you have user_id
//   name: string;
//   mobile_number: string;
//   group_name: string;
//   profession: string;
// };

// const BatchDetails = () => {
//   const router = useRouter();
//   const params = useParams();
//   const BatchId = params.BatchId;

//   const [students, setStudents] = useState<Student[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchStudents = async () => {
//       try {
//         const users = await getUsersByBatchId(BatchId);
//         setStudents(users);
//       } catch (error) {
//         console.error("Error fetching students:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStudents();
//   }, [BatchId]);

//   const columns = useMemo<MRT_ColumnDef<Student>[]>(() => [
//     { accessorKey: 'name', header: 'Name', size: 150 },
//     { accessorKey: 'mobile_number', header: 'Mobile Number', size: 200 },
//     { accessorKey: 'group_name', header: 'Group', size: 150 },
//     { accessorKey: 'profession', header: 'Profession', size: 150 },
//     {
//       accessorKey: 'edit',
//       header: 'Edit',
//       Cell: ({ row }) => (
//         <button
//           className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 flex items-center gap-2"
//           onClick={() => router.push(`/admin/batches/${BatchId}/edit/${row.original.user_id}`)} // Pass user_id in the route
//         >
//           <FiEdit size={16} />
//           Edit
//         </button>
//       ),
//     },
//   ], []);

//   return (
//     <div className="p-2 mt-2">
//       <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
//         Batch {BatchId} Students
//       </h2>

//       {loading ? (
//         <p className="text-gray-700 dark:text-gray-300">Loading...</p>
//       ) : (
//         <div className="bg-white mt-7 p-5 mb-5 rounded-md shadow-2xl">
//           <MaterialReactTable columns={columns} data={students} enableSorting />
//         </div>
//       )}
//     </div>
//   );
// };

// export default BatchDetails;



'use client';

import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { getUsersByBatchId } from 'services/apiCollection';
import { FiEdit } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

type Student = {
  user_id: string;
  name: string;
  mobile_number: string;
  group_name: string;
  profession: string;
};

const BatchDetails = () => {
  const router = useRouter();
  const params = useParams();
  const BatchId = params.BatchId;

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const users = await getUsersByBatchId(BatchId);
        setStudents(users);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [BatchId]);

  const columns = useMemo<MRT_ColumnDef<Student>[]>(() => [
    { accessorKey: 'name', header: 'Name', size: 150 },
    { accessorKey: 'mobile_number', header: 'Mobile Number', size: 200 },
    // { accessorKey: 'group_name', header: 'Group', size: 150 },
    { accessorKey: 'profession', header: 'Profession', size: 150 },
    // {
    //   accessorKey: 'edit',
    //   header: 'Edit',
    //   Cell: ({ row }) => (
    //     <button
    //       className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 flex items-center gap-2"
    //       onClick={() => router.push(`/admin/batches/${BatchId}/edit/${row.original.user_id}`)} // Pass user_id in the route
    //     >
    //       <FiEdit size={16} />
    //       Edit
    //     </button>
    //   ),
    // },
     {
            accessorKey: 'edit',
            header: 'Edit',
            Cell: ({ row }) => (
              <button
                className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 flex items-center gap-2"
                onClick={() =>
                  router.push(
                    `/admin/batches/${BatchId}/edit/${row.original.user_id}?data=${encodeURIComponent(
                      JSON.stringify(row.original),
                    )}`,
                  )
                }
              >
                <FiEdit size={16} />
                Edit
              </button>
            ),
          },
  ], []);

  return (
    <div className="p-2 mt-2">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Batch {BatchId} Students
      </h2>

     {/* Back Button */}
     <div className="mb-6 flex justify-end">
          <button
            onClick={() => router.back()}
            className="rounded-md bg-red-800 px-4 py-2 text-white hover:bg-red-700"
          >
            ← Back
          </button>
        </div>

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

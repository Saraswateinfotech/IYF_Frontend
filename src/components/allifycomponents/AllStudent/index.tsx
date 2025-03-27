


// 'use client';
// import { useMemo, useState, useEffect } from 'react';
// import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
// import { useRouter } from 'next/navigation';
// import { fetchAllStudents } from 'services/apiCollection';
// import { FiEdit } from 'react-icons/fi';

// const AllStudent = () => {
//   const [data, setData] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const router = useRouter();

//   const columns = useMemo<MRT_ColumnDef<any>[]>(
//     () => [
//       { accessorKey: 'user_id', header: 'User ID', size: 160 },
//       { accessorKey: 'name', header: 'Name' },
//       { accessorKey: 'dob', header: 'DOB' },
//       { accessorKey: 'mobile_number', header: 'Mobile Number' },
//       {
//         accessorKey: 'edit',
//         header: 'Edit',
//         Cell: ({ row }) => (
//           <button
//           className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 flex items-center gap-2"
//           onClick={() =>
//             router.push(
//               `/admin/allstudent/edit/${row.original.user_id}?data=${encodeURIComponent(
//                 JSON.stringify(row.original),
//               )}`,
//             )
//           }
//         >
//           <FiEdit size={16} />
//           Edit
//         </button>
        
//         ),
//       },
//     ],
//     [router],
//   );

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true);
//         const resp = await fetchAllStudents();
//         setData(resp.students);
//       } catch (error) {
//         console.error('Failed to fetch all students:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (isLoading) {
//     return <div className="mt-7 p-5">Loading...</div>;
//   }

//   return (
//     <div className="bg-white mt-7 p-5 mb-5 rounded-md shadow-2xl">
//       <MaterialReactTable
//         columns={columns}
//         data={data}
//         enableSorting
//         getRowId={(row) => row.user_id.toString()}
//         enableColumnResizing
//         enableColumnOrdering
//         enableStickyHeader
//         muiTableContainerProps={{ sx: { maxWidth: '100%', overflowX: 'auto' } }}
//         muiTableBodyCellProps={{ sx: { whiteSpace: 'nowrap' } }}
//       />
//     </div>
//   );
// };

// export default AllStudent;



'use client';
import { useMemo, useState, useEffect } from 'react';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { useRouter } from 'next/navigation';
import {
  fetchDashboardAccounts,
  frontlinerStudentById,
} from 'services/apiCollection';
import { FiEdit } from 'react-icons/fi';
import { Autocomplete, TextField } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';

const AllStudent = () => {
  const [data, setData] = useState<any[]>([]);
  const [allFaiclatro, setAllFaiclatro] = useState<any[]>([]);
  const [selectedFrontliner, setSelectedFrontliner] = useState<any>(null); // ✅ selected value
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      { accessorKey: 'user_id', header: 'User ID', size: 160 },
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'dob', header: 'DOB' },
      { accessorKey: 'mobile_number', header: 'Mobile Number' },
      {
        accessorKey: 'edit',
        header: 'Edit',
        Cell: ({ row }) => (
          <button
            className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 flex items-center gap-2"
            onClick={() =>
              router.push(
                `/admin/allstudent/edit/${row.original.user_id}?data=${encodeURIComponent(
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
    ],
    [router],
  );

  const handleShow = async () => {
    if (!selectedFrontliner) {
      toast.error('Please select a frontliner');
      return;
    }

    try {
      setIsLoading(true);
      const resp = await frontlinerStudentById(selectedFrontliner.user_id); // ✅ pass user_id
      setData(resp.users);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        setIsLoading(true);
        const resp = await fetchDashboardAccounts();
        setAllFaiclatro(resp);
      } catch (error) {
        console.error('Failed to fetch all fetchDashboardAccounts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFaculties();
  }, []);

  if (isLoading) {
    return <div className="mt-7 p-5">Loading...</div>;
  }
  
  return (
    <>
    <ToastContainer/>
      <div className="mx-auto mt-10 mb-5 flex w-full flex-col rounded-md bg-white p-5 shadow-2xl md:flex-row">
        <Autocomplete
          id="frontliner-select"
          options={allFaiclatro}
          getOptionLabel={(option) =>
            `${option.user_id} - ${option.name} (${option.role})`
          }
          value={selectedFrontliner}
          onChange={(e, value) => setSelectedFrontliner(value)} // ✅ set selected
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
          onClick={handleShow}
          className="mt-4 rounded-lg bg-indigo-900 bg-gradient-to-br px-8 py-3.5 text-center text-lg font-medium text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 md:ml-2 md:mt-0"
        >
          Show
        </button>
      </div>

      <div className="bg-white mt-7 p-5 mb-5 rounded-md shadow-2xl">
        <MaterialReactTable
          columns={columns}
          data={data}
          enableSorting
          getRowId={(row) => row.user_id.toString()}
          enableColumnResizing
          enableColumnOrdering
          enableStickyHeader
          muiTableContainerProps={{ sx: { maxWidth: '100%', overflowX: 'auto' } }}
          muiTableBodyCellProps={{ sx: { whiteSpace: 'nowrap' } }}
        />
      </div>
    </>
  );
};

export default AllStudent;

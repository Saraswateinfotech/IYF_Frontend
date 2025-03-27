// 'use client';

// import { useEffect, useMemo, useState } from 'react';
// import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
// import DetailesModal from './DetailesModal';
// import { Autocomplete, TextField } from '@mui/material';
// import { toast } from 'react-toastify';
// import {
//   fetchDashboardAccounts,
//   frontlinerStudentById,
//   updateCallingId,
// } from 'services/apiCollection';

// // Student type for table rows
// type Student = {
//   user_id: number;
//   name: string;
//   mobile_number: string;
//   profession: string;
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
//   const [isLoading, setIsLoading] = useState(false);
//   const [selectedFrontliners, setSelectedFrontliners] = useState([]);

//   // Toggle to show/hide assignment UI, row selection, and condensed columns
//   const [showAssignmentUI, setShowAssignmentUI] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const frontlinerId = localStorage.getItem('frontlinerId');
//         setIsLoading(true);

//         const [studentsRes, frontlinerRes] = await Promise.all([
//           frontlinerStudentById(frontlinerId),
//           fetchDashboardAccounts(),
//         ]);

//         setData(studentsRes.users);
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

//   // Columns to show when toggle is OFF (full columns)
//   const fullColumns = useMemo<MRT_ColumnDef<Student>[]>(
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
//       },
//       {
//         accessorKey: 'profession',
//         header: 'Profession',
//         size: 150,
//       },
//       {
//         accessorKey: 'payment_status',
//         header: 'Payment Status',
//         size: 150,
//         Cell: ({ cell }) => {
//           const value = cell.getValue<string>();
//           return (
//             <span
//               style={{
//                 color: value === 'received' ? 'green' : 'red',
//                 fontWeight: 'bold',
//               }}
//             >
//               {value}
//             </span>
//           );
//         },
//       },
//     ],
//     [],
//   );

//   // Columns to show when toggle is ON (only name, mobile_number, profession)
//   const condensedColumns = useMemo<MRT_ColumnDef<Student>[]>(
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
//       },
//       {
//         accessorKey: 'profession',
//         header: 'Profession',
//         size: 150,
//       },
//       {
//         accessorKey: 'payment_status',
//         header: 'Payment Status',
//         size: 150,
//         Cell: ({ cell }) => {
//           const value = cell.getValue<string>();
//           return (
//             <span
//               style={{
//                 color: value === 'received' ? 'green' : 'red',
//                 fontWeight: 'bold',
//               }}
//             >
//               {value}
//             </span>
//           );
//         },
//       },
//     ],
//     [],
//   );

//   // Decide which columns to render based on toggle
//   const columns = showAssignmentUI ? condensedColumns : fullColumns;

//   const handleRowClick = (row: Student) => {
//     setSelectedRow(row);
//     setOpen(true);
//   };

//   const handleAssign = async () => {
//     const userIds = selectedFrontliners.map((fl) => fl.user_id);
//     if (!userIds.length || !callingId) {
//       alert('Please select frontliners and provide a valid calling ID');
//       return;
//     }

//     try {
//       setIsLoading(true);
//       const res = await updateCallingId(userIds, callingId);
//       alert('Calling ID assigned successfully!');
//     } catch (err) {
//       alert('Failed to assign calling ID');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (isLoading) {
//     return <div className="mt-6 px-6 text-lg dark:bg-white">Loading...</div>;
//   }

//   return (
//     <>
//       <div className="mb-5 mt-0 rounded-md bg-white p-5 shadow-2xl">
//         {/* Toggle Button */}
//         <div className="mb-4 mt-1 flex justify-end">
//           <label className="inline-flex cursor-pointer items-center">
//             <input
//               type="checkbox"
//               className="peer sr-only"
//               checked={showAssignmentUI}
//               onChange={(e) => setShowAssignmentUI(e.target.checked)}
//             />
//             <div className="peer relative h-7 w-14 rounded-full bg-gray-200 after:absolute after:start-[4px] after:top-0.5 after:h-6 after:w-6 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-900 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 dark:border-gray-600 dark:bg-gray-700 dark:peer-checked:bg-blue-900 dark:peer-focus:ring-blue-800 rtl:peer-checked:after:-translate-x-full" />
//           </label>
//         </div>

//         {/* Autocomplete Frontliner Selection */}
//         {showAssignmentUI && (
//           <div className="mx-auto mb-5 flex w-full flex-col rounded-md bg-white p-5 shadow-2xl md:flex-row">
//             <Autocomplete
//               // multiple
//               id="frontliner-select"
//               options={frontliners}
//               loading={isLoading}
//               getOptionLabel={(option) =>
//                 `${option.user_id} - ${option.name} (${option.role})`
//               }
//               onChange={(event, newValue) => setSelectedFrontliners(newValue)}
//               className="w-full md:flex-grow"
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   label="Select Frontliner"
//                   placeholder="Search..."
//                   fullWidth
//                 />
//               )}
//             />

//             <button
//               type="button"
//               onClick={handleAssign}
//               className="mt-4 rounded-lg bg-indigo-900 bg-gradient-to-br px-8 py-3.5 text-center text-lg font-medium text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 md:ml-2 md:mt-0"
//             >
//               {isLoading ? 'Assigning...' : 'Assign'}
//             </button>
//           </div>
//         )}

//         {/* Table */}
//         <MaterialReactTable
//           columns={columns}
//           data={data}
//           enableSorting
//           enableRowSelection={showAssignmentUI} // show checkboxes only if toggle is ON
//           onRowSelectionChange={setRowSelection}
//           state={{ rowSelection }}
//           getRowId={(row) => row.user_id.toString()}
//           muiTableHeadCellProps={{
//             sx: {
//               backgroundColor: '#312e81',
//               color: 'white',
//               fontSize: '16px',
//               fontWeight: 'bold',
//               borderRadius: '2px',
//             },
//           }}
//           muiTableBodyRowProps={({ row }) => ({
//             onClick: () => handleRowClick(row.original),
//             sx: {
//               '&:hover': {
//                 backgroundColor: '#f3f4f6',
//               },
//               cursor: 'pointer',
//             },
//           })}
//         />
//       </div>
//       <DetailesModal
//         isOpen={open}
//         closeModal={() => setOpen(false)}
//         selectedRow={selectedRow}
//       />
//     </>
//   );
// };

// export default CallingSystem;

'use client';

import { useEffect, useMemo, useState } from 'react';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import DetailesModal from './DetailesModal';
import { Autocomplete, TextField } from '@mui/material';
import { toast } from 'react-toastify';
import {
  fetchAllStudents,
  fetchDashboardAccounts,
  frontlinerStudentById,
  updateCallingId,
} from 'services/apiCollection';

// Student type
type Student = {
  user_id: number;
  name: string;
  mobile_number: string;
  payment_mode: string;
  registration_date: string;
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
  const [selectedRow, setSelectedRow] = useState<Student | null>(null);
  const [open, setOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [frontliners, setFrontliners] = useState<Frontliner[]>([]);
  const [selectedFrontliner, setSelectedFrontliner] =
    useState<Frontliner | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAssignmentUI, setShowAssignmentUI] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const frontlinerId = localStorage.getItem('frontlinerId');

        const [studentsRes, frontlinerRes] = await Promise.all([
          // frontlinerStudentById(frontlinerId),
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

  const columns = useMemo<MRT_ColumnDef<Student>[]>(
    () => [
      { accessorKey: 'name', header: 'Name', size: 200 },
      { accessorKey: 'mobile_number', header: 'Phone Number', size: 150 },
      { accessorKey: 'payment_mode', header: 'Payment Mode', size: 150 },
      {
        accessorKey: 'registration_date',
        header: 'Registration Date',
        size: 150,
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
              }}
            >
              {value}
            </span>
          );
        },
      },

      // {
      //   accessorKey: 'payment_status',
      //   header: 'Payment Status',
      //   size: 150,
      //   Cell: ({ cell }) => {
      //     const value = cell.getValue<string>();
      //     return (
      //       <span
      //         style={{
      //           color: value === 'received' ? 'green' : 'red',
      //           fontWeight: 'bold',
      //         }}
      //       >
      //         {value}
      //       </span>
      //     );
      //   },
      // },
    ],
    [],
  );

  // const handleRowClick = (row: Student) => {
  //   setSelectedRow(row);
  //   setOpen(true);
  // };

  const handleAssign = async () => {
    const selectedUserIds = data
      .filter((row) => rowSelection[row.user_id.toString()])
      .map((row) => row.user_id);

    if (!selectedUserIds.length || !selectedFrontliner) {
      toast.error('Please select at least one student and a frontliner');
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
          {showAssignmentUI ? <> Calling System</> : <>Registration</>}
        </h2>

        <div className="mb-5 mt-0 rounded-md bg-white p-5 shadow-2xl">
          {/* Toggle Button */}
          <div className="mb-4 mt-1 flex justify-end">
            <label className="inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={showAssignmentUI}
                onChange={(e) => setShowAssignmentUI(e.target.checked)}
              />
              <div className="peer relative h-7 w-14 rounded-full bg-gray-200 after:absolute after:start-[4px] after:top-0.5 after:h-6 after:w-6 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-900 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 dark:border-gray-600 dark:bg-gray-700 dark:peer-checked:bg-blue-900 dark:peer-focus:ring-blue-800 rtl:peer-checked:after:-translate-x-full" />
            </label>
          </div>

          {/* Frontliner Selector */}
          {showAssignmentUI && (
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
          )}

          {/* Table */}
          <MaterialReactTable
            columns={columns}
            data={data}
            enableSorting
            enableRowSelection={showAssignmentUI}
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
            // muiTableBodyRowProps={({ row }) => ({
            //   onClick: () => handleRowClick(row.original),
            //   sx: {
            //     '&:hover': {
            //       backgroundColor: '#f3f4f6',
            //     },
            //     cursor: 'pointer',
            //   },
            // })}
          />
        </div>
      </div>

      <DetailesModal
        isOpen={open}
        closeModal={() => setOpen(false)}
        selectedRow={selectedRow}
        onSuccess={fetchAllStudents}
      />
    </>
  );
};

export default CallingSystem;

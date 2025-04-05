
// 'use client';
// import { useEffect, useMemo, useState } from 'react';
// import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
// import { ToastContainer, toast } from 'react-toastify';
// import { MdAddTask } from 'react-icons/md';
// import TextField from '@mui/material/TextField';
// import Autocomplete from '@mui/material/Autocomplete';
// import { fetchAllStudents } from 'services/apiCollection';

// type Person = {
//   name: string;
//   mobile_number: string;
//   address: string;
//   group_name: string;
// };

// const Attendance = () => {
//   const [data, setData] = useState<Person[]>([]);
//   const [allStudents, setAllStudents] = useState<Person[]>([]); // new state
//     const [isLoading, setIsLoading] = useState(true);
  

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true);
//         const resp = await fetchAllStudents();
//         setAllStudents(resp.students);
//       } catch (error) {
//         console.error('Failed to fetch all students:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleSubmit = async () => {
//     if (data.length === 0) {
//       toast.info('⚠ Please add students before submitting attendance.');
//       return;
//     }
//     try {
    
//     } catch (error) {
    
//     }
//   };

//   const handleAutocompleteChange = (event: any, newValue: Person[]) => {
//     setData(newValue);
//   };

//   const columns = useMemo<MRT_ColumnDef<Person>[]>(
//     () => [
//       { accessorKey: 'name', header: 'Name', size: 150 },
//       { accessorKey: 'mobile_number', header: 'Number', size: 200 },
//       { accessorKey: 'address', header: 'Address', size: 200 },
//       { accessorKey: 'group_name', header: 'Group Name', size: 150 },
//     ],
//     [],
//   );
//   if (isLoading) {
//     return <div className="mt-7 p-5">Loading...</div>;
//   }
//   return (
//     <>
//       <ToastContainer />
//       <div className="flex flex-wrap justify-end gap-4 p-4">
//         <button
//           onClick={handleSubmit}
//           className="flex w-full items-center rounded-full bg-indigo-900 px-6 py-3 text-lg font-medium text-white hover:bg-indigo-800 sm:w-auto"
//         >
//           <MdAddTask />
//           <span className="pl-2">Submit Attendance</span>
//         </button>
//       </div>

//       <div className="max-w-2xll mx-auto mb-5 w-full rounded-md bg-white p-5 shadow-2xl">
//         <Autocomplete
//           multiple
//           options={allStudents}
//           getOptionLabel={(option) =>
//             ` ${option.name} ${option.mobile_number} (${option.group_name})`
//           }
//           onChange={handleAutocompleteChange}
//           className="w-full"
//           renderInput={(params) => (
//             <TextField
//               {...params}
//               label="Select Students"
//               placeholder="Search..."
//               fullWidth
//             />
//           )}
//         />
//       </div>

//       {data.length === 0 ? (
//         <div className="flex justify-center items-center">
//           <div className="bg-white dark:bg-gray-800 p-5 mb-5 rounded-md shadow-2xl w-full max-w-2xll mx-auto text-center">
//             <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
//               Not Selected Attendance
//             </p>
//           </div>
//         </div>
//       ) : (
//         <div className="mb-5 rounded-md bg-white p-5 shadow-2xl">
//           <MaterialReactTable columns={columns} data={data} enableSorting />
//         </div>
//       )}
//     </>
//   );
// };

// export default Attendance;




// 'use client';

// import { useEffect, useMemo, useState } from 'react';
// import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
// import { ToastContainer, toast } from 'react-toastify';
// import { MdAddTask } from 'react-icons/md';
// import TextField from '@mui/material/TextField';
// import Autocomplete from '@mui/material/Autocomplete';
// import 'react-toastify/dist/ReactToastify.css';

// import {
//   fetchAllStudents,
//   markAttendance,
// } from 'services/apiCollection';

// type Person = {
//   id: number;
//   name: string;
//   mobile_number: string;
//   address: string;
//   user_id: string;
//   group_name: string;
// };

// const Attendance = () => {
//   const [data, setData] = useState<Person[]>([]);
//   const [allStudents, setAllStudents] = useState<Person[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true);
//         const resp = await fetchAllStudents();
//         setAllStudents(resp.students);
//       } catch (error) {
//         console.error('Failed to fetch all students:', error);
//         toast.error('❌ Failed to fetch students');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleSubmit = async () => {
//     if (data.length === 0) {
//       toast.info('⚠ Please select students before submitting attendance.');
//       return;
//     }

//     try {

//       for (const student of data) {
//         await markAttendance(student.group_name, student.user_id);
//       }

//       toast.success('✅ Attendance submitted successfully!');
//       setData([]); // clear selection after submission
//     } catch (error) {
//       console.error('Attendance submission failed:', error);
//       toast.error('❌ Failed to submit attendance.');
//     }
//   };

//   const handleAutocompleteChange = (event: any, newValue: Person[]) => {
//     setData(newValue);
//   };

//   const columns = useMemo<MRT_ColumnDef<Person>[]>(
//     () => [
//       { accessorKey: 'name', header: 'Name', size: 150 },
//       { accessorKey: 'mobile_number', header: 'Number', size: 200 },
//       { accessorKey: 'address', header: 'Address', size: 200 },
//       { accessorKey: 'group_name', header: 'Group Name', size: 150 },
//     ],
//     [],
//   );

//   if (isLoading) {
//     return <div className="mt-7 p-5">Loading...</div>;
//   }

//   return (
//     <>
//       <ToastContainer position="top-right" autoClose={2000} />

//       <div className="flex flex-wrap justify-end gap-4 p-4">
//         <button
//           onClick={handleSubmit}
//           className="flex w-full items-center rounded-full bg-indigo-900 px-6 py-3 text-lg font-medium text-white hover:bg-indigo-800 sm:w-auto"
//         >
//           <MdAddTask />
//           <span className="pl-2">Submit Attendance</span>
//         </button>
//       </div>

//       <div className="max-w-2xll mx-auto mb-5 w-full rounded-md bg-white p-5 shadow-2xl">
//         <Autocomplete
//           multiple
//           options={allStudents}
//           getOptionLabel={(option) =>
//             ` ${option.name} ${option.mobile_number} (${option.group_name})`
//           }
//           onChange={handleAutocompleteChange}
//           className="w-full"
//           value={data}
//           renderInput={(params) => (
//             <TextField
//               {...params}
//               label="Select Students"
//               placeholder="Search..."
//               fullWidth
//             />
//           )}
//         />
//       </div>

//       {data.length === 0 ? (
//         <div className="flex justify-center items-center">
//           <div className="bg-white dark:bg-gray-800 p-5 mb-5 rounded-md shadow-2xl w-full max-w-2xll mx-auto text-center">
//             <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
//               Not Selected Attendance
//             </p>
//           </div>
//         </div>
//       ) : (
//         <div className="mb-5 rounded-md bg-white p-5 shadow-2xl">
//           <MaterialReactTable columns={columns} data={data} enableSorting />
//         </div>
//       )}
//     </>
//   );
// };

// export default Attendance;



// 'use client';

// import { useEffect, useMemo, useState } from 'react';
// import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
// import { ToastContainer, toast } from 'react-toastify';
// import { MdAddTask } from 'react-icons/md';
// import TextField from '@mui/material/TextField';
// import Autocomplete from '@mui/material/Autocomplete';
// import 'react-toastify/dist/ReactToastify.css';

// import {
//   fetchAllStudents,
//   markAttendance,
// } from 'services/apiCollection';

// type Person = {
//   id: number;
//   name: string;
//   mobile_number: string;
//   address: string;
//   user_id: string;
//   group_name: string;
// };

// const Attendance = () => {
//   const [data, setData] = useState<Person[]>([]);
//   const [allStudents, setAllStudents] = useState<Person[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const fetchData = async () => {
//     try {
//       setIsLoading(true);
//       const resp = await fetchAllStudents();
//       setAllStudents(resp.students);
//     } catch (error) {
//       console.error('Failed to fetch all students:', error);
//       toast.error('❌ Failed to fetch students');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleSubmit = async () => {
//     if (data.length === 0) {
//       toast.info('⚠ Please select students before submitting attendance.');
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       for (const student of data) {
//         await markAttendance(student.group_name, student.user_id);
//       }

//       toast.success('✅ Attendance submitted successfully!');
//       setData([]);
//       setTimeout(() => {
//         fetchData();
//       }, 1000);
      
//     } catch (error) {
//       console.error('Attendance submission failed:', error);
//       toast.error('❌ Failed to submit attendance.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleAutocompleteChange = (event: any, newValue: Person[]) => {
//     setData(newValue);
//   };

//   const columns = useMemo<MRT_ColumnDef<Person>[]>(
//     () => [
//       { accessorKey: 'name', header: 'Name', size: 150 },
//       { accessorKey: 'mobile_number', header: 'Number', size: 200 },
//       { accessorKey: 'address', header: 'Address', size: 200 },
//       { accessorKey: 'group_name', header: 'Group Name', size: 150 },
//     ],
//     [],
//   );

//   if (isLoading) {
//     return <div className="mt-7 p-5">Loading...</div>;
//   }

//   return (
//     <>
//       <ToastContainer position="top-right" autoClose={2000} />

//       <div className="flex flex-wrap justify-end gap-4 p-4">
//         <button
//           onClick={handleSubmit}
//           disabled={isSubmitting}
//           className={`flex w-full items-center rounded-full px-6 py-3 text-lg font-medium text-white sm:w-auto ${
//             isSubmitting
//               ? 'bg-gray-400 cursor-not-allowed'
//               : 'bg-indigo-900 hover:bg-indigo-800'
//           }`}
//         >
//           {isSubmitting ? (
//             <span className="animate-pulse">Submitting...</span>
//           ) : (
//             <>
//               <MdAddTask />
//               <span className="pl-2">Submit Attendance</span>
//             </>
//           )}
//         </button>
//       </div>

//       <div className="max-w-2xll mx-auto mb-5 w-full rounded-md bg-white p-5 shadow-2xl">
//         <Autocomplete
//           multiple
//           options={allStudents}
//           getOptionLabel={(option) =>
//             ` ${option.name} ${option.mobile_number} (${option.group_name})`
//           }
//           onChange={handleAutocompleteChange}
//           className="w-full"
//           value={data}
//           renderInput={(params) => (
//             <TextField
//               {...params}
//               label="Select Students"
//               placeholder="Search..."
//               fullWidth
//             />
//           )}
//         />
//       </div>

//       {data.length === 0 ? (
//         <div className="flex justify-center items-center">
//           <div className="bg-white dark:bg-gray-800 p-5 mb-5 rounded-md shadow-2xl w-full max-w-2xll mx-auto text-center">
//             <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
//               Not Selected Attendance
//             </p>
//           </div>
//         </div>
//       ) : (
//         <div className="mb-5 rounded-md bg-white p-5 shadow-2xl">
//           <MaterialReactTable columns={columns} data={data} enableSorting />
//         </div>
//       )}
//     </>
//   );
// };

// export default Attendance;


'use client';

import { useEffect, useMemo, useState } from 'react';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { ToastContainer, toast } from 'react-toastify';
import { MdAddTask } from 'react-icons/md';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import 'react-toastify/dist/ReactToastify.css';

import {
  fetchAllStudents,
  markAttendance,
} from 'services/apiCollection';

type Person = {
  id: number;
  name: string;
  mobile_number: string;
  address: string;
  user_id: string;
  group_name: string;
};

const Attendance = () => {
  const [data, setData] = useState<Person[]>([]);
  const [allStudents, setAllStudents] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const resp = await fetchAllStudents();
      setAllStudents(resp.students);
    } catch (error) {
      console.error('Failed to fetch all students:', error);
      toast.error('❌ Failed to fetch students');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (data.length === 0) {
      toast.info('⚠ Please select students before submitting attendance.');
      return;
    }

    setIsSubmitting(true);

    try {
      for (const student of data) {
        await markAttendance(student.group_name, student.user_id);
      }

      toast.success('✅ Attendance submitted successfully!');
      setData([]);
      setTimeout(() => {
        fetchData();
      }, 1000);
      
    } catch (error) {
      console.error('Attendance submission failed:', error);
      toast.error('❌ Failed to submit attendance.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAutocompleteChange = (event: any, newValue: Person[]) => {
    setData(newValue);
  };

  // Group shifting logic for display
  const shiftGroupName = (groupName: string) => {
    const groupShiftMap: Record<string, string> = {
      'new': 'new',      // Show new for new users
      'DYS-1': 'DYS-2',    // Show DYS-2 for DYS-1
      'DYS-2': 'DYS-3',    // DYS-2 will show DYS-3
      'DYS-3': 'DYS-4',    // DYS-3 will show DYS-4
      'DYS-4': 'DYS-5',    // DYS-4 will show DYS-5
      'DYS-5': 'DYS-6',    // DYS-5 will show DYS-6
    };
    return groupShiftMap[groupName] || groupName; // Default to original groupName if no shift found
  };

  const columns = useMemo<MRT_ColumnDef<Person>[]>(
    () => [
      { accessorKey: 'name', header: 'Name', size: 150 },
      { accessorKey: 'mobile_number', header: 'Number', size: 200 },
      { accessorKey: 'address', header: 'Address', size: 200 },
      { accessorKey: 'group_name', header: 'Group Name', size: 150 },
    ],
    [],
  );

  if (isLoading) {
    return <div className="mt-7 p-5">Loading...</div>;
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="flex flex-wrap justify-end gap-4 p-4">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`flex w-full items-center rounded-full px-6 py-3 text-lg font-medium text-white sm:w-auto ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-900 hover:bg-indigo-800'
          }`}
        >
          {isSubmitting ? (
            <span className="animate-pulse">Submitting...</span>
          ) : (
            <>
              <MdAddTask />
              <span className="pl-2">Submit Attendance</span>
            </>
          )}
        </button>
      </div>

      <div className="max-w-2xll mx-auto mb-5 w-full rounded-md bg-white p-5 shadow-2xl">
        <Autocomplete
          multiple
          options={allStudents}
          getOptionLabel={(option) => 
            ` ${option.name} ${option.mobile_number} (${shiftGroupName(option.group_name)})`
          }
          onChange={handleAutocompleteChange}
          className="w-full"
          value={data}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Students"
              placeholder="Search..."
              fullWidth
            />
          )}
        />
      </div>

      {data.length === 0 ? (
        <div className="flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 p-5 mb-5 rounded-md shadow-2xl w-full max-w-2xll mx-auto text-center">
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Not Selected Attendance
            </p>
          </div>
        </div>
      ) : (
        <div className="mb-5 rounded-md bg-white p-5 shadow-2xl">
          <MaterialReactTable columns={columns} data={data} enableSorting />
        </div>
      )}
    </>
  );
};

export default Attendance;

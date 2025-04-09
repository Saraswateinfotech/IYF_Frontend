
// 'use client';

// import { useEffect, useMemo, useState } from 'react';
// import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
// import { getStudentGroupWise } from 'services/apiCollection';
// import { FaPhoneAlt } from 'react-icons/fa';
// import { BsThreeDotsVertical } from 'react-icons/bs';
// import { useParams } from 'next/navigation';

// type Student = {
//   user_id: number;
//   name: string;
//   mobile_number: string;
//   profession: string;
// };

// const AttendanceReport = () => {
//   const params = useParams();
//   const facilitatorId = params.UserId;

//   const [data, setData] = useState<Student[]>([]);
//   const [selectedRow, setSelectedRow] = useState<Student | null>(null);
//   const [open, setOpen] = useState(false);
//   const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [groupName, setGroupName] = useState('DYS');

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
//         accessorKey: 'profession',
//         header: 'Profession',
//         size: 150,
//         Cell: ({ cell }) => formatProfession(cell.getValue() as string),
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
//         accessorKey: 'Change Group',
//         header: 'Change Group',
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
//         <div className="mb-4 flex justify-end">
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
//     </>
//   );
// };

// export default AttendanceReport;




'use client';

import { useEffect, useMemo, useState } from 'react';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { FaPhoneAlt } from 'react-icons/fa';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useParams } from 'next/navigation';

// (Demo) replace this with your actual function to fetch monthly attendance
async function getMonthlyAttendance(facilitatorId: string, monthNumber: string) {
  // monthNumber is "1" for January, "2" for February, etc.
  // Your actual API call might look like:
  // return await fetch(`/api/attendance?fid=${facilitatorId}&month=${monthNumber}`)
  //   .then((res) => res.json());
  return {
    users: [
      {
        user_id: 101,
        name: 'John Doe',
        mobile_number: '9999999999',
        profession: 'student',
        // your backend can also return attendance details
      },
      {
        user_id: 102,
        name: 'Jane Smith',
        mobile_number: '8888888888',
        profession: 'job_candidate',
      },
    ],
  };
}

type Student = {
  user_id: number;
  name: string;
  mobile_number: string;
  attendance: string;
};

const monthList = [
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

const AttendanceReport = () => {
  // we get the facilitatorId from params
  const params = useParams();
  const facilitatorId = params.UserId;

  // by default, latest month => current month
  const currentMonth = new Date().getMonth() + 1; // getMonth() returns 0-based index
  const [selectedMonth, setSelectedMonth] = useState<string>(String(currentMonth));

  const [data, setData] = useState<Student[]>([]);
  const [selectedRow, setSelectedRow] = useState<Student | null>(null);
  const [open, setOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);

  // fetch data according to month
  const fetchMonthlyAttendance = async (month: string) => {
    try {
      setIsLoading(true);
    //   const respData = await getMonthlyAttendance(facilitatorId, month);
    //   setData(respData.users);
    } catch (err) {
      console.error('Failed to fetch monthly attendance', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch attendance for default month on mount
  useEffect(() => {
    fetchMonthlyAttendance(selectedMonth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatProfession = (profession: string) => {
    switch (profession) {
      case 'job_candidate':
        return 'Job Candidate';
      case 'student':
        return 'Student';
      default:
        return profession;
    }
  };

  // TABLE COLUMNS
  // For full attendance tracking, you might add columns for each date in the month
  // or a single column with a detailed attendance. This is just an example structure:
  const columns = useMemo<MRT_ColumnDef<Student>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        size: 200,
      },
      {
        accessorKey: 'attendance',
        header: 'Attendance Date ',
        size: 150,
        Cell: ({ cell }) => formatProfession(cell.getValue() as string),
      },
      {
        accessorKey: 'mobile_number',
        header: 'Phone Number',
        size: 150,
        Cell: ({ row }) => (
          <a
            href={`tel:${row.original.mobile_number}`}
            className="flex items-center space-x-4 rounded-lg bg-indigo-900 px-4 py-2 text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-indigo-800"
          >
            <FaPhoneAlt className="text-xl" />
            <span className="text-sm md:text-base">
              {row.original.mobile_number}
            </span>
          </a>
        ),
      },
    
    ],
    [],
  );

  // LOADING
  if (isLoading) {
    return <div className="mt-6 px-6 text-lg dark:bg-white">Loading...</div>;
  }

  // MAIN JSX
  return (
    <>
      <div className="mt-10">
        {/* Month Selector */}
        <div className="mb-4 flex justify-end">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchMonthlyAttendance(selectedMonth);
            }}
            className="flex max-w-lg items-center justify-end space-x-3 shadow-xl"
          >
            <select
              id="months"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-900 focus:ring-blue-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              {monthList.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-lg bg-blue-900 px-4 py-2 font-medium text-white hover:bg-blue-800"
            >
              Show
            </button>
          </form>
        </div>

        {/* Table */}
        <div className="mb-5 mt-0 rounded-md bg-white p-5 shadow-2xl">
          <MaterialReactTable
            columns={columns}
            data={data}
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
            muiTableBodyRowProps={{
              sx: {
                '&:hover': {
                  backgroundColor: '#f3f4f6',
                },
                cursor: 'pointer',
              },
            }}
          />
        </div>
      </div>
    </>
  );
};

export default AttendanceReport;




// 'use client';

// import { useEffect, useMemo, useState } from 'react';
// import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
// import { FaPhoneAlt } from 'react-icons/fa';
// import { getStudentReport } from 'services/apiCollection';

// type AttendanceEntry = {
//   class_date: string;
//   attendance_count: number;
//   total_students: number;
//   attendance_ratio: string;
// };

// type FacilitatorReport = {
//   facilitatorId: string;
//   facilitator_name: string;
//   phone_number: string;
//   report: AttendanceEntry[];
// };

// const groupList = [
//   'Nachiketa',
//   'Bhima',
//   'Arjun',
//   'Shadev',
//   'Nakul',
//   'Jagganath',
//   'DYS',
// ];

// const monthList = [
//   'January', 'February', 'March', 'April',
//   'May', 'June', 'July', 'August',
//   'September', 'October', 'November', 'December',
// ];

// const currentYear = new Date().getFullYear();
// const yearList = [currentYear - 1, currentYear, currentYear + 1];

// const getCurrentMonth = () => {
//   const now = new Date();
//   return now.getMonth() + 1; // Get current month as a number (1-12)
// };

// const AdminDas = () => {
//   const [data, setData] = useState<FacilitatorReport[]>([]);
//   const [progressDates, setProgressDates] = useState<string[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [groupName, setGroupName] = useState('Nachiketa');
//   const [month, setMonth] = useState(getCurrentMonth()); // Initialize as number
//   const [year, setYear] = useState(currentYear);

//   const fetchReport = async (group: string, month: number, year: number) => {
//     setIsLoading(true);
//     try {
//       // Pass the numeric month (1 = January, 2 = February, ..., 12 = December)
//       const res = await getStudentReport(group, month, year);
//       const reportData: FacilitatorReport[] = res.data;

//       // Get all unique dates from nested report arrays
//       const uniqueDatesSet = new Set<string>();
//       reportData.forEach((f) => {
//         f.report.forEach((entry) => {
//           const dateStr = new Date(entry.class_date).toLocaleDateString('en-IN');
//           uniqueDatesSet.add(dateStr);
//         });
//       });

//       const sortedDates = Array.from(uniqueDatesSet).sort((a, b) => {
//         return new Date(a).getTime() - new Date(b).getTime();
//       });

//       setProgressDates(sortedDates);
//       setData(reportData);
//     } catch (error) {
//       console.error('Error fetching facilitator report:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchReport(groupName, month, year); // Ensure month is passed as a number
//   }, [groupName, month, year]);

//   const columns = useMemo<MRT_ColumnDef<FacilitatorReport>[]>(() => {
//     return [
//       {
//         accessorKey: 'facilitator_name',
//         header: 'Name',
//         size: 200,
//       },
//       {
//         accessorKey: 'phone_number',
//         header: 'Phone Number',
//         size: 180,
//         Cell: ({ row }) => (
//           <a
//             href={`tel:${row.original.phone_number}`}
//             className="flex transform items-center space-x-4 rounded-lg bg-indigo-900 px-4 py-2 text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-indigo-800"
//           >
//             <FaPhoneAlt className="text-xl" />
//             <span className="text-sm md:text-base">{row.original.phone_number}</span>
//           </a>
//         ),
//       },
//       ...progressDates.map((date) => ({
//         header: date,
//         id: date,
//         accessorFn: (row: FacilitatorReport) => {
//           const entry = row.report.find((r) => {
//             const formatted = new Date(r.class_date).toLocaleDateString('en-IN');
//             return formatted === date;
//           });
//           return entry?.attendance_ratio || '-';
//         },
//         Cell: ({ cell }) => (
//           <span className="inline-block rounded bg-blue-100 px-2 py-1 text-blue-800">
//             {cell.getValue() as string} {/* Cast to string to resolve the unknown type error */}
//           </span>
//         ),
//       })),
//       {
//         id: 'average',
//         header: 'Monthly Avg',
//         accessorFn: (row: FacilitatorReport) => {
//           const total = row.report.reduce((acc, r) => acc + r.attendance_count, 0);
//           const count = row.report.length;
//           return count ? Math.round(total / count).toString() : '-';
//         },
//         Cell: ({ cell }) => (
//           <span className="inline-block rounded bg-green-100 px-2 py-1 text-green-800">
//             {cell.getValue() as string} {/* Cast to string to resolve the unknown type error */}
//           </span>
//         ),
//       },
//     ];
//   }, [progressDates]);

//   return (
//     <div className="mt-10">
//       {/* Filters */}
//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           fetchReport(groupName, month, year); // Pass month as a number
//         }}
//         className="mb-2 flex flex-wrap justify-end gap-2"
//       >
//         {/* Group Dropdown */}
//         <select
//           value={groupName}
//           onChange={(e) => setGroupName(e.target.value)}
//           className="rounded-lg w-48 border border-gray-300 bg-gray-100 p-2 text-sm text-gray-900"
//         >
//           {groupList.map((group) => (
//             <option key={group} value={group}>
//               {group}
//             </option>
//           ))}
//         </select>

//         {/* Month Dropdown */}
//         <select
//           value={month}
//           onChange={(e) => setMonth(Number(e.target.value))}
//           className="rounded-lg w-48 border border-gray-300 bg-gray-100 p-2 text-sm text-gray-900"
//         >
//           {monthList.map((m, index) => (
//             <option key={index} value={index + 1}> {/* month as 1-based index */}
//               {m}
//             </option>
//           ))}
//         </select>

//         {/* Year Dropdown */}
//         <select
//           value={year}
//           onChange={(e) => setYear(Number(e.target.value))}
//           className="rounded-lg w-32 border border-gray-300 bg-gray-100 p-2 text-sm text-gray-900"
//         >
//           {yearList.map((y) => (
//             <option key={y} value={y}>
//               {y}
//             </option>
//           ))}
//         </select>

//         {/* <button
//           type="submit"
//           className="rounded-lg bg-blue-900 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
//         >
//           Apply Filter
//         </button> */}
//       </form>

//       <div className="rounded-lg bg-white p-5 shadow-xl">
//         <MaterialReactTable
//           columns={columns}
//           data={data}
//           enableSorting
//           state={{ isLoading }}
//           getRowId={(row) =>
//             row?.facilitatorId ? row.facilitatorId.toString() : Math.random().toString()
//           }
//           muiTablePaperProps={{ sx: { overflow: 'visible !important' } }}
//           muiTableBodyCellProps={{ sx: { overflow: 'visible' } }}
//         />
//       </div>
//     </div>
//   );
// };

// export default AdminDas;















'use client';

import { useEffect, useMemo, useState } from 'react';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { FaPhoneAlt } from 'react-icons/fa';
import { getStudentReport } from 'services/apiCollection';

type AttendanceEntry = {
  class_date: string;
  attendance_count: number;
  total_students: number;
  attendance_ratio: string;
};

type FacilitatorReport = {
  facilitatorId: string;
  facilitator_name: string;
  phone_number: string;
  report: AttendanceEntry[];
};

const groupList = [
  'Nachiketa',
  'Bhima',
  'Arjun',
  'Shadev',
  'Nakul',
  'Jagganath',
  'DYS',
];

const monthList = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December',
];

const currentYear = new Date().getFullYear();
const yearList = [currentYear - 1, currentYear, currentYear + 1];

const getCurrentMonth = () => {
  const now = new Date();
  return now.getMonth() + 1; // Get current month as a number (1-12)
};

const AdminDas = () => {
  const [data, setData] = useState<FacilitatorReport[]>([]); 
  const [progressDates, setProgressDates] = useState<string[]>([]); 
  const [isLoading, setIsLoading] = useState(false);
  const [groupName, setGroupName] = useState('Nachiketa');
  const [month, setMonth] = useState(getCurrentMonth()); 
  const [year, setYear] = useState(currentYear);

  const fetchReport = async (group: string, month: number, year: number) => {
    setIsLoading(true);
    try {
      const res = await getStudentReport(group, month, year);
      const reportData: FacilitatorReport[] = res.data;

      const uniqueDatesSet = new Set<string>();
      reportData.forEach((f) => {
        f.report.forEach((entry) => {
          const dateStr = new Date(entry.class_date).toLocaleDateString('en-IN');
          uniqueDatesSet.add(dateStr);
        });
      });

      const sortedDates = Array.from(uniqueDatesSet).sort((a, b) => {
        return new Date(a).getTime() - new Date(b).getTime();
      });

      setProgressDates(sortedDates);
      setData(reportData);
    } catch (error) {
      console.error('Error fetching facilitator report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReport(groupName, month, year);
  }, [groupName, month, year]);

  const columns = useMemo<MRT_ColumnDef<FacilitatorReport>[]>(() => {
    return [
      {
        accessorKey: 'facilitator_name',
        header: 'Name',
        size: 200,
      },
      {
        accessorKey: 'phone_number',
        header: 'Phone Number',
        size: 180,
        Cell: ({ row }) => (
          <a
            href={`tel:${row.original.phone_number}`}
            className="flex transform items-center space-x-4 rounded-lg bg-indigo-900 px-4 py-2 text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-indigo-800"
          >
            <FaPhoneAlt className="text-xl" />
            <span className="text-sm md:text-base">{row.original.phone_number}</span>
          </a>
        ),
      },
      ...progressDates.map((date) => ({
        header: date,
        id: date,
        accessorFn: (row: FacilitatorReport) => {
          const entry = row.report.find((r) => {
            const formatted = new Date(r.class_date).toLocaleDateString('en-IN');
            return formatted === date;
          });
          return entry?.attendance_ratio || '-';
        },
        Cell: ({ cell }) => (
          <span className="inline-block rounded bg-blue-100 px-2 py-1 text-blue-800">
            {cell.getValue() as string}
          </span>
        ),
      })),
      {
        id: 'average',
        header: 'Monthly Avg',
        accessorFn: (row: FacilitatorReport) => {
          const total = row.report.reduce((acc, r) => acc + r.attendance_count, 0);
          const count = row.report.length;
          return count ? Math.round(total / count).toString() : '-';
        },
        Cell: ({ cell }) => (
          <span className="inline-block rounded bg-green-100 px-2 py-1 text-green-800">
            {cell.getValue() as string}
          </span>
        ),
      },
    ];
  }, [progressDates]);

  // Handle row click to pass userId
  const handleRowClick = (facilitatorId: string) => {
    console.log('Facilitator ID:', facilitatorId);
    // You can now send the facilitatorId wherever you need, e.g., make a new API request
    // For example, redirecting to a detailed page or opening a modal
  };

  return (
    <div className="mt-10">
      {/* Filters */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchReport(groupName, month, year);
        }}
        className="mb-2 flex flex-wrap justify-end gap-2"
      >
        <select
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="rounded-lg w-48 border border-gray-300 bg-gray-100 p-2 text-sm text-gray-900"
        >
          {groupList.map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>

        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="rounded-lg w-48 border border-gray-300 bg-gray-100 p-2 text-sm text-gray-900"
        >
          {monthList.map((m, index) => (
            <option key={index} value={index + 1}>
              {m}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="rounded-lg w-32 border border-gray-300 bg-gray-100 p-2 text-sm text-gray-900"
        >
          {yearList.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </form>

      <div className="rounded-lg bg-white p-5 shadow-xl">
        <MaterialReactTable
          columns={columns}
          data={data}
          enableSorting
          state={{ isLoading }}
          getRowId={(row) =>
            row?.facilitatorId ? row.facilitatorId.toString() : Math.random().toString()
          }
          muiTablePaperProps={{ sx: { overflow: 'visible !important' } }}
          muiTableBodyCellProps={{ sx: { overflow: 'visible' } }}
          onRowClick={({ row }) => handleRowClick(row.original.facilitatorId)} // Handling row click
        />
      </div>
    </div>
  );
};

export default AdminDas;




'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { FiEdit } from 'react-icons/fi';
import { getFrontlinerdetailReport, getGroupUserCount, getStudentClassReport } from 'services/apiCollection';
import { Users } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa6';
import { FaPhoneAlt } from 'react-icons/fa';

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

type Student = {
  student_id: number;
  student_name: string;
  mobile_number: string;
  GroupRatio: string;
  chanting_round: string;
  progress_report_data?: number[];
};

const monthList = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December',
];

const DetailPanel = ({ user_id }: { user_id: number }) => {
  const [classReport, setClassReport] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const currentMonth = monthList[new Date().getMonth()];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => `${currentYear - i}`);

  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(`${currentYear}`);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await getStudentClassReport(user_id);
        setClassReport(res);
      } catch (err) {
        console.error('Error fetching student class report:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [user_id]);

  useEffect(() => {
    if (!classReport || classReport.length === 0) return;

    const filtered = classReport.filter((entry) => {
      const date = new Date(entry.class_date);
      const entryMonth = monthList[date.getMonth()];
      const entryYear = date.getFullYear().toString();
      return entryMonth === month && entryYear === year;
    });

    setFilteredData(filtered);
  }, [classReport, month, year]);

  return (
    <div className="rounded-md bg-blue-50 p-4 text-sm">
      <div className="mb-6 flex gap-2 justify-end">
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="rounded w-44 border p-2 text-sm"
        >
          {monthList.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="rounded w-44 border p-2 text-sm"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filteredData.length === 0 ? (
        <p className="flex justify-center">No class report available for {month} {year}.</p>
      ) : (
        <ul className="space-y-2">
          {filteredData.map((entry, idx) => {
            const dateObj = new Date(entry.class_date);
            const formattedDate = dateObj.toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              weekday: 'long',
            });

            const isPresent = entry.status?.toLowerCase().includes('present');

            return (
              <li
                key={idx}
                className={`flex flex-wrap md:flex-nowrap justify-between items-center gap-2 rounded p-3 shadow-sm ${isPresent ? 'bg-green-100' : 'bg-red-100'}`}
              >
                <span className="w-full md:w-1/3 font-medium text-gray-800">{formattedDate}</span>
                <span className="w-full md:w-1/3 flex items-center gap-2 font-semibold">
                  {isPresent ? '✅ Present' : '❌ Absent'}
                </span>
                <span className="w-full md:w-1/3 text-xs text-gray-600">
                  Session: {entry.AttendanceSession || '—'}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default function FacilitatorUserReport() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const facilitatorName = searchParams.get('facilitatorName');
  const facilitatorId = params.facilitatorId as string;
  const defaultGroup = searchParams.get('groupName') || 'Not Provided';

  const [groupName, setGroupName] = useState(defaultGroup);
  const [data, setData] = useState<Student[]>([]);
  const [month, setMonth] = useState(monthList[new Date().getMonth()]);
  const [year, setYear] = useState(`${new Date().getFullYear()}`);

  const fetchData = useCallback(async () => {
    if (!facilitatorId) return;

    const monthNumber = monthList.indexOf(month) + 1; // Convert to 1-based month number

    try {
      const res = await getFrontlinerdetailReport(facilitatorId, groupName, monthNumber, year);
      setData(res);
    } catch (err) {
      console.error('Failed to fetch facilitator report:', err);
    }
  }, [facilitatorId, groupName, month, year]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const [groupData, setGroupData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchGroupData() {
      if (!facilitatorId) return;
      setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    }
    fetchGroupData();
  }, [facilitatorId]);

  const columns = useMemo<MRT_ColumnDef<Student>[]>(() => [
    { accessorKey: 'student_name', header: 'Name' },
    // { accessorKey: 'mobile_number', header: 'Phone Number' },
    {
      accessorKey: 'phone_number',
      header: 'Phone Number',
      Cell: ({ row }) => (
        <div className="flex space-x-4">
           <a
            href={`https://wa.me/${row.original.mobile_number}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-500 transition duration-300 ease-in-out transform hover:scale-105"
          >
            <FaWhatsapp className="text-lg" />
            {/* <span className="text-sm md:text-base">WhatsApp</span> */}
          </a>
          <a
            href={`tel:${row.original.mobile_number}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-indigo-900 text-white hover:bg-indigo-800 transition duration-300 ease-in-out transform hover:scale-105"
          >
            <FaPhoneAlt className="text-lg" />
            <span className="text-sm md:text-base">{row.original.mobile_number}</span>
          </a>
         
        </div>
      ),
    },
    { accessorKey: 'chanting_round', header: 'Chanting Round' },
    { accessorKey: 'GroupRatio', header: 'Total Report' },
    // {
    //   accessorKey: 'action',
    //   header: 'Edit',
    //   Cell: ({ row }) => (
    //     <button
    //       className="flex items-center gap-2 rounded bg-blue-900 px-3 py-1 text-white transition hover:bg-blue-800"
    //       onClick={() =>
    //         router.push(
    //           `/admin/batches/BatchId/edit/${row.original.student_id}?data=${encodeURIComponent(
    //             JSON.stringify(row.original),
    //           )}` 
    //         )
    //       }
    //     >
    //       <FiEdit size={16} />
    //       Edit
    //     </button>
    //   ),
    // },
     {
            accessorKey: 'action',
            header: 'Edit',
            Cell: ({ row }) => (
              <button
                className="flex items-center gap-2 rounded bg-blue-900 px-3 py-1 text-white hover:bg-blue-800"
                onClick={() =>
                  router.push(
                    `/admin/editstudent/${
                      row.original.student_id
                    }`
                  )
                }
              >
                <FiEdit size={16} />
                Edit
              </button>
            ),
          }
  ], [router]);

  return (
    <div className="mt-6">
        <h2 className="mb-5 text-lg font-bold dark:text-white">
        Facilitator {facilitatorName} Group Student Count</h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="animate-pulse rounded-xl bg-gray-300 p-6 h-32"
              />
            ))
          : groupData
              .filter((group) => group.total_users > 0)
              .map((group, idx) => (
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

      <h2 className="mt-5 mb-5 text-lg font-bold dark:text-white">
        Facilitator {facilitatorName} Student Report</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchData();
        }}
        className="mb-2 flex flex-wrap justify-end gap-1"
      >
        <select
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}  // Fix this to update groupName
          className="w-44 rounded border border-gray-300 bg-white p-2 text-sm"
        >
          {groupList.map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-44 rounded border p-2 text-sm"
        >
          {monthList.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-44 rounded border p-2 text-sm"
        >
          {Array.from({ length: 5 }, (_, i) => `${new Date().getFullYear() - i}`).map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </form>

      <div className="mx-auto max-w-7xl rounded-md bg-white p-6 shadow-xl">
        <MaterialReactTable
          columns={columns}
          data={data}
          enableSorting
          enableExpanding
          positionExpandColumn="last"
          renderDetailPanel={({ row }) => (
            <DetailPanel user_id={row.original.student_id} />
          )}
          enableGlobalFilter
          positionGlobalFilter="right"
          initialState={{ showGlobalFilter: true }}
          getRowId={(row) => row.student_id.toString()}
          muiTableHeadCellProps={{
            sx: { backgroundColor: '#dbeafe', fontWeight: 'bold' },
          }}
          muiTableBodyCellProps={{
            sx: { backgroundColor: '#f8fafc' },
          }}
        />
      </div>
    </div>
  );
}

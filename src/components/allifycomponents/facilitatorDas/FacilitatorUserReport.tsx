'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { FiEdit } from 'react-icons/fi';
import { getFrontlinerdetailReport, getStudentClassReport } from 'services/apiCollection';

type Student = {
  user_id: number;
  name: string;
  mobile_number: string;
  GroupRatio: string;
  chanting_round: string;
  progress_report_data: number[];
};

type GroupDataType = {
  group_name: string;
  total_users: number;
};

const monthList = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December',
];

// Accordion component
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
        <p className='flex justify-center'>No class report available for {month} {year}.</p>
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
                className={`flex flex-wrap md:flex-nowrap justify-between items-center gap-2 rounded p-3 shadow-sm ${
                  isPresent ? 'bg-green-100' : 'bg-red-100'
                }`}
              >
                <span className="w-full md:w-1/3 font-medium text-gray-800">{formattedDate}</span>
  
                <span className="w-full md:w-1/3 flex items-center gap-2 font-semibold">
                  {/* <span
                    className={`inline-block h-3 w-3 rounded-full ${
                      isPresent ? 'bg-green-600' : 'bg-red-600'
                    }`}
                  ></span> */}
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

export default function FacilitatorUserReport({ groupData }: { groupData: GroupDataType[] }) {
  const router = useRouter();
  const defaultGroup = groupData[0]?.group_name || '';
  const currentMonth = monthList[new Date().getMonth()];

  const [groupName, setGroupName] = useState(defaultGroup);
  const [data, setData] = useState<Student[]>([]);
  const [facilitatorId, setFacilitatorId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem('frontlinerId');
    setFacilitatorId(id);
  }, []);

  const fetchData = useCallback(async () => {
    if (!facilitatorId) return;
    try {
      const res = await getFrontlinerdetailReport(facilitatorId, groupName);
      setData(res);
    } catch (err) {
      console.error('Failed to fetch facilitator report:', err);
    }
  }, [facilitatorId, groupName]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns = useMemo<MRT_ColumnDef<Student>[]>(() => [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'mobile_number', header: 'Phone Number' },
    { accessorKey: 'chanting_round', header: 'Chanting Round' },
    { accessorKey: 'GroupRatio', header: 'Total Report' },
    {
      accessorKey: 'action',
      header: 'Edit',
      Cell: ({ row }) => (
        <button
          className="flex items-center gap-2 rounded bg-blue-900 px-3 py-1 text-white transition hover:bg-blue-800"
          onClick={() =>
            router.push(
              `/admin/batches/BatchId/edit/${row.original.user_id}?data=${encodeURIComponent(
                JSON.stringify(row.original),
              )}`
            )
          }
        >
          <FiEdit size={16} />
          Edit
        </button>
      ),
    },
  ], [router]);

  return (
    <div className="mt-6">
      <h2 className="mb-6 text-xl font-bold text-black">Facilitator User Report</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchData();
        }}
        className="mb-2 flex flex-wrap justify-end gap-1"
      >
        <select
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="w-44 rounded border border-gray-300 bg-white p-2 text-sm"
        >
          {groupData.map((group) => (
            <option key={group.group_name} value={group.group_name}>
              {group.group_name}
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
            <DetailPanel user_id={row.original.user_id} />
          )}
          enableGlobalFilter
          positionGlobalFilter="right"
          initialState={{ showGlobalFilter: true }}
          getRowId={(row) => row.user_id.toString()}
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

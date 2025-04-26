'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { FiEdit } from 'react-icons/fi';
import { getFrontlinerdetailReport } from 'services/apiCollection';
import DetailPanel from './DetailPanel';

type Student = {
  student_id?: number;
  user_id?: number;
  student_name: string;
  mobile_number: string;
  GroupRatio: string;
  chanting_round: string;
  progress_report_data?: number[];
};

type GroupDataType = {
  group_name: string;
  total_users: number;
};

const monthList = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default function FacilitatorUserReport({
  groupData,
}: {
  groupData: GroupDataType[];
}) {
  const router = useRouter();
  const defaultGroup = groupData[0]?.group_name ?? '';
  const currentMonth = monthList[new Date().getMonth()];

  const [groupName, setGroupName] = useState(defaultGroup);
  const [data, setData] = useState<Student[]>([]);
  const [facilitatorId, setFacilitatorId] = useState<string | null>(null);
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(`${new Date().getFullYear()}`);
  const [tableLoading, setTableLoading] = useState(true);

  useEffect(() => {
    setFacilitatorId(localStorage.getItem('frontlinerId'));
  }, []);

  const fetchData = useCallback(async () => {
    if (!facilitatorId) return;
    setTableLoading(true);

    try {
      const mNum = monthList.indexOf(month) + 1;
      const res = await getFrontlinerdetailReport(
        facilitatorId,
        groupName,
        mNum,
        year,
      );
      setData(res);
    } finally {
      setTableLoading(false);
    }
  }, [facilitatorId, groupName, month, year]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns = useMemo<MRT_ColumnDef<Student>[]>(
    () => [
      { accessorKey: 'student_name', header: 'Name' },
      { accessorKey: 'mobile_number', header: 'Phone Number' },
      { accessorKey: 'chanting_round', header: 'Chanting Round' },
      { accessorKey: 'GroupRatio', header: 'Total Report' },
      {
        accessorKey: 'action',
        header: 'Edit',
        Cell: ({ row }) => (
          <button
            className="flex items-center gap-2 rounded bg-blue-900 px-3 py-1 text-white hover:bg-blue-800"
            onClick={() =>
              router.push(
                `/admin/batches/BatchId/edit/${
                  row.original.student_id ?? row.original.user_id
                }?data=${encodeURIComponent(JSON.stringify(row.original))}`,
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

  return (
    <div className="mt-6">
      <h2 className="text-black mb-6 text-xl font-bold">Student Report</h2>

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
          {groupData.map((g) => (
            <option key={g.group_name}>{g.group_name}</option>
          ))}
        </select>

        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-44 rounded border p-2 text-sm"
        >
          {monthList.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-44 rounded border p-2 text-sm"
        >
          {Array.from(
            { length: 5 },
            (_, i) => `${new Date().getFullYear() - i}`,
          ).map((y) => (
            <option key={y}>{y}</option>
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
            <DetailPanel
              user_id={
                (row.original.student_id ?? row.original.user_id) as number
              }
            />
          )}
          enableGlobalFilter
          positionGlobalFilter="right"
          initialState={{ showGlobalFilter: true }}
          getRowId={(r) =>
            (r.student_id ?? r.user_id ?? Math.random()).toString()
          }
          muiTableHeadCellProps={{
            sx: { backgroundColor: '#dbeafe', fontWeight: 'bold' },
          }}
          muiTableBodyCellProps={{
            sx: { backgroundColor: '#f8fafc' },
          }}
          state={{ isLoading: tableLoading }}
        />
      </div>
    </div>
  );
}

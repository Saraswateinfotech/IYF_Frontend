
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { FaPhoneAlt } from 'react-icons/fa';
import { getStudentReport } from 'services/apiCollection';

/* ────────────────────────── types ────────────────────────── */
type AttendanceEntry = {
  class_date: string;
  attendance_count: number;
  total_students: number;
  attendance_ratio: string; // e.g. "1/3"
};

type FacilitatorReport = {
  facilitatorId: string;
  facilitator_name: string;
  phone_number: string;
  report: AttendanceEntry[];
};

/* ─────────────────── static select lists ─────────────────── */
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
const currentYear = new Date().getFullYear();
const yearList = [currentYear - 1, currentYear, currentYear + 1];
const getCurrentMonth = () => new Date().getMonth() + 1;

/* ───────────────────────── component ──────────────────────── */
const FacilitatorsForAdmin: React.FC = () => {
  const router = useRouter();

  const [data, setData] = useState<FacilitatorReport[]>([]);
  const [progressDates, setProgressDates] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [groupName, setGroupName] = useState('Nachiketa');
  const [month, setMonth] = useState(getCurrentMonth());
  const [year, setYear] = useState(currentYear);

  /* ─────────────── fetch helper ─────────────── */
  const fetchReport = async (grp: string, m: number, y: number) => {
    setIsLoading(true);
    try {
      const res = await getStudentReport(grp, m, y);
      const reportData: FacilitatorReport[] = res.data;

      /* unique dates for dynamic cols */
      const dates = new Set<string>();
      reportData.forEach(f =>
        f.report.forEach(r =>
          dates.add(new Date(r.class_date).toLocaleDateString('en-IN')),
        ),
      );

      setProgressDates(
        Array.from(dates).sort(
          (a, b) => new Date(a).getTime() - new Date(b).getTime(),
        ),
      );
      setData(reportData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReport(groupName, month, year);
  }, [groupName, month, year]);

  /* ─────────────── columns ─────────────── */
  const columns = useMemo<MRT_ColumnDef<FacilitatorReport>[]>(() => {
    const baseCols: MRT_ColumnDef<FacilitatorReport>[] = [
      /* Name */
      { accessorKey: 'facilitator_name', header: 'Name', size: 200 },

      
{
  accessorKey: 'phone_number',
  header: 'Phone Number',
  size: 180,
  Cell: ({ row }) => (
    <a
      href={`tel:${row.original.phone_number}`}
      onClick={e => e.stopPropagation()}
      className="flex items-center space-x-2 rounded-lg bg-indigo-900 px-4 py-2 text-white transition hover:bg-indigo-800"
    >
      <FaPhoneAlt />
      <span>{row.original.phone_number}</span>
    </a>
  ),
},


      {
        id: 'average',
        header: 'Monthly Avg',
        size: 110,
        accessorFn: row => {
          const present = row.report.reduce(
            (s, r) => s + r.attendance_count,
            0,
          );
          const total = row.report.reduce((s, r) => s + r.total_students, 0);
          return total ? `${Math.round((present / total) * 100)}%` : '-';
        },
        Cell: ({ cell }) => (
          <span className="inline-block rounded bg-green-100 px-2 py-1 text-green-800">
            {cell.getValue() as string}
          </span>
        ),
      },
    ];

    const dateCols = progressDates.map(date => ({
      header: date,
      id: date,
      size: 70,
      accessorFn: (row: FacilitatorReport) =>
        row.report.find(
          r => new Date(r.class_date).toLocaleDateString('en-IN') === date,
        )?.attendance_ratio ?? '-',
      Cell: ({ cell }) => (
        <span className="inline-block rounded bg-blue-100 px-2 py-1 text-blue-800">
          {cell.getValue() as string}
        </span>
      ),
    }));

    return [...baseCols, ...dateCols];
  }, [progressDates]);

  /* ─────────────── navigation on row click ─────────────── */
  const handleRowClick = (id: string) => {
    router.push(
      `/admin/facilitatorUserReport/${id}?groupName=${groupName}&month=${month}&year=${year}`,
    );
  };

  /* ───────────── UI ─────────────── */
  return (
    <>
    <div className="mt-10">
      {/* filters */}
      <form
        onSubmit={e => {
          e.preventDefault();
          fetchReport(groupName, month, year);
        }}
        className="mb-2 flex flex-wrap justify-end gap-1"
      >
        <select
          value={groupName}
          onChange={e => setGroupName(e.target.value)}
          className="w-44 rounded border p-2 text-sm"
        >
          {groupList.map(g => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        <select
          value={month}
          onChange={e => setMonth(+e.target.value)}
          className="w-44 rounded border p-2 text-sm"
        >
          {monthList.map((m, i) => (
            <option key={m} value={i + 1}>
              {m}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={e => setYear(+e.target.value)}
          className="w-44 rounded border p-2 text-sm"
        >
          {yearList.map(y => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </form>

      {/* table */}
      <div className="rounded bg-white p-5 shadow">
        <MaterialReactTable
          columns={columns}
          data={data}
          state={{ isLoading }}
          muiTableBodyRowProps={({ row }) => ({
            onClick: () => handleRowClick(row.original.facilitatorId),
            sx: { cursor: 'pointer' },
          })}
          muiTablePaperProps={{ sx: { overflow: 'visible !important' } }}
          muiTableBodyCellProps={{ sx: { overflow: 'visible' } }}
        />
      </div>
    </div>
    </>
  );
};

export default FacilitatorsForAdmin;

'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { FiEdit } from 'react-icons/fi';
import { getFrontlinerdetailReport } from 'services/apiCollection';
import DetailPanel from './DetailPanel';
import { FaWhatsapp } from 'react-icons/fa6';
import { FaPhoneAlt } from 'react-icons/fa';

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
  const [darkMode, setDarkMode] = useState(
    document.body.classList.contains('dark'),
  );

  const [groupName, setGroupName] = useState(defaultGroup);
  const [data, setData] = useState<Student[]>([]);
  const [facilitatorId, setFacilitatorId] = useState<string | null>(null);
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(`${new Date().getFullYear()}`);
  const [tableLoading, setTableLoading] = useState(true);

  // Sync darkMode state with document.body.classList
  useEffect(() => {
    const updateDarkMode = () => {
      const isDark = document.body.classList.contains('dark');
      setDarkMode(isDark);

      const elements = document.querySelectorAll(
        '.mrt-table-container, .mrt-table-paper, .mrt-toolbar',
      );
      elements.forEach((el) => {
        isDark ? el.classList.add('mrt-dark') : el.classList.remove('mrt-dark');
      });
    };

    updateDarkMode();

    const observer = new MutationObserver(updateDarkMode);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

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
      {
        accessorKey: 'student_name',
        header: 'Name',
        Cell: ({ cell }) => (
          <span
            className="data-cell"
            style={{ color: darkMode ? 'white' : 'inherit' }}
          >
            {cell.getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: 'mobile_number',
        header: 'Phone Number',
        Cell: ({ row }) => (
          <div className="flex space-x-4">
            <a
              href={`https://wa.me/${row.original.mobile_number}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex transform items-center space-x-2 rounded-lg bg-green-600 px-4 py-2 text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-green-500"
            >
              <FaWhatsapp className="text-lg" />
            </a>
            <a
              href={`tel:${row.original.mobile_number}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex transform items-center space-x-2 rounded-lg bg-indigo-900 px-4 py-2 text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-indigo-800"
            >
              <FaPhoneAlt className="text-lg" />
              <span className="text-sm md:text-base">
                {row.original.mobile_number}
              </span>
            </a>
          </div>
        ),
      },
      {
        accessorKey: 'chanting_round',
        header: 'Chanting Round',
        Cell: ({ cell }) => (
          <span
            className="data-cell"
            style={{ color: darkMode ? 'white' : 'inherit' }}
          >
            {cell.getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: 'GroupRatio',
        header: 'Total Report',
        Cell: ({ cell }) => (
          <span
            className="data-cell"
            style={{ color: darkMode ? 'white' : 'inherit' }}
          >
            {cell.getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: 'action',
        header: 'Edit',
        Cell: ({ row }) => (
          <button
            className="flex items-center gap-2 rounded bg-blue-900 px-3 py-1 text-white hover:bg-blue-800"
            onClick={() =>
              router.push(
                `/admin/editstudent/${
                  row.original.student_id ?? row.original.user_id
                }`,
              )
            }
          >
            <FiEdit size={16} />
            Edit
          </button>
        ),
      },
    ],
    [darkMode, router],
  );

  const tableStyles = useMemo(
    () => ({
      muiTablePaperProps: {
        className: 'mrt-table-paper',
        sx: {
          backgroundColor: darkMode ? '#2d396b' : '#fff',
          backgroundImage: 'none',
          boxShadow: 'none',
          borderRadius: '0.5rem',
        },
      },
      muiTableProps: {
        sx: {
          backgroundColor: 'transparent',
          color: 'white !important',
        },
      },
      muiTableContainerProps: {
        className: 'mrt-table-container',
        sx: {
          maxHeight: 'calc(100vh - 350px)',
          '& .MuiTableHead-root': {
            position: 'sticky',
            top: 0,
            zIndex: 2,
          },
        },
      },
      muiTableBodyProps: {
        sx: {
          '& .MuiTableRow-root': {
            backgroundColor: `${darkMode ? '#2d396b' : '#f8fafc'} !important`,
            '&:hover': {
              backgroundColor: '#3a4a8a !important',
            },
            '&[data-selected="true"]': {
              backgroundColor: '#3a4a8a !important',
            },
          },
        },
      },
      muiTableHeadCellProps: {
        sx: {
          backgroundColor: `${darkMode ? '#1a2255' : '#312e81'} !important`,
          color: 'white !important',
          fontSize: '16px !important',
          fontWeight: 'bold !important',
          position: 'sticky',
          top: 0,
          zIndex: 3,
          '& .MuiTableSortLabel-root': {
            color: 'white !important',
          },
          '& .MuiTableSortLabel-icon': {
            color: 'white !important',
          },
          '& .MuiTableSortLabel-iconDirectionAsc': {
            color: '#fff !important',
          },
          '& .MuiTableSortLabel-iconDirectionDesc': {
            color: '#fff !important',
          },
          '& .MuiCheckbox-root': {
            color: 'white !important',
            '&.Mui-checked': {
              color: 'white !important',
            },
            '&.MuiCheckbox-indeterminate': {
              color: 'white !important',
            },
          },
        },
      },
      muiTableBodyCellProps: {
        sx: {
          backgroundColor: 'inherit !important',
          color: `${darkMode ? 'white' : 'inherit'} !important`,
          borderColor: `${darkMode ? '#374151' : '#e5e7eb'} !important`,
          '& .MuiCheckbox-root': {
            color: darkMode
              ? 'white !important'
              : 'rgba(0, 0, 0, 0.87) !important',
            '&.Mui-checked': {
              color: darkMode
                ? 'white !important'
                : 'rgba(0, 0, 0, 0.87) !important',
            },
            '&.MuiCheckbox-indeterminate': {
              color: darkMode
                ? 'white !important'
                : 'rgba(0, 0, 0, 0.87) !important',
            },
          },
        },
      },
      muiTopToolbarProps: {
        className: 'mrt-toolbar',
        sx: {
          backgroundColor: `${darkMode ? '#2d396b' : '#fff'} !important`,
          color: `${darkMode ? 'white' : 'inherit'} !important`,
          '& input': {
            color: `${darkMode ? 'white' : 'inherit'} !important`,
            backgroundColor: `${darkMode ? '#2d396b' : '#fff'} !important`,
            borderColor: `${darkMode ? '#4b5563' : '#d1d5db'} !important`,
          },
          '& .MuiSvgIcon-root': {
            color: `${darkMode ? 'white' : 'inherit'} !important`,
          },
          '& .MuiIconButton-root': {
            color: `${darkMode ? 'white' : 'inherit'} !important`,
          },
        },
      },
      muiColumnActionsButtonProps: {
        sx: {
          color: `${darkMode ? 'white' : 'inherit'} !important`,
          '& .MuiSvgIcon-root': {
            color: `${darkMode ? 'white' : 'inherit'} !important`,
          },
        },
      },
    }),
    
    [darkMode],
  );

  return (
    <>
      <style jsx global>{`
        .mrt-dark .MuiTableRow-root {
          background-color: #2d396b !important;
        }
        .mrt-dark .MuiTableCell-root:not(.MuiTableHead-root *) {
          background-color: inherit !important;
          color: white !important;
        }
        .mrt-dark .data-cell {
          color: white !important;
        }
        .mrt-dark .mrt-toolbar {
          background-color: #1e293b !important;
          color: white !important;
        }
        .mrt-dark .mrt-toolbar input {
          color: white !important;
          background-color: #2d3748 !important;
          border-color: #4b5563 !important;
        }
        .mrt-dark .mrt-toolbar .MuiSvgIcon-root {
          color: white !important;
        }
        .mrt-dark .mrt-toolbar .MuiIconButton-root {
          color: white !important;
        }
        .mrt-table-container {
          overflow: auto !important;
        }
        .MuiTableHead-root {
          position: sticky !important;
          top: 0 !important;
          zindex: 10 !important;
        }
        .mrt-dark .MuiSvgIcon-root {
          color: white !important;
        }
        .MuiTableBody-root .MuiTableCell-root:not(.data-cell) {
          color: ${darkMode ? '#ffffff' : '#000000'} !important;
        }
        .MuiTableHead-root .MuiTableCell-root {
          background-color: ${darkMode ? '#1a2255' : '#312e81'} !important;
          color: white !important;
        }
      `}</style>

      <div className="mt-6">
        <h2
          className={`mb-5 text-lg font-bold ${
            darkMode ? 'text-white' : 'text-black'
          }`}
        >
          Student Report
        </h2>

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
            className={`w-44 rounded border p-2 text-sm ${
              darkMode
                ? 'border-gray-600 bg-gray-700 text-white'
                : 'text-black border-gray-300 bg-white'
            }`}
          >
            {groupData.map((g) => (
              <option key={g.group_name}>{g.group_name}</option>
            ))}
          </select>

          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className={`w-44 rounded border p-2 text-sm ${
              darkMode
                ? 'border-gray-600 bg-gray-700 text-white'
                : 'text-black border-gray-300 bg-white'
            }`}
          >
            {monthList.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>

          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className={`w-44 rounded border p-2 text-sm ${
              darkMode
                ? 'border-gray-600 bg-gray-700 text-white'
                : 'text-black border-gray-300 bg-white'
            }`}
          >
            {Array.from(
              { length: 5 },
              (_, i) => `${new Date().getFullYear() - i}`,
            ).map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
        </form>

        <div
          className={`mb-5 mt-0 rounded-md p-5 shadow-2xl ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}
        >
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
            muiTablePaperProps={tableStyles.muiTablePaperProps}
            muiTableProps={tableStyles.muiTableProps}
            muiTableContainerProps={tableStyles.muiTableContainerProps}
            muiTableBodyProps={tableStyles.muiTableBodyProps}
            muiTableHeadCellProps={tableStyles.muiTableHeadCellProps}
            muiTableBodyCellProps={tableStyles.muiTableBodyCellProps}
            muiTopToolbarProps={tableStyles.muiTopToolbarProps}
            muiColumnActionsButtonProps={
              tableStyles.muiColumnActionsButtonProps
            }
            state={{ isLoading: tableLoading }}
          />
        </div>
      </div>
    </>
  );
}

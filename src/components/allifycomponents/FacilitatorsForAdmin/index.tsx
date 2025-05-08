'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MaterialReactTable } from 'material-react-table';
import { FaPhoneAlt } from 'react-icons/fa';
import { getStudentReport } from 'services/apiCollection';
import { FaWhatsapp } from 'react-icons/fa6';

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
const FacilitatorsForAdmin = () => {
  const router = useRouter();

  const [data, setData] = useState([]);
  const [progressDates, setProgressDates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(document.body.classList.contains('dark'));

  const [groupName, setGroupName] = useState('Nachiketa');
  const [month, setMonth] = useState(getCurrentMonth());
  const [year, setYear] = useState(currentYear);

  /* ─────────────── dark mode detection ─────────────── */
  useEffect(() => {
    const updateDarkMode = () => {
      const isDark = document.body.classList.contains('dark');
      setDarkMode(isDark);
    };

    updateDarkMode();

    const observer = new MutationObserver(updateDarkMode);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  /* ─────────────── fetch helper ─────────────── */
  const fetchReport = async (grp, m, y) => {
    setIsLoading(true);
    try {
      const res = await getStudentReport(grp, m, y);
      const reportData = res.data;

      /* unique dates for dynamic cols */
      const dates = new Set();
      reportData.forEach(f =>
        f.report.forEach(r =>
          dates.add(new Date(r.class_date).toLocaleDateString('en-IN')),
        ),
      );

      setProgressDates(
        Array.from(dates).sort((a, b) => {
          // Ensure a and b are strings and parse DD/MM/YYYY format
          if (typeof a !== 'string' || typeof b !== 'string') return 0;
          const parseDate = (dateStr) => {
            const [day, month, year] = dateStr.split('/').map(Number);
            return new Date(year, month - 1, day);
          };
          return parseDate(a).getTime() - parseDate(b).getTime();
        }),
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
  const columns = useMemo(
    () => {
      const baseCols = [
        /* Name */
        {
          accessorKey: 'facilitator_name',
          header: 'Name',
          size: 200,
          enableSorting: true,
          Cell: ({ cell }) => (
            <span className="data-cell" style={{ color: darkMode ? 'white' : 'inherit' }}>
              {cell.getValue()}
            </span>
          ),
        },
        {
          accessorKey: 'phone_number',
          header: 'Phone Number',
          size: 250,
          enableSorting: true,
          Cell: ({ row }) => (
            <div className="flex space-x-4">
              <a
                href={`https://wa.me/${row.original.phone_number}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className={`inline-flex transform items-center space-x-2 rounded-lg px-4 py-2 text-white transition duration-300 ease-in-out hover:scale-105 ${
                  darkMode ? 'bg-green-700 hover:bg-green-600' : 'bg-green-600 hover:bg-green-500'
                }`}
              >
                <FaWhatsapp className="text-lg" />
              </a>
              <a
                href={`tel:${row.original.phone_number}`}
                onClick={(e) => e.stopPropagation()}
                className={`inline-flex transform items-center space-x-2 rounded-lg px-4 py-2 text-white transition duration-300 ease-in-out hover:scale-105 ${
                  darkMode ? 'bg-indigo-800 hover:bg-indigo-700' : 'bg-indigo-900 hover:bg-indigo-800'
                }`}
              >
                <FaPhoneAlt className="text-lg" />
                <span className="text-sm md:text-base">{row.original.phone_number}</span>
              </a>
            </div>
          ),
        },
        {
          id: 'average',
          header: 'Monthly Avg',
          size: 110,
          enableSorting: true,
          accessorFn: row => {
            const present = row.report.reduce(
              (s, r) => s + r.attendance_count,
              0,
            );
            const total = row.report.reduce((s, r) => s + r.total_students, 0);
            return total ? `${Math.round((present / total) * 100)}%` : '-';
          },
          Cell: ({ cell }) => (
            <span className={`inline-block rounded px-2 py-1 ${
              darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'
            }`}>
              {cell.getValue()}
            </span>
          ),
        },
      ];

      const dateCols = progressDates.map(date => ({
        header: date,
        id: date,
        size: 70,
        enableSorting: true,
        accessorFn: row =>
          row.report.find(
            r => new Date(r.class_date).toLocaleDateString('en-IN') === date,
          )?.attendance_ratio ?? '-',
        Cell: ({ cell }) => (
          <span className={`inline-block rounded px-2 py-1 ${
            darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'
          }`}>
            {cell.getValue()}
          </span>
        ),
      }));

      return [...baseCols, ...dateCols];
    },
    [darkMode, progressDates],
  );

  /* ─────────────── navigation on row click ─────────────── */
  const handleRowClick = (id, name) => {
    router.push(
      `/admin/facilitatorUserReport/${id}?groupName=${groupName}&month=${month}&year=${year}&facilitatorName=${encodeURIComponent(name)}`,
    );
  };

  /* ─────────────── table styles ─────────────── */
  const tableStyles = useMemo(
    () => ({
      muiTablePaperProps: {
        className: 'mrt-table-paper',
        sx: {
          backgroundColor: darkMode ? '#2d396b' : '#fff',
          backgroundImage: 'none',
          boxShadow: 'none',
          borderRadius: '0.5rem',
          border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
          overflow: 'visible !important',
        },
      },
      muiTableProps: {
        sx: {
          backgroundColor: 'transparent',
        },
      },
      muiTableContainerProps: {
        sx: {
          maxHeight: 'calc(100vh - 350px)',
          overflowY: 'auto',
          '& .MuiTableHead-root': {
            position: 'sticky',
            top: 0,
            zIndex: 10,
          },
        },
      },
      muiTableBodyProps: {
        sx: {
          '& .MuiTableRow-root': {
            backgroundColor: `${darkMode ? '#2d396b' : '#fff'} !important`,
            '&:hover': {
              backgroundColor: `${darkMode ? '#3a4a8a' : '#f3f4f6'} !important`,
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
          zIndex: 10,
          '& .MuiTableSortLabel-icon': {
            color: 'white !important',
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
          overflow: 'visible',
          '& .MuiCheckbox-root': {
            color: darkMode ? 'white !important' : 'rgba(0, 0, 0, 0.87) !important',
            '&.Mui-checked': {
              color: darkMode ? 'white !important' : 'rgba(0, 0, 0, 0.87) !important',
            },
            '&.MuiCheckbox-indeterminate': {
              color: darkMode ? 'white !important' : 'rgba(0, 0, 0, 0.87) !important',
            },
          },
        },
      },
      muiPaginationProps: {
        className: 'mrt-pagination',
        sx: {
          backgroundColor: `${darkMode ? '#1E293B' : '#fff'} !important`,
          color: `${darkMode ? 'white' : 'inherit'} !important`,
          borderTop: `1px solid ${darkMode ? '#374151' : '#e5e7eb'} !important`,
          '& .MuiButtonBase-root': {
            color: `${darkMode ? 'white' : 'inherit'} !important`,
            '&.Mui-selected': {
              backgroundColor: `${darkMode ? '#2d396b' : '#e5e7eb'} !important`,
            },
            '&:hover': {
              backgroundColor: `${darkMode ? '#3a4a8a' : '#f3f4f6'} !important`,
            },
          },
          '& .Mui-disabled': {
            color: `${darkMode ? '#64748B' : '#9CA3AF'} !important`,
          },
          '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
            color: `${darkMode ? 'white' : 'inherit'} !important`,
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
      muiFilterTextFieldProps: {
        sx: {
          color: `${darkMode ? 'white' : 'inherit'} !important`,
          backgroundColor: `${darkMode ? '#374151' : '#fff'} !important`,
          '& .MuiInputBase-root': {
            color: `${darkMode ? 'white' : 'inherit'} !important`,
            caretColor: `${darkMode ? 'white' : 'inherit'} !important`,
          },
          '& .MuiInputBase-input': {
            color: `${darkMode ? 'white' : 'inherit'} !important`,
            caretColor: `${darkMode ? 'white' : 'inherit'} !important`,
            '&::placeholder': {
              color: `${darkMode ? '#d1d5db' : '#6b7280'} !important`,
              opacity: 1,
            },
          },
          '& .MuiInputLabel-root': {
            color: `${darkMode ? 'white' : 'inherit'} !important`,
          },
          '& .MuiSvgIcon-root': {
            color: `${darkMode ? 'white' : 'inherit'} !important`,
          },
        },
      },
      muiColumnActionsButtonProps: {
        sx: {
          color: 'white !important', // Ensure three-dot menu is always white
        },
      },
    }),
    [darkMode],
  );

  /* ───────────── UI ─────────────── */
  return (
    <>
      <style jsx global>{`
        .mrt-dark .MuiSvgIcon-root {
          color: white !important;
        }
        .mrt-dark .MuiInputBase-root .MuiInputBase-input {
          color: white !important;
          caret-color: white !important;
        }
        .mrt-dark .MuiInputBase-root .MuiInputBase-input::placeholder {
          color: #d1d5db !important;
          opacity: 1 !important;
        }
      `}</style>

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
            className={`w-44 rounded border p-2 text-sm ${
              darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
            }`}
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
            className={`w-44 rounded border p-2 text-sm ${
              darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
            }`}
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
            className={`w-44 rounded border p-2 text-sm ${
              darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
            }`}
          >
            {yearList.map(y => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </form>

        {/* table */}
        <div className={`rounded p-5 shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <MaterialReactTable
            columns={columns}
            data={data}
            state={{ isLoading }}
            enableSorting
            enableColumnActions
            enableColumnFilters
            enablePagination
            enableBottomToolbar
            muiTableBodyRowProps={({ row }) => ({
              onClick: () => handleRowClick(row.original.facilitatorId, row.original.facilitator_name),
              sx: { cursor: 'pointer' },
            })}
            muiTablePaperProps={tableStyles.muiTablePaperProps}
            muiTableProps={tableStyles.muiTableProps}
            muiTableContainerProps={tableStyles.muiTableContainerProps}
            muiTableBodyProps={tableStyles.muiTableBodyProps}
            muiTableHeadCellProps={tableStyles.muiTableHeadCellProps}
            muiTableBodyCellProps={tableStyles.muiTableBodyCellProps}
            muiPaginationProps={tableStyles.muiPaginationProps}
            muiTopToolbarProps={tableStyles.muiTopToolbarProps}
            muiFilterTextFieldProps={tableStyles.muiFilterTextFieldProps}
            muiColumnActionsButtonProps={tableStyles.muiColumnActionsButtonProps}
          />
        </div>
      </div>
    </>
  );
};

export default FacilitatorsForAdmin;
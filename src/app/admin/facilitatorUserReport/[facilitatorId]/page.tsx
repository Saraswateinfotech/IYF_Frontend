'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { MaterialReactTable } from 'material-react-table';
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

const monthList = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December',
];

const DetailPanel = ({ user_id }) => {
  const [classReport, setClassReport] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(document.body.classList.contains('dark'));

  const currentMonth = monthList[new Date().getMonth()];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => `${currentYear - i}`);

  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(`${currentYear}`);

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
    <div className={`rounded-md p-4 text-sm ${darkMode ? 'bg-gray-800 text-white' : 'bg-blue-50 text-gray-800'}`}>
      <div className="mb-6 flex gap-2 justify-end">
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className={`w-44 rounded border p-2 text-sm ${
            darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
          }`}
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
          className={`w-44 rounded border p-2 text-sm ${
            darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
          }`}
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
                className={`flex flex-wrap md:flex-nowrap justify-between items-center gap-2 rounded p-3 shadow-sm ${
                  isPresent
                    ? darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'
                    : darkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800'
                }`}
              >
                <span className="w-full md:w-1/3 font-medium">{formattedDate}</span>
                <span className="w-full md:w-1/3 flex items-center gap-2 font-semibold">
                  {isPresent ? '✅ Present' : '❌ Absent'}
                </span>
                <span className="w-full md:w-1/3 text-xs">
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
  const facilitatorId = params.facilitatorId;
  const defaultGroup = searchParams.get('groupName') || 'Not Provided';

  const [groupName, setGroupName] = useState(defaultGroup);
  const [data, setData] = useState([]);
  const [month, setMonth] = useState(monthList[new Date().getMonth()]);
  const [year, setYear] = useState(`${new Date().getFullYear()}`);
  const [groupData, setGroupData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(document.body.classList.contains('dark'));

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

  const fetchData = useCallback(async () => {
    if (!facilitatorId) return;

    const monthNumber = monthList.indexOf(month) + 1;

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

  useEffect(() => {
    async function fetchGroupData() {
      if (!facilitatorId) return;
      setIsLoading(true);
      try {
        const rawData = await getGroupUserCount(facilitatorId);
        const formatted = groupList.map((group, index) => {
          const match = rawData.find((d) => d.group_name === group);
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

  const columns = useMemo(() => [
    { accessorKey: 'student_name', header: 'Name' },
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
            className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition duration-300 ease-in-out transform hover:scale-105 ${
              darkMode ? 'bg-green-700 hover:bg-green-600' : 'bg-green-600 hover:bg-green-500'
            }`}
          >
            <FaWhatsapp className="text-lg" />
          </a>
          <a
            href={`tel:${row.original.mobile_number}`}
            onClick={(e) => e.stopPropagation()}
            className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition duration-300 ease-in-out transform hover:scale-105 ${
              darkMode ? 'bg-indigo-800 hover:bg-indigo-700' : 'bg-indigo-900 hover:bg-indigo-800'
            }`}
          >
            <FaPhoneAlt className="text-lg" />
            <span className="text-sm md:text-base">{row.original.mobile_number}</span>
          </a>
        </div>
      ),
    },
    { accessorKey: 'chanting_round', header: 'Chanting Round' },
    { accessorKey: 'GroupRatio', header: 'Total Report' },
    {
      accessorKey: 'action',
      header: 'Edit',
      Cell: ({ row }) => (
        <button
          className={`flex items-center gap-2 rounded px-3 py-1 text-white transition ${
            darkMode ? 'bg-blue-800 hover:bg-blue-700' : 'bg-blue-900 hover:bg-blue-800'
          }`}
          onClick={() =>
            router.push(`/admin/editstudent/${row.original.student_id}`)
          }
        >
          <FiEdit size={16} />
          Edit
        </button>
      ),
    },
  ], [router, darkMode]);

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
          backgroundColor: `${darkMode ? '#1E293B' : '#fff'} !important`,
          color: `${darkMode ? 'white' : 'inherit'} !important`,
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
              color: `${darkMode ? 'white' : '#6b7280'} !important`,
              opacity: 1,
            },
          },
          '& .MuiInputLabel-root': {
            color: `${darkMode ? 'white' : 'inherit'} !important`,
          },
          '& .MuiSvgIcon-root': {
            color: `${darkMode ? 'white' : 'inherit'} !important`,
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: `${darkMode ? '#6b7280' : '#d1d5db'} !important`,
          },
        },
      },
      muiColumnActionsButtonProps: {
        sx: {
          color: 'white !important',
        },
      },
    }),
    [darkMode],
  );

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
          color: white !important;
          opacity: 1 !important;
        }
        .mrt-dark .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline {
          border-color: white !important;
        }
        .mrt-dark .MuiInputBase-root:hover .MuiOutlinedInput-notchedOutline {
          border-color: #d1d5db !important;
        }
      `}</style>

      <div className="mt-6">
        <h2 className={`mb-5 text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Facilitator {facilitatorName} Group Student Count
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className={`animate-pulse rounded-xl p-6 h-32 ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-300'
                  }`}
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

        <h2 className={`mt-5 mb-5 text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Facilitator {facilitatorName} Student Report
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
              darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
            }`}
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
            className={`w-44 rounded border p-2 text-sm ${
              darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
            }`}
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
            className={`w-44 rounded border p-2 text-sm ${
              darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
            }`}
          >
            {Array.from({ length: 5 }, (_, i) => `${new Date().getFullYear() - i}`).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </form>

        <div className={`mx-auto max-w-7xl rounded-md p-6 shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
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
}
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { getUsersByBatchId } from 'services/apiCollection';
import { FiEdit } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa6';
import { FaPhoneAlt } from 'react-icons/fa';

type Student = {
  user_id: string;
  name: string;
  mobile_number: string;
  group_name: string;
  profession: string;
};

const BatchDetails = () => {
  const router = useRouter();
  const params = useParams();
  const BatchId = params.BatchId;

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(document.body.classList.contains('dark'));

  // Sync darkMode state with document.body.classList
  useEffect(() => {
    const updateDarkMode = () => {
      const isDark = document.body.classList.contains('dark');
      setDarkMode(isDark);

      const elements = document.querySelectorAll(
        '.mrt-table-container, .mrt-table-paper, .mrt-toolbar, .mrt-pagination',
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
    const fetchStudents = async () => {
      try {
        const users = await getUsersByBatchId(BatchId);
        setStudents(users);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [BatchId]);

  const columns = useMemo<MRT_ColumnDef<Student>[]>(() => [
    {
      accessorKey: 'name',
      header: 'Name',
      size: 150,
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
    {
      accessorKey: 'profession',
      header: 'Profession',
      Cell: ({ cell }) => {
        const value = cell.getValue<string>();
        // Replace underscores with space and capitalize each word
        const formatted = value
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        return (
          <span
            className="data-cell"
            style={{ color: darkMode ? 'white' : 'inherit' }}
          >
            {formatted}
          </span>
        );
      },
      size: 150,
    },
    {
      accessorKey: 'action',
      header: 'Edit',
      Cell: ({ row }) => (
        <button
          className="flex items-center gap-2 rounded bg-blue-900 px-3 py-1 text-white hover:bg-blue-800"
          onClick={() =>
            router.push(
              `/admin/editstudent/${row.original.user_id}`
            )
          }
        >
          <FiEdit size={16} />
          Edit
        </button>
      ),
    },
  ], [darkMode, router]);

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
            color: '#ffffff !important', // Sort icons white
          },
          '& .MuiTableSortLabel-iconDirectionAsc': {
            color: '#ffffff !important',
          },
          '& .MuiTableSortLabel-iconDirectionDesc': {
            color: '#ffffff !important',
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
      muiPaginationProps: {
        className: 'mrt-pagination',
        sx: {
          backgroundColor: `${darkMode ? '#1e293b' : '#fff'} !important`,
          borderTop: `1px solid ${darkMode ? '#374151' : '#e5e7eb'} !important`,
          color: `${darkMode ? 'white' : 'inherit'} !important`,
          '& .MuiSvgIcon-root': {
            color: '#ffffff !important', // Pagination arrows white in both modes
          },
          '& .MuiIconButton-root': {
            color: '#ffffff !important', // Pagination button icons
          },
          '& .MuiSelect-icon': {
            color: '#ffffff !important', // Dropdown arrow for rows per page
          },
          '& .MuiSelect-select': {
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
          zIndex: 10 !important;
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
        .MuiTableHead-root .MuiTableSortLabel-icon {
          color: #ffffff !important; /* Sort icons */
        }
        .MuiTableHead-root .MuiTableSortLabel-iconDirectionAsc {
          color: #ffffff !important;
        }
        .MuiTableHead-root .MuiTableSortLabel-iconDirectionDesc {
          color: #ffffff !important;
        }
        .mrt-pagination {
          background-color: ${darkMode ? '#1e293b' : '#fff'} !important;
          color: ${darkMode ? 'white' : 'inherit'} !important;
        }
        .mrt-pagination .MuiSvgIcon-root {
          color: #ffffff !important; /* Pagination arrows white in both modes */
        }
        .mrt-pagination .MuiIconButton-root {
          color: #ffffff !important; /* Pagination button icons */
        }
        .mrt-pagination .MuiSelect-icon {
          color: #ffffff !important; /* Dropdown arrow for rows per page */
        }
        .mrt-pagination .MuiSelect-select {
          color: ${darkMode ? 'white' : 'inherit'} !important;
        }
      `}</style>

      <div className="p-2 mt-2">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Batch {BatchId} Students
        </h2>

        {/* Back Button */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => router.back()}
            className="rounded-md bg-red-800 px-4 py-2 text-white hover:bg-red-700"
          >
            ← Back
          </button>
        </div>

        {loading ? (
          <p className="text-gray-700 dark:text-gray-300">Loading...</p>
        ) : (
          <div className={`mt-7 p-5 mb-5 rounded-md shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <MaterialReactTable
              columns={columns}
              data={students}
              enableSorting
              enableGlobalFilter
              positionGlobalFilter="right"
              getRowId={(r) => r.user_id}
              muiTablePaperProps={tableStyles.muiTablePaperProps}
              muiTableProps={tableStyles.muiTableProps}
              muiTableContainerProps={tableStyles.muiTableContainerProps}
              muiTableBodyProps={tableStyles.muiTableBodyProps}
              muiTableHeadCellProps={tableStyles.muiTableHeadCellProps}
              muiTableBodyCellProps={tableStyles.muiTableBodyCellProps}
              muiPaginationProps={tableStyles.muiPaginationProps}
              muiTopToolbarProps={tableStyles.muiTopToolbarProps}
              muiColumnActionsButtonProps={tableStyles.muiColumnActionsButtonProps}
              state={{ isLoading: loading }}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default BatchDetails;
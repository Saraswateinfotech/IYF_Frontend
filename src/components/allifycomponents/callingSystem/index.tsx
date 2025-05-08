'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  fetchAllFacilitatorOrFrontliner,
  getdashboardReport,
} from 'services/apiCollection';
import Reports from '../Reports';
import { FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';

type Frontliner = {
  user_id: number;
  name: string;
  phone_number: string;
  role: string;
};

const CallingSystem = () => {
  const [frontliners, setFrontliners] = useState<Frontliner[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [darkMode, setDarkMode] = useState(document.body.classList.contains('dark'));

  const router = useRouter();

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
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [frontlinerRes, dashboardReport] = await Promise.all([
          fetchAllFacilitatorOrFrontliner(),
          getdashboardReport(),
        ]);

        const filteredFrontliners = frontlinerRes.filter(
          (item: Frontliner) => item.role === 'frontliner'
        );
        setFrontliners(filteredFrontliners);

        setReport(dashboardReport[0]);
      } catch (err) {
        console.error('Error fetching data:', err);
        toast.error('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const frontlinerColumns = useMemo<MRT_ColumnDef<Frontliner>[]>(() => [
    {
      accessorKey: 'name',
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
      accessorKey: 'phone_number',
      header: 'Phone Number',
      Cell: ({ row }) => (
        <div className="flex space-x-4">
          <a
            href={`https://wa.me/${row.original.phone_number}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-500 transition duration-300 ease-in-out transform hover:scale-105"
          >
            <FaWhatsapp className="text-lg" />
          </a>
          <a
            href={`tel:${row.original.phone_number}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-indigo-900 text-white hover:bg-indigo-800 transition duration-300 ease-in-out transform hover:scale-105"
          >
            <FaPhoneAlt className="text-lg" />
            <span className="text-sm md:text-base">{row.original.phone_number}</span>
          </a>
        </div>
      ),
    },
  ], [darkMode]);

  const handleFrontlinerClick = (frontliner: Frontliner) => {
    router.push(`/admin/dashboard/facilitator-frontliner/${frontliner.user_id}?frontlinerName=${frontliner.name}`);
  };

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

  if (isLoading) {
    return (
      <div className={`mt-6 px-6 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        Loading...
      </div>
    );
  }

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
        .Toastify__toast {
          color: ${darkMode ? '#ffffff' : '#000000'} !important;
          background-color: ${darkMode ? '#2d396b' : '#ffffff'} !important;
          border: 1px solid ${darkMode ? '#374151' : '#e5e7eb'} !important;
        }
        .Toastify__toast--success {
          background-color: ${darkMode ? '#1a4a3b' : '#e6fffa'} !important;
          color: ${darkMode ? '#34d399' : '#38a169'} !important;
        }
        .Toastify__toast--error {
          background-color: ${darkMode ? '#4a1a1a' : '#fff1f0'} !important;
          color: ${darkMode ? '#f87171' : '#e53e3e'} !important;
        }
        .Toastify__progress-bar {
          background-color: ${darkMode ? '#4b5563' : '#cbd5e0'} !important;
        }
      `}</style>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? 'dark' : 'light'}
      />
      <div className="mt-8 px-6">
        <h2 className={`mb-5 text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Dashboard Report
        </h2>

        <Reports report={report} />
        <h2 className={`mb-5 text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Frontliners
        </h2>
        <div className={`mb-5 mt-0 rounded-md p-5 shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <MaterialReactTable
            columns={frontlinerColumns}
            data={frontliners}
            enableSorting
            muiTablePaperProps={tableStyles.muiTablePaperProps}
            muiTableProps={tableStyles.muiTableProps}
            muiTableContainerProps={tableStyles.muiTableContainerProps}
            muiTableBodyProps={tableStyles.muiTableBodyProps}
            muiTableHeadCellProps={tableStyles.muiTableHeadCellProps}
            muiTableBodyCellProps={tableStyles.muiTableBodyCellProps}
            muiPaginationProps={tableStyles.muiPaginationProps}
            muiTopToolbarProps={tableStyles.muiTopToolbarProps}
            muiColumnActionsButtonProps={tableStyles.muiColumnActionsButtonProps}
            muiTableBodyRowProps={({ row }) => ({
              onClick: () => handleFrontlinerClick(row.original),
              style: { cursor: 'pointer' },
            })}
            state={{ isLoading }}
          />
        </div>
      </div>
    </>
  );
};

export default CallingSystem;
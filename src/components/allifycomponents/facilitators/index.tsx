'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { toast, ToastContainer } from 'react-toastify';
import {
  fetchAllFacilitatorOrFrontliner,
  getdashboardReport,
} from 'services/apiCollection';
import { FaPhoneAlt } from 'react-icons/fa';
import { FaWhatsapp } from 'react-icons/fa6';

type Frontliner = {
  user_id: number;
  name: string;
  phone_number: string;
  role: string;
};

const Facilitators = () => {
  const [frontliners, setFrontliners] = useState<Frontliner[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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

        // Filter to only include items where role is 'facilitator'
        const filteredFrontliners = frontlinerRes.filter(
          (item: Frontliner) => item.role === 'facilitator'
        );
        setFrontliners(filteredFrontliners);

      } catch (err) {
        console.error('Error fetching data:', err);
        toast.error('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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
          borderRadius: '2px',
          '& .MuiTableSortLabel-root': {
            color: 'white !important',
          },
          '& .MuiTableSortLabel-icon': {
            color: '#ffffff !important',
          },
          '& .MuiTableSortLabel-iconDirectionAsc': {
            color: '#ffffff !important',
          },
          '& .MuiTableSortLabel-iconDirectionDesc': {
            color: '#ffffff !important',
          },
        },
      },
      muiTableBodyCellProps: {
        sx: {
          backgroundColor: 'inherit !important',
          color: `${darkMode ? 'white' : 'inherit'} !important`,
          borderColor: `${darkMode ? '#374151' : '#e5e7eb'} !important`,
        },
      },
      muiPaginationProps: {
        className: 'mrt-pagination',
        sx: {
          backgroundColor: `${darkMode ? '#1e293b' : '#fff'} !important`,
          borderTop: `1px solid ${darkMode ? '#374151' : '#e5e7eb'} !important`,
          color: `${darkMode ? 'white' : 'inherit'} !important`,
          '& .MuiSvgIcon-root': {
            color: '#ffffff !important',
          },
          '& .MuiIconButton-root': {
            color: '#ffffff !important',
          },
          '& .MuiSelect-icon': {
            color: '#ffffff !important',
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
            className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition duration-300 ease-in-out transform hover:scale-105 ${
              darkMode
                ? 'bg-green-700 hover:bg-green-600'
                : 'bg-green-600 hover:bg-green-500'
            }`}
          >
            <FaWhatsapp className="text-lg" />
          </a>
          <a
            href={`tel:${row.original.phone_number}`}
            onClick={(e) => e.stopPropagation()}
            className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition duration-300 ease-in-out transform hover:scale-105 ${
              darkMode
                ? 'bg-indigo-800 hover:bg-indigo-700'
                : 'bg-indigo-900 hover:bg-indigo-800'
            }`}
          >
            <FaPhoneAlt className="text-lg" />
            <span className="text-sm md:text-base">{row.original.phone_number}</span>
          </a>
        </div>
      ),
    },
  ], [darkMode]);

  const handleFrontlinerClick = (frontliner: Frontliner) => {
    router.push(`/admin/facilitators/${frontliner.user_id}?facilitatorName=${frontliner.name}`);
  };

  if (isLoading) {
    return <div className={`mt-6 px-6 text-lg ${darkMode ? 'text-white' : 'text-gray-900'} ${darkMode ? 'dark:bg-gray-800' : 'dark:bg-white'}`}>Loading...</div>;
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
          color: #ffffff !important;
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
          color: #ffffff !important;
        }
        .mrt-pagination .MuiIconButton-root {
          color: #ffffff !important;
        }
        .mrt-pagination .MuiSelect-icon {
          color: #ffffff !important;
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
        .Toastify__toast--info {
          background-color: ${darkMode ? '#1a3a4a' : '#e6f0fa'} !important;
          color: ${darkMode ? '#60a5fa' : '#3182ce'} !important;
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
      <div className="mt-8">
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
          />
        </div>
      </div>
    </>
  );
};

export default Facilitators;
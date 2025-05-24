'use client';

import { useEffect, useMemo, useState } from 'react';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { toast } from 'react-toastify';
import {
  frontlinerStudentById,
  getFrontlinerReport,
} from 'services/apiCollection';
import { FaCheckCircle, FaPhoneAlt, FaTimesCircle } from 'react-icons/fa';
import { useDashboardContext } from 'contexts/DashboardContext';
import Reports from '../Reports';
import { FaWhatsapp } from 'react-icons/fa6';

type Student = {
  user_id: number;
  name: string;
  mobile_number: string;
  payment_mode: string;
  registration_date: string;
  payment_status: string;
};

const FrontlinerCallingSystem = () => {
  const { updateFlag } = useDashboardContext();
  const [data, setData] = useState<Student[]>([]);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

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

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const frontlinerId = localStorage.getItem('frontlinerId');

      const [studentsRes, reportRes] = await Promise.all([
        frontlinerStudentById(frontlinerId),
        getFrontlinerReport(frontlinerId),
      ]);

      setData(studentsRes.users);
      setReport(reportRes[0]);
    } catch (err) {
      console.error('Error fetching data:', err);
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [updateFlag]);

  const columns = useMemo<MRT_ColumnDef<Student>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        size: 200,
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
        accessorKey: 'payment_mode',
        header: 'Payment Mode',
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
        accessorKey: 'registration_date',
        header: 'Registration Date',
        size: 180,
        Cell: ({ cell }) => {
          const raw = cell.getValue<string>();
          const date = new Date(raw);
          const formatted = date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          });
          return (
            <span
              className="data-cell"
              style={{ color: darkMode ? 'white' : 'inherit' }}
            >
              {formatted}
            </span>
          );
        },
      },
      {
        accessorKey: 'payment_status',
        header: 'Payment Status',
        size: 150,
        Cell: ({ cell }) => {
          const value = cell.getValue<string>();
          const displayValue =
            value === 'received'
              ? 'Received'
              : value === 'not_received'
              ? 'Not Received'
              : value;
          return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {value === 'received' ? (
                <FaCheckCircle style={{ color: 'green', marginRight: 8 }} />
              ) : (
                <FaTimesCircle style={{ color: 'red', marginRight: 8 }} />
              )}
              <span
                className="data-cell"
                style={{
                  color: darkMode ? 'white' : 'inherit',
                  fontWeight: 'bold',
                }}
              >
                {displayValue}
              </span>
            </div>
          );
        },
      },
    ],
    [darkMode],
  );

  const tableStyles = useMemo(
    () => ({
      muiTablePaperProps: {
        className: 'mrt-table-paper',
        sx: {
          backgroundColor: darkMode ? '#1E293B' : '#fff',
          backgroundImage: 'none',
          boxShadow: 'none',
          borderRadius: '0.5rem',
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
            backgroundColor: `${darkMode ? '#2d396b' : '#fff'} !important`,
            '&:hover': {
              backgroundColor: `${darkMode ? '#3a4a8a' : '#f3f4f6'} !important`,
            },
            '&[data-selected="true"]': {
              backgroundColor: `${darkMode ? '#3a4a8a' : '#e5e7eb'} !important`,
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
          '& .MuiTableSortLabel-icon': {
            color: 'white !important',
          },

          '& .MuiCheckbox-root': {
            color: 'white !important', // Unchecked state - white border
            '&.Mui-checked': {
              color: 'white !important', // Checked state - white checkmark
            },

            '&.MuiCheckbox-indeterminate': {
              color: 'white !important', // Indeterminate state
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
          borderTop: `1px solid ${darkMode ? '#374151' : '#e5e7eb'} !important`,
        },
      },
      muiToolbarProps: {
        className: 'mrt-toolbar',
        sx: {
          backgroundColor: `${darkMode ? '#1E293B' : '#fff'} !important`,
          color: `${darkMode ? 'white' : 'inherit'} !important`,
        },
      },
      muiColumnActionsButtonProps: {
        sx: {
          color: `${darkMode ? 'white' : 'inherit'} !important`,
        },
      },
    }),
    [darkMode],
  );

  if (isLoading) {
    return <div className="mt-6 px-6 text-lg dark:text-white">Loading...</div>;
  }

  return (
    <>
      <style jsx global>{`
        // .MuiCheckbox-root {
        //   color: white !important;
        // }
        // .MuiCheckbox-root.Mui-checked {
        //   color: white !important;
        // }
        .mrt-dark .MuiTableRow-root {
          background-color: #2d396b !important;
        }
        .mrt-dark .MuiTableCell-root {
          background-color: inherit !important;
          color: white !important;
        }
        .mrt-dark .data-cell {
          color: white !important;
        }
        .mrt-dark .MuiToolbar-root {
          background-color: #1e293b !important;
          color: white !important;
        }
        .mrt-table-container {
          overflow: auto !important;
        }
        .MuiTableHead-root {
          position: sticky !important;
          top: 0 !important;
          z-index: 10 !important;
        }
        .mrt-dark .MuiSvgIcon-root {
          color: white !important;
        }
      `}</style>

      <div className="mt-8">
        <h2 className="mb-3 text-lg font-bold dark:text-white">
          Frontliner Report
        </h2>
        {report && <Reports report={report} />}
        <div className="mt-12">
          <h2 className="mb-3 text-lg font-bold dark:text-white">
            Registration
          </h2>
          <div
            className={`mb-5 mt-0 rounded-md p-5 shadow-2xl ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <MaterialReactTable
              columns={columns}
              data={data}
              enableSorting
              onRowSelectionChange={setRowSelection}
              state={{ rowSelection }}
              getRowId={(row) => row.user_id.toString()}
              muiTablePaperProps={tableStyles.muiTablePaperProps}
              muiTableProps={tableStyles.muiTableProps}
              muiTableContainerProps={tableStyles.muiTableContainerProps}
              muiTableBodyProps={tableStyles.muiTableBodyProps}
              muiTableHeadCellProps={tableStyles.muiTableHeadCellProps}
              muiTableBodyCellProps={tableStyles.muiTableBodyCellProps}
              muiPaginationProps={tableStyles.muiPaginationProps}
              muiTopToolbarProps={tableStyles.muiToolbarProps}
              muiColumnActionsButtonProps={
                tableStyles.muiColumnActionsButtonProps
              }
              enableRowSelection
              enableColumnActions={true}
              enableColumnFilters={true}
              enablePagination={true}
              enableBottomToolbar={true}
              enableTopToolbar={false}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default FrontlinerCallingSystem;

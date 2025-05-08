'use client';

import { useEffect, useMemo, useState } from 'react';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { getUserByCallingId } from 'services/apiCollection';
import ResponseModal from '../callingSystem/ResponseModal';
import { FaPhoneAlt } from 'react-icons/fa';
import { FaWhatsapp } from 'react-icons/fa6';
import { ToastContainer } from 'react-toastify';

type Student = {
  user_id: number;
  name: string;
  mobile_number: string;
  profession: string;
  student_status: string;
  payment_status: string;
  response?: string;
};

const AssignedCalling = () => {
  const [data, setData] = useState<Student[]>([]);
  const [selectedRow, setSelectedRow] = useState<Student | null>(null);
  const [open, setOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const updateDarkMode = () => {
      const isDark = document.body.classList.contains('dark');
      setDarkMode(isDark);

      const elements = document.querySelectorAll(
        '.mrt-table-container, .mrt-table-paper, .mrt-pagination, .mrt-toolbar',
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

  const fetchStudentsByCallingId = async () => {
    try {
      setIsLoading(true);
      const users = await getUserByCallingId();
      setData(users.data);
    } catch (err) {
      console.log('Failed to fetch students by calling ID');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentsByCallingId();
  }, []);

  const formatProfession = (profession: string) => {
    switch (profession) {
      case 'job_candidate':
        return 'Job Candidate';
      default:
        return profession;
    }
  };

  const formatStudentStatus = (status: string) => {
    switch (status) {
      case 'will_come':
        return 'Will Come';
      case 'not_interested':
        return 'Not Interested';
      case 'might_come':
        return 'Might Come';
      default:
        return status;
    }
  };

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
        accessorKey: 'profession',
        header: 'Profession',
        size: 150,
        Cell: ({ cell }) => (
          <span
            className="data-cell"
            style={{ color: darkMode ? 'white' : 'inherit' }}
          >
            {formatProfession(cell.getValue() as string)}
          </span>
        ),
      },
      {
        accessorKey: 'student_status',
        header: 'Student Status',
        size: 150,
        Cell: ({ cell }) => (
          <span
            className="data-cell"
            style={{ color: darkMode ? 'white' : 'inherit' }}
          >
            {formatStudentStatus(cell.getValue() as string)}
          </span>
        ),
      },
      {
        accessorKey: 'response',
        header: 'Calling Response',
        size: 150,
        Cell: ({ row }) => (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedRow(row.original);
              setOpen(true);
            }}
            className="rounded bg-indigo-900 px-3 py-1 text-white hover:bg-indigo-800"
          >
            Response
          </button>
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
    ],
    [darkMode],
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
          // Add these for sorting arrows:
          '& .MuiTableSortLabel-icon': {
            color: 'white !important', // Force white arrows
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
          '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows':
            {
              color: `${darkMode ? 'white' : 'inherit'} !important`,
            },
        },
      },
      muiToolbarProps: {
        className: 'mrt-toolbar',
        sx: {
          backgroundColor: `${darkMode ? '#1E293B' : '#fff'} !important`,
          color: `${darkMode ? 'white' : 'inherit'} !important`,
        },
      },
      muiFilterTextFieldProps: {
        // Updated prop name
        sx: {
          color: `${darkMode ? 'white' : 'inherit'} !important`,
          '& .MuiInputBase-input': {
            color: `${darkMode ? 'white' : 'inherit'} !important`,
          },
          '& .MuiInputLabel-root': {
            color: `${darkMode ? 'white' : 'inherit'} !important`,
          },
        },
      },
      muiColumnActionButtonProps: {
        // Updated prop name
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
        .MuiCheckbox-root {
          color: white !important;
        }
        .MuiCheckbox-root.Mui-checked {
          color: white !important;
        }
        MuiTableSortLabel-icon': {
          color: 'white !important',
        }
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
          background-color: #1E293B !important;
          color: white !important;
        }
        .mrt-dark .MuiTablePagination-root {
          background-color: #1E293B !important;
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
        .mrt-dark .MuiInputBase-root {
          color: white !important;
        }
      `}</style>

      <ToastContainer />
      <div className="mt-10">
        <h2 className="mb-3 text-lg font-bold dark:text-white">
          Assigned Calling
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
            muiFilterTextFieldProps={tableStyles.muiFilterTextFieldProps}
            muiColumnActionsButtonProps={tableStyles.muiColumnActionButtonProps}
            enableRowSelection
            enableColumnActions={true}
            enableColumnFilters={true}
            enablePagination={true}
            enableBottomToolbar={true}
            enableTopToolbar={false}
          />
        </div>
      </div>

      <ResponseModal
        isOpen={open}
        closeModal={() => setOpen(false)}
        selectedRow={selectedRow}
        onSuccess={fetchStudentsByCallingId}
      />
    </>
  );
};

export default AssignedCalling;

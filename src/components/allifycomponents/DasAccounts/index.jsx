'use client';

import { useState, useEffect, useMemo } from 'react';
import { IoPersonAddSharp } from 'react-icons/io5';
import { FaCopy, FaPhoneAlt, FaTrash } from 'react-icons/fa';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { FaWhatsapp } from 'react-icons/fa6';
import { MaterialReactTable } from 'material-react-table';
import AccountModal from './AccountModal';
import { deleteDashboardAccount, fetchDashboardAccounts } from 'services/apiCollection';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DasAccounts = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState({});
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(document.body.classList.contains('dark'));

  const rawRole = typeof window !== 'undefined' ? localStorage.getItem('role') : '';
  const role = rawRole?.toLowerCase().trim();
  const isAllowed = role === 'admin' || role === 'coordinator';

  // Sync darkMode state with document.body.classList
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

  const fetchAccounts = async () => {
    if (!isAllowed) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchDashboardAccounts();

      // Apply filtering based on role
      let filtered = data;
      if (role === 'admin') {
        filtered = data.filter((acc) => acc.role === 'facilitator');
      } else if (role === 'coordinator') {
        filtered = data.filter((acc) => acc.role === 'frontliner');
      }

      setAccounts(filtered);
    } catch (err) {
      console.error('Error fetching accounts:', err);
      setError('Failed to load accounts. Please try again.');
      toast.error('Failed to load accounts.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [isAllowed, role]);

  const togglePasswordVisibility = (index) => {
    setShowPassword((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const handleDelete = async (user_id) => {
    if (!confirm('Are you sure you want to delete this account?')) return;

    try {
      await deleteDashboardAccount(user_id);
      setAccounts((prev) => prev.filter((account) => account.user_id !== user_id));
      toast.success('Account deleted successfully!');
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account. Please try again.');
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
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
        accessorKey: 'mobile_number',
        header: 'Number',
        size: 250,
        enableSorting: true,
        Cell: ({ row }) => (
          <div className="flex space-x-4">
            <a
              href={`https://wa.me/${row.original.mobile_number}`}
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
              href={`tel:${row.original.mobile_number}`}
              onClick={(e) => e.stopPropagation()}
              className={`inline-flex transform items-center space-x-2 rounded-lg px-4 py-2 text-white transition duration-300 ease-in-out hover:scale-105 ${
                darkMode ? 'bg-indigo-800 hover:bg-indigo-700' : 'bg-indigo-900 hover:bg-indigo-800'
              }`}
            >
              <FaPhoneAlt className="text-lg" />
              <span className="text-sm md:text-base">{row.original.mobile_number}</span>
            </a>
          </div>
        ),
      },
      {
        accessorKey: 'role',
        header: 'Role',
        size: 150,
        enableSorting: true,
        Cell: ({ cell }) => (
          <span className="data-cell" style={{ color: darkMode ? 'white' : 'inherit' }}>
            {cell.getValue()}
          </span>
        ),
      },
      {
        accessorKey: 'user_id',
        header: 'Dashboard ID',
        size: 200,
        enableSorting: true,
        Cell: ({ row, cell }) => {
          const index = row.index;
          return (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5">
                <span className="data-cell" style={{ color: darkMode ? 'white' : 'inherit' }}>
                  {cell.getValue()}
                </span>
                <button
                  onClick={() => copyToClipboard(cell.getValue().toString())}
                  className={`transition ${
                    darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-700'
                  }`}
                >
                  <FaCopy size={12} />
                </button>
              </div>
              <div className="flex items-center gap-1.5">
                {showPassword[index] ? (
                  <span
                    className={`rounded px-1.5 py-0.5 font-mono text-sm ${
                      darkMode ? 'bg-gray-600 text-white' : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {row.original.textpassword}
                  </span>
                ) : (
                  <span
                    className={`font-mono text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                  >
                    ••••••••
                  </span>
                )}
                <button
                  onClick={() => togglePasswordVisibility(index)}
                  className={`transition ${
                    darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {showPassword[index] ? (
                    <AiFillEyeInvisible size={16} />
                  ) : (
                    <AiFillEye size={16} />
                  )}
                </button>
                <button
                  onClick={() => copyToClipboard(row.original.textpassword)}
                  className={`transition ${
                    darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-700'
                  }`}
                >
                  <FaCopy size={12} />
                </button>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'actions',
        header: 'Actions',
        size: 100,
        enableSorting: false,
        Cell: ({ row }) => (
          <button
            onClick={() => handleDelete(row.original.user_id)}
            className={`transition ${
              darkMode ? 'text-red-500 hover:text-red-400' : 'text-red-700 hover:text-red-900'
            }`}
          >
            <FaTrash size={14} />
          </button>
        ),
      },
    ],
    [darkMode, showPassword],
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
          border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
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
      muiToolbarProps: {
        className: 'mrt-toolbar',
        sx: {
          backgroundColor: `${darkMode ? '#1E293B' : '#fff'} !important`,
          color: `${darkMode ? 'white' : 'inherit'} !important`,
        },
      },
      muiFilterTextFieldProps: {
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
      muiColumnActionsButtonProps: {
        sx: {
          color: `${darkMode ? 'white' : 'inherit'} !important`,
        },
      },
    }),
    [darkMode],
  );

  if (isLoading) {
    return (
      <div className={`mt-6 px-6 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className={`mt-6 px-6 text-lg ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
        {error}
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
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
        .Toastify__toast--warning {
          background-color: ${darkMode ? '#4a3a1a' : '#fffbeb'} !important;
          color: ${darkMode ? '#fbbf24' : '#d97706'} !important;
        }
        .Toastify__progress-bar {
          background-color: ${darkMode ? '#4b5563' : '#cbd5e0'} !important;
        }
        .mrt-dark .MuiSvgIcon-root {
          color: white !important;
        }
        .mrt-dark .MuiInputBase-root {
          color: white !important;
        }
      `}</style>

      <ToastContainer
        position="top-right"
        reverseOrder={false}
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
      {!isAllowed ? (
        <div className={`mt-10 text-center text-lg ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
          You are not allowed to access this page.
        </div>
      ) : (
        <div className="mt-8">
          <h2 className={`mt-5 mb-5 text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Accounts Overview
          </h2>

          <div className="mb-4 flex items-center justify-end">
            <button
              onClick={() => setIsModalOpen(true)}
              className={`flex transform items-center rounded-lg px-5 py-2 text-white shadow-lg transition-transform hover:scale-105 ${
                darkMode ? 'bg-blue-800 hover:bg-blue-700' : 'bg-blue-900 hover:bg-blue-800'
              }`}
            >
              <IoPersonAddSharp size={20} />
              <span className="ml-2 text-lg">Create Account</span>
            </button>
          </div>

          <div className={`mb-5 mt-0 rounded-md p-5 shadow-2xl ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <MaterialReactTable
              columns={columns}
              data={accounts}
              enableSorting
              enableColumnActions
              enableColumnFilters
              enablePagination
              enableBottomToolbar
              enableTopToolbar={false}
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
              muiColumnActionsButtonProps={tableStyles.muiColumnActionsButtonProps}
            />
          </div>

          <AccountModal
            isOpen={isModalOpen}
            closeModal={() => setIsModalOpen(false)}
            fetchAccounts={fetchAccounts}
          />
        </div>
      )}
    </>
  );
};

export default DasAccounts;
'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  fetchAllFacilitatorOrFrontliner,
  updateCallingId,
  getFrontlinerReport,
  frontlinerStudentByIdOfcallingId,
  frontlinerStudentById,
} from 'services/apiCollection';
import { FaCheckCircle, FaPhoneAlt, FaTimesCircle } from 'react-icons/fa';
import { Autocomplete, TextField } from '@mui/material';
import ResponseModal from 'components/allifycomponents/callingSystem/ResponseModal';
import PaymentStatus from 'components/allifycomponents/callingSystem/PaymentStatus';
import Reports from 'components/allifycomponents/Reports';
import { FaWhatsapp } from 'react-icons/fa6';

interface Student {
  user_id: number;
  name: string;
  mobile_number: string;
  payment_mode: string;
  registration_date: string;
  student_status: string;
  student_status_date: string;
  profession: string;
  payment_status: string;
}

interface Frontliner {
  user_id: number;
  name: string;
  phone_number: string;
  role: string;
}

const FrontlinerCallingPage = () => {
  const [frontliners, setFrontliners] = useState<Frontliner[]>([]);
  const [allfrontlinerStudents, setAllFrontlinerStudents] = useState<Student[]>([]);
  const [callingStudents, setCallingStudents] = useState<Student[]>([]);
  const [frontlinerReport, setFrontlinerReport] = useState<any>(null);
  const [selectedRow, setSelectedRow] = useState<Student | null>(null);
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [selectedFrontliner, setSelectedFrontliner] = useState<Frontliner | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCallingTable, setShowCallingTable] = useState(false);
  const [darkMode, setDarkMode] = useState(document.body.classList.contains('dark'));

  const { id: frontlinerId } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const frontlinerName = searchParams.get('frontlinerName');

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

  const fetchData = useCallback(async () => {
    if (!frontlinerId) return;
    setIsLoading(true);
    try {
      const [frontlinerRes, reportRes, allstudentRes] = await Promise.all([
        fetchAllFacilitatorOrFrontliner(),
        getFrontlinerReport(frontlinerId),
        frontlinerStudentById(frontlinerId),
      ]);
      setFrontliners(frontlinerRes);
      setFrontlinerReport(reportRes[0]);
      // Filter out students with invalid user_id
      const validStudents = allstudentRes.users.filter(
        (student: Student) => student.user_id != null && student.user_id !== undefined
      );
      setAllFrontlinerStudents(validStudents);
      // Log invalid entries for debugging
      const invalidStudents = allstudentRes.users.filter(
        (student: Student) => student.user_id == null || student.user_id === undefined
      );
      if (invalidStudents.length > 0) {
        console.warn('Invalid students found (missing user_id):', invalidStudents);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  }, [frontlinerId]);

  useEffect(() => {
    if (frontlinerId) fetchData();
  }, [frontlinerId, fetchData]);

  const refreshStudentAndReport = useCallback(async () => {
    if (!frontlinerId) return;
    try {
      const [allstudentRes, reportRes] = await Promise.all([
        frontlinerStudentById(frontlinerId),
        getFrontlinerReport(frontlinerId),
      ]);
      const validStudents = allstudentRes.users.filter(
        (student: Student) => student.user_id != null && student.user_id !== undefined
      );
      setAllFrontlinerStudents(validStudents);
      setFrontlinerReport(reportRes[0]);
    } catch (err) {
      console.error(err);
      toast.error('Failed to refresh data');
    }
  }, [frontlinerId]);

  const refreshStudentAndReports = useCallback(async () => {
    if (!frontlinerId) return;
    try {
      const [allstudentResss, reportRes] = await Promise.all([
        frontlinerStudentByIdOfcallingId(frontlinerId),
        getFrontlinerReport(frontlinerId),
      ]);
      const validStudents = allstudentResss.data.filter(
        (student: Student) => student.user_id != null && student.user_id !== undefined
      );
      setCallingStudents(validStudents);
      setFrontlinerReport(reportRes[0]);
    } catch (err) {
      console.error(err);
      toast.error('Failed to refresh data');
    }
  }, [frontlinerId]);

  const handleToggle = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = e.target.checked;
      setShowCallingTable(isChecked);

      if (isChecked && frontlinerId) {
        setIsLoading(true);
        try {
          const res = await frontlinerStudentByIdOfcallingId(frontlinerId);
          const validStudents = res.data.filter(
            (student: Student) => student.user_id != null && student.user_id !== undefined
          );
          setCallingStudents(validStudents);
          // Log invalid entries for debugging
          const invalidStudents = res.data.filter(
            (student: Student) => student.user_id == null || student.user_id === undefined
          );
          if (invalidStudents.length > 0) {
            console.warn('Invalid calling students found (missing user_id):', invalidStudents);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      }
    },
    [frontlinerId],
  );

  const handleAssign = useCallback(async () => {
    if (!selectedFrontliner) {
      toast.error('Please select a frontliner');
      return;
    }
    const selectedUserIds = callingStudents
      .filter((row) => rowSelection[row.user_id.toString()])
      .map((row) => row.user_id);

    if (!selectedUserIds.length) {
      toast.error('Please select at least one student');
      return;
    }

    setIsLoading(true);
    try {
      await updateCallingId(selectedUserIds, String(selectedFrontliner.user_id));
      toast.success('Calling ID assigned successfully!');
      await refreshStudentAndReport();
      if (frontlinerId) {
        const res = await frontlinerStudentByIdOfcallingId(frontlinerId);
        const validStudents = res.data.filter(
          (student: Student) => student.user_id != null && student.user_id !== undefined
        );
        setCallingStudents(validStudents);
      }
      setRowSelection({});
    } catch (err) {
      console.error(err);
      window.location.reload();
    } finally {
      setIsLoading(false);
    }
  }, [callingStudents, rowSelection, selectedFrontliner, refreshStudentAndReport, frontlinerId]);

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
              backgroundColor: `${darkMode ? '#3a4a8a' : '#a3abc8'} !important`,
              color: 'white !important',
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

  const allstudentColumns = useMemo<MRT_ColumnDef<Student>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        size: 180,
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
        accessorKey: 'payment_mode',
        header: 'Payment Mode',
        size: 80,
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
        Cell: ({ row, cell }) => {
          const value = cell.getValue<string>();
          const user = row.original;
          const paymentStatusMap: Record<string, string> = {
            received: 'Received',
            not_received: 'Not Received',
          };

          const handleClick = () => {
            if (value === 'not_received') {
              setSelectedRow(user);
              setPaymentModalOpen(true);
            }
          };

          return (
            <span
              onClick={handleClick}
              style={{
                color: value === 'received' ? 'green' : 'red',
                fontWeight: 'bold',
                cursor: value === 'not_received' ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {value === 'received' ? (
                <FaCheckCircle style={{ marginRight: '8px' }} />
              ) : (
                <FaTimesCircle style={{ marginRight: '8px' }} />
              )}
              {paymentStatusMap[value] || value}
            </span>
          );
        },
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
    ],
    [darkMode],
  );

  const callingStudentColumns = useMemo<MRT_ColumnDef<Student>[]>(
    () => [
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
        accessorKey: 'profession',
        header: 'Profession',
        Cell: ({ cell }) => {
          const value = cell.getValue<string>();
          const formatted = value
            ? value
                .split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
            : '';
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
        accessorKey: 'student_status',
        header: 'Student Status',
        Cell: ({ cell }) => {
          const value = cell.getValue<string>();
          const statusMap: Record<string, string> = {
            will_come: 'Will Come',
            not_interested: 'Not Interested',
            busy: 'Busy',
            might_come: 'Might Come',
          };
          return (
            <span
              className="data-cell"
              style={{ color: darkMode ? 'white' : 'inherit' }}
            >
              {statusMap[value] || value}
            </span>
          );
        },
      },
      {
        accessorKey: 'student_status_date',
        header: 'Last Calling Date',
        Cell: ({ cell }) => {
          const raw = cell.getValue<string>();
          const date = new Date(raw);
          const formatted = raw
            ? date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })
            : '';
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
        accessorKey: 'response',
        header: 'Calling Response',
        Cell: ({ row }) => (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedRow(row.original);
              setResponseModalOpen(true);
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
    ],
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
          background-color: #1e293b !important;
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
        .MuiAutocomplete-root .MuiOutlinedInput-root {
          background-color: ${darkMode ? '#2d3748' : '#fff'} !important;
          color: ${darkMode ? 'white' : 'inherit'} !important;
          border-color: ${darkMode ? '#4b5563' : '#d1d5db'} !important;
        }
        .MuiAutocomplete-root .MuiInputLabel-root {
          color: ${darkMode ? '#a0aec0' : '#000'} !important;
        }
        .MuiAutocomplete-root .MuiOutlinedInput-root .MuiAutocomplete-input {
          color: ${darkMode ? 'white' : 'inherit'} !important;
        }
        .MuiAutocomplete-root .MuiOutlinedInput-notchedOutline {
          border-color: ${darkMode ? '#4b5563' : '#d1d5db'} !important;
        }
        .MuiAutocomplete-root .MuiSvgIcon-root {
          color: ${darkMode ? 'white' : 'inherit'} !important;
        }
        .MuiAutocomplete-popper {
          background-color: ${darkMode ? '#2d3748' : '#fff'} !important;
          color: ${darkMode ? 'white' : 'inherit'} !important;
        }
        .MuiAutocomplete-option {
          background-color: ${darkMode ? '#2d3748' : '#fff'} !important;
          color: ${darkMode ? 'white' : 'inherit'} !important;
        }
        .MuiAutocomplete-option:hover {
          background-color: ${darkMode ? '#3a4a8a' : '#f0f0f0'} !important;
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
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => router.back()}
            className={`rounded-md px-4 py-2 text-white ${darkMode ? 'bg-red-700 hover:bg-red-600' : 'bg-red-800 hover:bg-red-700'}`}
          >
            ← Back
          </button>
        </div>

        <h2 className={`mb-5 text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Frontliner {frontlinerName} Report
        </h2>
        <Reports report={frontlinerReport} />

        <div className={`mb-5 rounded-md p-5 shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="mb-4 mt-1 flex justify-end">
            <label className="inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                className="peer sr-only"
                onChange={handleToggle}
              />
              <div
                className={`peer relative h-7 w-14 rounded-full
                  ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}
                  after:absolute after:start-[4px] after:top-0.5 after:h-6
                  after:w-6 after:rounded-full after:border after:border-gray-300
                  after:bg-white after:transition-all after:content-['']
                  peer-checked:bg-blue-900 peer-checked:after:translate-x-full
                  peer-checked:after:border-white peer-focus:outline-none
                  peer-focus:ring-4 peer-focus:ring-blue-800
                  ${darkMode ? 'dark:border-gray-500 dark:bg-gray-600 dark:peer-checked:bg-blue-700 dark:peer-focus:ring-blue-600' : 'dark:border-gray-600 dark:bg-gray-700 dark:peer-checked:bg-blue-900 dark:peer-focus:ring-blue-800'}
                  rtl:peer-checked:after:-translate-x-full`}
              />
            </label>
          </div>

          {!showCallingTable ? (
            <>
              <h2 className={`mb-5 text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Frontliner {frontlinerName} Registration
              </h2>
              <MaterialReactTable
                columns={allstudentColumns}
                data={allfrontlinerStudents}
                enableSorting
                onRowSelectionChange={setRowSelection}
                state={{ rowSelection, isLoading }}
                getRowId={(row) => (row.user_id != null ? row.user_id.toString() : `invalid-${Math.random()}`)}
                muiTablePaperProps={tableStyles.muiTablePaperProps}
                muiTableProps={tableStyles.muiTableProps}
                muiTableContainerProps={tableStyles.muiTableContainerProps}
                muiTableBodyProps={tableStyles.muiTableBodyProps}
                muiTableHeadCellProps={tableStyles.muiTableHeadCellProps}
                muiTableBodyCellProps={tableStyles.muiTableBodyCellProps}
                muiPaginationProps={tableStyles.muiPaginationProps}
                muiTopToolbarProps={tableStyles.muiTopToolbarProps}
                muiColumnActionsButtonProps={tableStyles.muiColumnActionsButtonProps}
              />
            </>
          ) : (
            <>
              <h2 className={`mb-5 text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Frontliner {frontlinerName} Assigned Calling
              </h2>
              <div className={`mx-auto mb-5 flex w-full flex-col rounded-md p-5 shadow-2xl md:flex-row ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <Autocomplete
                  id="frontliner-select"
                  options={frontliners.filter(
                    (f) => String(f.user_id) !== String(frontlinerId),
                  )}
                  loading={isLoading}
                  getOptionLabel={(option) =>
                    `${option.user_id} - ${option.name} (${option.role})`
                  }
                  onChange={(_, newValue) => setSelectedFrontliner(newValue)}
                  className="w-full md:flex-grow"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Frontliner and Facilitator"
                      placeholder="Search..."
                      fullWidth
                    />
                  )}
                />
                <button
                  type="button"
                  onClick={handleAssign}
                  className={`mt-4 rounded-lg px-8 py-3.5 text-lg text-white md:ml-2 md:mt-0 ${darkMode ? 'bg-indigo-800 hover:bg-indigo-700' : 'bg-indigo-900 hover:bg-indigo-800'}`}
                >
                  {isLoading ? 'Assigning...' : 'Assign'}
                </button>
              </div>

              <MaterialReactTable
                columns={callingStudentColumns}
                data={callingStudents}
                enableSorting
                enableRowSelection
                onRowSelectionChange={setRowSelection}
                state={{ rowSelection, isLoading }}
                getRowId={(row) => (row.user_id != null ? row.user_id.toString() : `invalid-${Math.random()}`)}
                muiTablePaperProps={tableStyles.muiTablePaperProps}
                muiTableProps={tableStyles.muiTableProps}
                muiTableContainerProps={tableStyles.muiTableContainerProps}
                muiTableBodyProps={tableStyles.muiTableBodyProps}
                muiTableHeadCellProps={tableStyles.muiTableHeadCellProps}
                muiTableBodyCellProps={tableStyles.muiTableBodyCellProps}
                muiPaginationProps={tableStyles.muiPaginationProps}
                muiTopToolbarProps={tableStyles.muiTopToolbarProps}
                muiColumnActionsButtonProps={tableStyles.muiColumnActionsButtonProps}
              />
            </>
          )}
        </div>

        <PaymentStatus
          isOpens={paymentModalOpen}
          closeModal={() => setPaymentModalOpen(false)}
          selectedRow={selectedRow}
          onSuccess={refreshStudentAndReport}
        />

        <ResponseModal
          isOpen={responseModalOpen}
          closeModal={() => setResponseModalOpen(false)}
          selectedRow={selectedRow}
          onSuccess={refreshStudentAndReports}
        />
      </div>
    </>
  );
};

export default FrontlinerCallingPage;
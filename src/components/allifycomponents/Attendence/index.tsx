'use client';

import { useEffect, useMemo, useState } from 'react';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { ToastContainer, toast } from 'react-toastify';
import { MdAddTask } from 'react-icons/md';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import 'react-toastify/dist/ReactToastify.css';

import {
  fetchAllStudents,
  markAttendance,
} from 'services/apiCollection';

type Person = {
  id: number;
  name: string;
  mobile_number: string;
  address: string;
  user_id: string;
  group_name: string;
};

const Attendance = () => {
  const [data, setData] = useState<Person[]>([]);
  const [allStudents, setAllStudents] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const resp = await fetchAllStudents();
      setAllStudents(resp.students);
    } catch (error) {
      console.error('Failed to fetch all students:', error);
      toast.error('❌ Failed to fetch students');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (data.length === 0) {
      toast.info('⚠ Please select students before submitting attendance.');
      return;
    }

    setIsSubmitting(true);

    try {
      for (const student of data) {
        await markAttendance(student.group_name, student.user_id);
      }

      toast.success('✅ Attendance submitted successfully!');
      setData([]);
      setTimeout(() => {
        fetchData();
      }, 1000);
      
    } catch (error) {
      console.error('Attendance submission failed:', error);
      toast.error('❌ Failed to submit attendance.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAutocompleteChange = (event: any, newValue: Person[]) => {
    setData(newValue);
  };

  // Group shifting logic for display
  const shiftGroupName = (groupName: string) => {
    const groupShiftMap: Record<string, string> = {
      'new': 'new',
      'DYS-1': 'DYS-2',
      'DYS-2': 'DYS-3',
      'DYS-3': 'DYS-4',
      'DYS-4': 'DYS-5',
      'DYS-5': 'DYS-6',
    };
    return groupShiftMap[groupName] || groupName;
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
            backgroundColor: `${darkMode ? '#2d3748' : '#fff'} !important`,
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

  const columns = useMemo<MRT_ColumnDef<Person>[]>(
    () => [
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
        accessorKey: 'mobile_number',
        header: 'Number',
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
        accessorKey: 'address',
        header: 'Address',
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
        accessorKey: 'group_name',
        header: 'Group Name',
        size: 150,
        Cell: ({ cell }) => (
          <span
            className="data-cell"
            style={{ color: darkMode ? 'white' : 'inherit' }}
          >
            {shiftGroupName(cell.getValue<string>())}
          </span>
        ),
      },
    ],
    [darkMode],
  );

  if (isLoading) {
    return <div className={`mt-7 p-5 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Loading...</div>;
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
          color: ${darkMode ? '#fff' : '#3b82f6'} !important;
        }
        .MuiAutocomplete-option:hover {
          background-color: ${darkMode ? '#6f6f6f' : '#f0f0f0'} !important;
          color: ${darkMode ? '#fff' : '#2563eb'} !important;
        }
        .MuiAutocomplete-tag {
          background-color: ${darkMode ? '#4b5563' : '#e5e7eb'} !important;
          color: ${darkMode ? 'white' : '#1f2937'} !important;
        }
        .MuiAutocomplete-tag .MuiChip-label {
          color: ${darkMode ? 'white' : '#1f2937'} !important;
        }
        .MuiAutocomplete-tag .MuiChip-deleteIcon {
          color: ${darkMode ? '#d1d5db' : '#6b7280'} !important;
        }
        .MuiAutocomplete-tag:hover .MuiChip-deleteIcon {
          color: ${darkMode ? 'white' : '#374151'} !important;
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

      <div className="flex flex-wrap justify-end gap-4 p-4">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`flex w-full items-center rounded-full px-6 py-3 text-lg font-medium text-white sm:w-auto ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : darkMode
              ? 'bg-indigo-800 hover:bg-indigo-700'
              : 'bg-indigo-900 hover:bg-indigo-800'
          }`}
        >
          {isSubmitting ? (
            <span className="animate-pulse">Submitting...</span>
          ) : (
            <>
              <MdAddTask />
              <span className="pl-2">Submit Attendance</span>
            </>
          )}
        </button>
      </div>

      <div className={`max-w-2xll mx-auto mb-5 w-full rounded-md p-5 shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <Autocomplete
          multiple
          options={allStudents}
          getOptionLabel={(option) => 
            ` ${option.name} ${option.mobile_number} (${shiftGroupName(option.group_name)})`
          }
          onChange={handleAutocompleteChange}
          className="w-full"
          value={data}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Students"
              placeholder="Search..."
              fullWidth
            />
          )}
        />
      </div>

      {data.length === 0 ? (
        <div className="flex justify-center items-center">
          <div className={`p-5 mb-5 rounded-md shadow-2xl w-full max-w-2xll mx-auto text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <p className={`text-lg font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              Not Selected Attendance
            </p>
          </div>
        </div>
      ) : (
        <div className={`mb-5 rounded-md p-5 shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <MaterialReactTable
            columns={columns}
            data={data}
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
          />
        </div>
      )}
    </>
  );
};

export default Attendance;
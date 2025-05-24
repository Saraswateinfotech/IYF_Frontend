'use client';

import { useEffect, useMemo, useState } from 'react';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { getFrontlinerdetailReport } from 'services/apiCollection';
import { FaPhoneAlt } from 'react-icons/fa';
import ChangeGroup from 'components/allifycomponents/facilitators/ChangeGroup';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useParams, useSearchParams } from 'next/navigation';

type Student = {
  user_id: number;
  name: string;
  mobile_number: string;
  profession: string;
  student_id: number;
};

const FacilitatorDetails = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const facilitatorId = params.UserId;
  const facilitatorName = searchParams.get('facilitatorName');

  const selectedMonth = null;
  const selectedYear = null;
  const [data, setData] = useState<Student[]>([]);
  const [selectedRow, setSelectedRow] = useState<Student | null>(null);
  const [open, setOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [groupName, setGroupName] = useState('DYS');
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

  const fetchGetStudentGroupWise = async (group_name: string) => {
    try {
      setIsLoading(true);
      const users = await getFrontlinerdetailReport(facilitatorId, group_name, selectedMonth, selectedYear);
      console.log(users);
      setData(users);
    } catch (err) {
      console.log('Failed to fetch students by group');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGetStudentGroupWise(groupName);
  }, []);

  const formatProfession = (profession: string) => {
    switch (profession) {
      case 'job_candidate':
        return 'Job Candidate';
      default:
        return profession;
    }
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

  const columns = useMemo<MRT_ColumnDef<Student>[]>(
    () => [
      {
        accessorKey: 'student_name',
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
        accessorKey: 'chanting_round',
        header: 'Chanting Round',
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
        accessorKey: 'mobile_number',
        header: 'Phone Number',
        size: 150,
        Cell: ({ row }) => (
          <a
            href={`tel:${row.original.mobile_number}`}
            className={`flex transform items-center space-x-4 rounded-lg px-4 py-2 text-white transition duration-300 ease-in-out hover:scale-105 ${
              darkMode
                ? 'bg-indigo-800 hover:bg-indigo-700'
                : 'bg-indigo-900 hover:bg-indigo-800'
            }`}
          >
            <FaPhoneAlt className="text-xl" />
            <span className="text-sm md:text-base">
              {row.original.mobile_number}
            </span>
          </a>
        ),
      },
      {
        accessorKey: 'Change Group',
        header: 'Change Group',
        size: 150,
        Cell: ({ row }) => (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedRow(row.original);
              setOpen(true);
            }}
            className={`rounded px-3 py-1 text-white ${
              darkMode
                ? 'bg-indigo-800 hover:bg-indigo-700'
                : 'bg-indigo-900 hover:bg-indigo-800'
            }`}
          >
            <BsThreeDotsVertical size={18} />
          </button>
        ),
      },
    ],
    [darkMode],
  );

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
        select {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${darkMode ? 'white' : 'black'}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
          background-size: 1em;
        }
        select::-ms-expand {
          display: none;
        }
      `}</style>

      <h2 className={`mt-5 mb-5 text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Facilitator {facilitatorName} Student Report
      </h2>

      <div className="mt-10">
        <div className="mb-4 flex justify-end">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchGetStudentGroupWise(groupName);
            }}
            className="flex max-w-lg justify-end shadow-xl"
          >
            <select
              id="groups"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className={`block w-full rounded-lg border p-2.5 text-sm focus:border-blue-900 focus:ring-blue-900 ${
                darkMode
                  ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-blue-900 focus:ring-blue-900'
                  : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-900 focus:ring-blue-900'
              }`}
            >
              <option disabled>Select a Group</option>
              <option value="DYS">DYS</option>
              <option value="Jagganath">Jagganath</option>
              <option value="Nachiketa">Nachiketa</option>
              <option value="Shadev">Shadev</option>
              <option value="Nakul">Nakul</option>
              <option value="Arjun">Arjun</option>
              <option value="GourangSabha">GourangSabha</option>
              <option value="Bhima">Bhima</option>
            </select>

            <button
              type="submit"
              className={`ml-1.5 rounded-lg px-4 py-2 font-medium text-white ${
                darkMode
                  ? 'bg-blue-800 hover:bg-blue-700'
                  : 'bg-blue-900 hover:bg-blue-800'
              }`}
            >
              Show
            </button>
          </form>
        </div>

        <div className={`mb-5 mt-0 rounded-md p-5 shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <MaterialReactTable
            columns={columns}
            data={Array.isArray(data) ? data : []}
            enableSorting
            onRowSelectionChange={setRowSelection}
            state={{ rowSelection }}
            getRowId={(row, index) =>
              row.user_id != null
                ? row.user_id.toString()
                : index.toString()
            }
            muiTablePaperProps={tableStyles.muiTablePaperProps}
            muiTableProps={tableStyles.muiTableProps}
            muiTableContainerProps={tableStyles.muiTableContainerProps}
            muiTableBodyProps={tableStyles.muiTableBodyProps}
            muiTableHeadCellProps={tableStyles.muiTableHeadCellProps}
            muiTableBodyCellProps={tableStyles.muiTableBodyCellProps}
            muiPaginationProps={tableStyles.muiPaginationProps}
            muiTopToolbarProps={tableStyles.muiTopToolbarProps}
            muiColumnActionsButtonProps={tableStyles.muiColumnActionsButtonProps}
            muiTableBodyRowProps={{
              sx: {
                '&:hover': {
                  backgroundColor: `${darkMode ? '#3a4a8a' : '#f3f4f6'} !important`,
                },
                cursor: 'pointer',
              },
            }}
          />
        </div>
      </div>

      <ChangeGroup
        isOpens={open}
        closeModal={() => setOpen(false)}
        selectedRow={selectedRow}
        onSuccess={() => fetchGetStudentGroupWise(groupName)}
        priviousGroupName={groupName}
      />
    </>
  );
};

export default FacilitatorDetails;
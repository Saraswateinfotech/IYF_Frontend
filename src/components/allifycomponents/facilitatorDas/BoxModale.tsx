
'use client';
import React from 'react';
import { useEffect, useMemo, useState, useRef } from 'react';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { getFrontlinerdetailReport } from 'services/apiCollection';
import { FaPhoneAlt } from 'react-icons/fa';
import { CircularProgress } from '@mui/material';
import { FaWhatsapp } from 'react-icons/fa6';
import { FiEdit } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

type Student = {
  user_id: number;
  name: string;
  mobile_number: string;
  profession: string;
  student_id: number;
};

const BoxModale = ({ isOpen, onClose, title, children, facilitatorIds }) => {
  const facilitatorId = facilitatorIds;
  const selectedMonth = null;
  const selectedYear = null;
  const [data, setData] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const groupName = title;
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const fetchGetStudentGroupWise = useMemo(() => async (group_name: string) => {
    try {
      setIsLoading(true);
      setIsError(false);
      const users = await getFrontlinerdetailReport(
        facilitatorId,
        group_name,
        selectedMonth,
        selectedYear,
      );
      setData(users);
    } catch (err) {
      console.error('Failed to fetch students by group');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [facilitatorId, selectedMonth, selectedYear]);

  useEffect(() => {
    if (isOpen && groupName) {
      fetchGetStudentGroupWise(groupName);
    }
  }, [isOpen, groupName, fetchGetStudentGroupWise]);

  const formatProfession = (profession: string) => {
    switch (profession) {
      case 'job_candidate':
        return 'Job Candidate';
      default:
        return profession;
    }
  };

  const columns = useMemo<MRT_ColumnDef<Student>[]>(
    () => [
      {
        accessorKey: 'student_name',
        header: 'Name',
        size: 100,
        Cell: ({ cell }) => (
          <span className="text-sm sm:text-base">{cell.getValue() as string}</span>
        ),
      },
      {
        accessorKey: 'chanting_round',
        header: 'Chanting Round',
        size: 100,
        Cell: ({ cell }) => (
          <span className="text-sm sm:text-base">
            {formatProfession(cell.getValue() as string)}
          </span>
        ),
      },
      {
        accessorKey: 'mobile_number',
        header: 'Phone Number',
        Cell: ({ row }) => (
          <div className="flex flex-wrap gap-2">
            <a
              href={`https://wa.me/${row.original.mobile_number}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-2 rounded-lg bg-green-600 text-white hover:bg-green-500 text-sm sm:text-base"
            >
              <FaWhatsapp className="mr-1" />
              {/* <span className="hidden sm:inline">WhatsApp</span> */}
            </a>
            <a
              href={`tel:${row.original.mobile_number}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-2 rounded-lg bg-indigo-900 text-white hover:bg-indigo-800 text-sm sm:text-base"
            >
              <FaPhoneAlt className="mr-1" />
              <span>{row.original.mobile_number}</span>
            </a>
          </div>
        ),
      },
      {
        accessorKey: 'action',
        header: 'Edit',
        size: 80,
        Cell: ({ row }) => (
          <button
            className="flex items-center gap-1 sm:gap-2 rounded bg-blue-900 px-2 py-1 sm:px-3 sm:py-1 text-white hover:bg-blue-800 text-sm sm:text-base"
            onClick={() =>
              router.push(
                `/admin/editstudent/${
                  row.original.student_id ?? row.original.user_id
                }`
              )
            }
          >
            <FiEdit size={14} />
            <span>Edit</span>
          </button>
        ),
      }
    ],
    [],
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex mt-[76px] md:mt-10 md:ml-16">
      {/* Backdrop with shadow effect */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 lg:ml-64 mt-16" 
        onClick={onClose}
      ></div>
      
      {/* Modal container with ref for outside click detection */}
      <div 
        ref={modalRef}
        className="relative w-full lg:w-[calc(100%-16rem)] lg:ml-64 mt-16 h-[calc(100%-4rem)] bg-white overflow-auto shadow-2xl rounded-lg"
      >
        {/* Sticky header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white p-3 sm:p-4 shadow-sm">
          <h3 className="text-lg sm:text-xl font-medium text-gray-900">
            {title}
          </h3>
          <button
            type="button"
            className="bg-transparent inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900"
            onClick={onClose}
          >
            <svg
              className="h-3 w-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
        </div>
        
        {/* Responsive content area */}
        <div className="p-2 sm:p-4 h-[calc(100%-56px)] overflow-auto">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <CircularProgress />
              <span className="ml-3 text-sm sm:text-base">Loading student data...</span>
            </div>
          ) : isError ? (
            <div className="flex h-full items-center justify-center text-red-500 text-sm sm:text-base">
              Failed to load data. Please try again.
            </div>
          ) : (
            <MaterialReactTable
              columns={columns}
              data={Array.isArray(data) ? data : []}
              enableSorting
              getRowId={(row, index) =>
                row.user_id != null
                  ? row.user_id.toString()
                  : index.toString()
              }
              muiTableContainerProps={{
                sx: {
                  height: '100%',
                  maxHeight: 'none',
                },
              }}
              muiTablePaperProps={{
                sx: {
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: 'none',
                }
              }}
              muiTableHeadCellProps={{
                sx: {
                  backgroundColor: '#312e81',
                  color: 'white',
                  fontWeight: 'bold',
                },
              }}
              muiTableBodyRowProps={{
                sx: {
                  '&:hover': {
                    backgroundColor: '#f3f4f6',
                  },
                },
              }}
              displayColumnDefOptions={{
                'mrt-row-actions': {
                  header: '',
                },
              }}
              initialState={{
                density: 'compact',
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BoxModale;
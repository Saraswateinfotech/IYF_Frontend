'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { toast, ToastContainer } from 'react-toastify';
import {
  fetchAllFacilitatorOrFrontliner,
  updateCallingId,
  getFrontlinerReport,
  frontlinerStudentByIdOfcallingId,
} from 'services/apiCollection';
import { FaCheckCircle, FaPhoneAlt, FaTimesCircle } from 'react-icons/fa';
import { Autocomplete, TextField } from '@mui/material';
import ResponseModal from 'components/allifycomponents/callingSystem/ResponseModal';
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
  const [callingStudents, setCallingStudents] = useState<Student[]>([]);
  const [frontlinerReport, setFrontlinerReport] = useState<any>(null);
  const [selectedRow, setSelectedRow] = useState<Student | null>(null);
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [selectedFrontliner, setSelectedFrontliner] =
    useState<Frontliner | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { id: frontlinerId } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const frontlinerName = searchParams.get('frontlinerName');

  const fetchData = useCallback(async () => {
    if (!frontlinerId) return;
    setIsLoading(true);
    try {
      const [frontlinerRes, reportRes, res] = await Promise.all([
        fetchAllFacilitatorOrFrontliner(),
        getFrontlinerReport(frontlinerId),
        frontlinerStudentByIdOfcallingId(frontlinerId),
      ]);
      setCallingStudents(res.data);
      setFrontliners(frontlinerRes);
      setFrontlinerReport(reportRes[0]);
    } catch (err) {
      console.error('Error fetching data:', err);
      // toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  }, [frontlinerId]);

  useEffect(() => {
    if (frontlinerId) fetchData();
  }, [frontlinerId, fetchData]);

  const refreshStudentAndReports = useCallback(async () => {
    if (!frontlinerId) return;
    try {
      const [res, reportRes, frontlinerRes] = await Promise.all([
        frontlinerStudentByIdOfcallingId(frontlinerId),
        fetchAllFacilitatorOrFrontliner(),
        getFrontlinerReport(frontlinerId),
      ]);
      setCallingStudents(res.data);
      setFrontlinerReport(reportRes[0]);
      setFrontliners(frontlinerRes);
    } catch (err) {
      console.error(err);
      toast.error('Failed to refresh data');
    }
  }, [frontlinerId]);
  
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
      await updateCallingId(
        selectedUserIds,
        String(selectedFrontliner.user_id),
      );
      toast.success('Calling ID assigned successfully!');
      
      if (frontlinerId) {
        const res = await frontlinerStudentByIdOfcallingId(frontlinerId);
        if (!res.data?.length) {  // Check if data is empty
          toast.error('No student data available');
          window.history.back();   // Go back if no data
          return;
        }
        setCallingStudents(res.data);
      }
      
      setRowSelection({});
    } catch (err) {
      console.error(err);
      // window.location.reload();
    } finally {
      setIsLoading(false);
    }
  }, [callingStudents, rowSelection, selectedFrontliner, frontlinerId]);
  // const handleAssign = useCallback(async () => {
  //   if (!selectedFrontliner) {
  //     toast.error('Please select a frontliner');
  //     return;
  //   }
  //   const selectedUserIds = callingStudents
  //     .filter((row) => rowSelection[row.user_id.toString()])
  //     .map((row) => row.user_id);

  //   if (!selectedUserIds.length) {
  //     toast.error('Please select at least one student');
  //     return;
  //   }

  //   setIsLoading(true);
  //   try {
  //     await updateCallingId(
  //       selectedUserIds,
  //       String(selectedFrontliner.user_id),
  //     );
  //     toast.success('Calling ID assigned successfully!');
  //     if (frontlinerId) {
  //       const res = await frontlinerStudentByIdOfcallingId(frontlinerId);
  //       setCallingStudents(res.data);
  //     }
  //     setRowSelection({});
  //   } catch (err) {
  //     console.error(err);
  //     // window.location.reload();
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, [callingStudents, rowSelection, selectedFrontliner, frontlinerId]);

  const callingStudentColumns = useMemo<MRT_ColumnDef<Student>[]>(
    () => [
      { accessorKey: 'name', header: 'Name' },
      {
        accessorKey: 'profession',
        header: 'Profession',
        Cell: ({ cell }) => {
          const value = cell.getValue<string>();
          const formatted = value
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          return formatted;
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
          return <span>{statusMap[value] || value}</span>;
        },
      },

      {
        accessorKey: 'student_status_date',
        header: 'Last Calling Date',
        Cell: ({ cell }) => {
          const raw = cell.getValue<string>();
          if (!raw) return null; // If null, don't display anything
          const date = new Date(raw);
          const formatted = date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          });
          return <span>{formatted}</span>;
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
              className="inline-flex transform items-center space-x-2 rounded-lg bg-green-600 px-4 py-2 text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-green-500"
            >
              <FaWhatsapp className="text-lg" />
              {/* <span className="text-sm md:text-base">WhatsApp</span> */}
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
    [],
  );

  return (
    <>
      <ToastContainer />
      <div className="mt-8">
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => router.back()}
            className="rounded-md bg-red-800 px-4 py-2 text-white hover:bg-red-700"
          >
            ← Back
          </button>
        </div>

        <h2 className="mb-5 text-lg font-bold dark:text-white">
          Frontliner {frontlinerName} Report
        </h2>
        <Reports report={frontlinerReport} />

        <div className="mb-5 rounded-md bg-white p-5 shadow-2xl">
          <>
            <h2 className="mb-5 text-lg font-bold ">
              Frontliner {frontlinerName} Assigned Calling
            </h2>
            <div className="mx-auto mb-5 flex w-full flex-col rounded-md bg-white p-5 shadow-2xl md:flex-row">
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
                className="mt-4 rounded-lg bg-indigo-900 px-8 py-3.5 text-lg text-white hover:bg-indigo-800 md:ml-2 md:mt-0"
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
              state={{ rowSelection }}
              getRowId={(row) => row.user_id.toString()}
              muiTableHeadCellProps={{
                sx: {
                  backgroundColor: '#312e81',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  borderRadius: '2px',
                },
              }}
            />
          </>
        </div>

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

'use client';

import { useEffect, useMemo, useState } from 'react';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { toast, ToastContainer } from 'react-toastify';
import {
  fetchAllStudents,
  fetchAllFacilitatorOrFrontliner,
  updateCallingId,
  getFrontlinerReport,
  frontlinerStudentByIdOfcallingId,
  getdashboardReport,
} from 'services/apiCollection';
import PaymentStatus from './PaymentStatus';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { Autocomplete, TextField } from '@mui/material';
import ResponseModal from './ResponseModal';
import Reports from '../Reports';

type Student = {
  user_id: number;
  name: string;
  mobile_number: string;
  payment_mode: string;
  registration_date: string;
  student_status: string;
  student_status_date: string;
  profession: string;
  payment_status: string;
};

type AllStudent = {
  user_id: number;
  name: string;
  mobile_number: string;
  payment_mode: string;
  registration_date: string;
  payment_status: string;
};

type Frontliner = {
  user_id: number;
  name: string;
  phone_number: string;
  role: string;
};

const CallingSystem = () => {
  const [data, setData] = useState<AllStudent[]>([]);
  const [frontliners, setFrontliners] = useState<Frontliner[]>([]);
  const [frontlinerStudents, setFrontlinerStudents] = useState<Student[]>([]);
  const [frontlinerReport, setFrontlinerReport] = useState<any>(null);
  const [selectedRow, setSelectedRow] = useState<Student | null>(null);
  const [selectedRowData, setSelectedRowData] = useState<AllStudent | null>(
    null,
  );
  const [open, setOpen] = useState(false);
  const [opens, setOpens] = useState(false);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [selectedFrontliner, setSelectedFrontliner] =
    useState<Frontliner | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAssignmentUI, setShowAssignmentUI] = useState(false);
  const [report, setReport] = useState<any>(null);

  // Initial fetch for students and frontliners
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [studentsRes, frontlinerRes, dashboardReport] = await Promise.all(
          [
            fetchAllStudents(),
            fetchAllFacilitatorOrFrontliner(),
            getdashboardReport(),
          ],
        );
        setData(studentsRes.students);
        setFrontliners(frontlinerRes);
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

  const refreshData = async () => {
    try {
      setIsLoading(true);
      const studentsRes = await fetchAllStudents();
      setData(studentsRes.students);
      const data = await getdashboardReport();
      setReport(data[0]);
    } catch (err) {
      console.error('Error refreshing data:', err);
      toast.error('Failed to refresh data');
    } finally {
      setIsLoading(false);
    }
  };

  // When toggling assignment mode, clear selections and API data.
  useEffect(() => {
    if (!showAssignmentUI) {
      // Normal view: show students
      fetchAllStudents()
        .then((res) => setData(res.students))
        .catch(() => toast.error('Failed to fetch students'));
      setSelectedFrontliner(null);
      setFrontlinerStudents([]);
      setFrontlinerReport(null);
      setRowSelection({});
    }
  }, [showAssignmentUI]);

  // Columns for students table (Registration view or frontliner students)
  const studentColumns = useMemo<MRT_ColumnDef<Student>[]>(
    () => [
      { accessorKey: 'name', header: 'Name', size: 180 },
      { accessorKey: 'mobile_number', header: 'Phone Number', size: 80 },
      { accessorKey: 'payment_mode', header: 'Payment Mode', size: 80 },
      {
        accessorKey: 'registration_date',
        header: 'Registration Date',
        size: 80,
      },
      { accessorKey: 'profession', header: 'Profession', size: 80 },
      {
        accessorKey: 'student_status_date',
        header: 'Student Status Date',
        size: 80,
      },
      {
        accessorKey: 'student_status', // Column name in your data
        header: 'Student Status',
        size: 80,
        Cell: ({ cell }) => {
          // Get the student status value
          const value = cell.getValue<string>();

          // Map the value to the readable format
          const statusMap: { [key: string]: string } = {
            will_come: 'Will Come',
            not_interested: 'Not Interested',
            busy: 'Busy',
            might_come: 'Might Come',
          };

          // Return the mapped value or the original value if it is unknown
          return <span>{statusMap[value] || value}</span>;
        },
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
            Respond
          </button>
        ),
      },
      {
        accessorKey: 'payment_status', // Column name in your data
        header: 'Payment Status',
        size: 150,
        Cell: ({ row, cell }) => {
          const value = cell.getValue<string>(); // Get the payment status value from cell
          const user = row.original; // Get the original user object

          // Map database values to user-friendly display values
          const paymentStatusMap: { [key: string]: string } = {
            received: 'Received',
            not_received: 'Not Received',
          };

          const handleClick = () => {
            if (value === 'not_received') {
              setSelectedRow(user);
              setOpens(true);
            }
          };

          return (
            <span
              onClick={handleClick}
              style={{
                color: value === 'received' ? 'green' : 'red', // Green for received, red for not received
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
              {paymentStatusMap[value] || value}{' '}
              {/* Display the mapped value */}
            </span>
          );
        },
      },
    ],
    [],
  );
  // Columns for AllStudent table (Registration view students)
  const AllStudentColumns = useMemo<MRT_ColumnDef<AllStudent>[]>(
    () => [
      { accessorKey: 'name', header: 'Name', size: 180 },
      { accessorKey: 'mobile_number', header: 'Phone Number', size: 80 },
      { accessorKey: 'payment_mode', header: 'Payment Mode', size: 80 },
      {
        accessorKey: 'registration_date',
        header: 'Registration Date',
        size: 80,
      },
      {
        accessorKey: 'payment_status',
        header: 'Payment Status',
        size: 150,
        Cell: ({ row, cell }) => {
          const value = cell.getValue<string>();
          const user = row.original;
          const handleClick = () => {
            if (value === 'not_received') {
              setSelectedRowData(user);
              setOpens(true);
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
              {value === 'received' ? 'Received' : 'Not Received'}{' '}
              {/* Capitalized status */}
            </span>
          );
        },
      },
    ],
    [],
  );

  // Columns for frontliner selection table
  const frontlinerColumns = useMemo<MRT_ColumnDef<Frontliner>[]>(
    () => [
      // { accessorKey: 'user_id', header: 'ID' },
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'phone_number', header: 'Phone Number' },
      { accessorKey: 'role', header: 'Role' },
    ],
    [],
  );

  // When a frontliner row is clicked, call both APIs.
  const handleFrontlinerClick = async (frontliner: Frontliner) => {
    setSelectedFrontliner(frontliner);
    try {
      setIsLoading(true);

      // Make sure to check if studentRes.students exists
      const studentRes = await frontlinerStudentByIdOfcallingId(frontliner.user_id);
      setFrontlinerStudents(studentRes.data); // Default to empty array if undefined

      // getFrontlinerReport
      const reportRes = await getFrontlinerReport(frontliner.user_id);
      setFrontlinerReport(reportRes[0]); // Default to empty object if undefined
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch frontliner details');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshDatafrontliner = (frontliner: Frontliner) => {
    setSelectedFrontliner(frontliner);
    setIsLoading(true);
    frontlinerStudentByIdOfcallingId(frontliner.user_id)
      .then((studentRes) => {
        setFrontlinerStudents(studentRes.data);
        return getFrontlinerReport(frontliner.user_id);
      })
      .then((reportRes) => {
        setFrontlinerReport(reportRes[0]);
      })
      .catch((err) => {
        console.error('Error refreshing refreshDatafrontliner data:', err);
        toast.error('Failed to refresh refreshDatafrontliner data');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // For assigning calling ID from frontliner student view.
  const handleAssign = async () => {
    const selectedUserIds = frontlinerStudents
      .filter((row) => rowSelection[row.user_id.toString()])
      .map((row) => row.user_id);

    if (!selectedUserIds.length || !selectedFrontliner) {
      toast.error(
        'Please select at least one student and ensure a frontliner is selected',
      );
      return;
    }

    const callingId = `${selectedFrontliner.user_id}`;

    try {
      setIsLoading(true);
      await updateCallingId(selectedUserIds, callingId);
      toast.success('Calling ID assigned successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to assign calling ID');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="mt-6 px-6 text-lg dark:bg-white">Loading...</div>;
  }

  return (
    <>
    <ToastContainer/>
      <div className="mt-12">
        <h2 className="mb-3 text-lg font-bold dark:text-white">
          {showAssignmentUI ? (
            selectedFrontliner ? (
              <>Calling System - {selectedFrontliner.name}</>
            ) : (
              <></>
              // <>Select a Frontliner</>
            )
          ) : (
            <>Dashboard Report</>
          )}
        </h2>

        <div className="mb-5 mt-0 rounded-md bg-white p-5 shadow-2xl">
          {/* Toggle Button */}
          <div className="mb-4 mt-1 flex justify-end">
            <label className="inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={showAssignmentUI}
                onChange={(e) => {
                  setShowAssignmentUI(e.target.checked);
                  setSelectedFrontliner(null);
                  setFrontlinerStudents([]);
                  setFrontlinerReport(null);
                  setRowSelection({});
                }}
              />
              <div className="peer relative h-7 w-14 rounded-full bg-gray-200 after:absolute after:start-[4px] after:top-0.5 after:h-6 after:w-6 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-900 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 dark:border-gray-600 dark:bg-gray-700 dark:peer-checked:bg-blue-900 dark:peer-focus:ring-blue-800 rtl:peer-checked:after:-translate-x-full" />
            </label>
          </div>

          {showAssignmentUI ? (
            selectedFrontliner ? (
              <>
                {/* Report Boxes from getFrontlinerReport() */}

                <Reports report={frontlinerReport} />

                <div className="mx-auto mb-5 flex w-full flex-col rounded-md bg-white p-5 shadow-2xl md:flex-row">
                  <Autocomplete
                    id="frontliner-select"
                    options={frontliners.filter(
                      (frontliner) =>
                        frontliner.user_id !== selectedFrontliner?.user_id, // Filter out selected frontliner
                    )}
                    loading={isLoading}
                    getOptionLabel={(option) =>
                      `${option.user_id} - ${option.name} (${option.role})`
                    }
                    onChange={(event, newValue) =>
                      setSelectedFrontliner(newValue)
                    }
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
                    className="mt-4 rounded-lg bg-indigo-900 bg-gradient-to-br px-8 py-3.5 text-center text-lg font-medium text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 md:ml-2 md:mt-0"
                  >
                    {isLoading ? 'Assigning...' : 'Assign'}
                  </button>
                </div>

                {/* Frontliner Student Table with checkboxes */}
                <MaterialReactTable
                  columns={studentColumns}
                  data={frontlinerStudents ?? []} // Always pass an array to avoid undefined error
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
            ) : (
              // Frontliner Table (for selection) without checkboxes.
              <MaterialReactTable
                columns={frontlinerColumns}
                data={frontliners}
                enableSorting
                muiTableHeadCellProps={{
                  sx: {
                    backgroundColor: '#312e81',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    borderRadius: '2px',
                  },
                }}
                muiTableBodyRowProps={({ row }) => ({
                  onClick: () => handleFrontlinerClick(row.original),
                  style: { cursor: 'pointer' },
                })}
              />
            )
          ) : (
            <>
              <div>
                <Reports report={report} />
              </div>
              {/* // Registration view: Students Table */}

              <h2 className="mb-5 mt-14 text-lg font-bold">Registration</h2>
              <MaterialReactTable
                columns={AllStudentColumns}
                data={data}
                enableSorting
                enableRowSelection={false}
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
          )}
        </div>
      </div>

      <PaymentStatus
        isOpens={opens}
        closeModal={() => setOpens(false)}
        selectedRow={selectedRow || selectedRowData}
        onSuccess={refreshData} // Refresh data after payment status update
      />

      <ResponseModal
        isOpen={open}
        closeModal={() => setOpen(false)}
        selectedRow={selectedRow}
        onSuccess={() => refreshDatafrontliner(selectedFrontliner)} // Now calling the updated function
      />
    </>
  );
};

export default CallingSystem;

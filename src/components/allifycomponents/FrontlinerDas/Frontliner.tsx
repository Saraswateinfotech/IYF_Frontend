
'use client';

import { useEffect, useMemo, useState } from 'react';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { toast } from 'react-toastify';
import { frontlinerStudentById, getFrontlinerReport } from 'services/apiCollection';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useDashboardContext } from 'contexts/DashboardContext';
import Reports from '../Reports';

// Student type
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
  const [report, setReport] = useState<any>(null); // State to store report data
  const [isLoading, setIsLoading] = useState(false);

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

  const columns = useMemo<MRT_ColumnDef<Student>[]>(() => [
    { accessorKey: 'name', header: 'Name', size: 200 },
    { accessorKey: 'mobile_number', header: 'Phone Number', size: 150 },
    { accessorKey: 'payment_mode', header: 'Payment Mode', size: 150 },
    {
      accessorKey: 'registration_date',
      header: 'Registration Date',
      size: 150,
    },
    {
      accessorKey: 'payment_status',
      header: 'Payment Status',
      size: 150,
      Cell: ({ row, cell }) => {
        const value = cell.getValue<string>();
        const displayValue = value === 'received' ? 'Received' : value === 'not_received' ? 'Not Received' : value;
        return (
          <span
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
            {displayValue}
          </span>
        );
      },
    }
    
  ], []);

  if (isLoading) {
    return <div className="mt-6 px-6 text-lg dark:bg-white">Loading...</div>;
  }

  return (
    <>
      <div className="mt-8">
        <h2 className="mb-3 text-lg font-bold dark:text-white">
          Frontliner Report
        </h2>
        {report && <Reports report={report} />}
        <div className="mt-12">
          <h2 className="mb-3 text-lg font-bold dark:text-white">
            Registration
          </h2>
          <div className="mb-5 mt-0 rounded-md bg-white p-5 shadow-2xl">
            {/* Table */}
            <MaterialReactTable
              columns={columns}
              data={data}
              enableSorting
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
          </div>
        </div>
      </div>
    </>
  );
};

export default FrontlinerCallingSystem;

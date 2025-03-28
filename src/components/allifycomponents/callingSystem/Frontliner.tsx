'use client';

import { useEffect, useMemo, useState } from 'react';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { toast } from 'react-toastify';
import { frontlinerStudentById } from 'services/apiCollection';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

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
  const [data, setData] = useState<Student[]>([]);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const frontlinerId = localStorage.getItem('frontlinerId');

        const studentsRes = await frontlinerStudentById(frontlinerId);
        setData(studentsRes.users);
      } catch (err) {
        console.error('Error fetching data:', err);
        toast.error('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = useMemo<MRT_ColumnDef<Student>[]>(
    () => [
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
              {value}
            </span>
          );
        },
      },
    ],
    [],
  );

  if (isLoading) {
    return <div className="mt-6 px-6 text-lg dark:bg-white">Loading...</div>;
  }

  return (
    <>
      <div className="mt-12">
        <h2 className="mb-3 text-lg font-bold dark:text-white">Registration</h2>
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
    </>
  );
};

export default FrontlinerCallingSystem;

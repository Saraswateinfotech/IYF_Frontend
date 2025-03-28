'use client';

import { useEffect, useMemo, useState } from 'react';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { toast } from 'react-toastify';
import { getUserByCallingId } from 'services/apiCollection';
import ResponseModal from './ResponseModal';

type Student = {
  user_id: number;
  name: string;
  mobile_number: string;
  profession: string;
  student_status: string;
  payment_status: string;
  response?: string;
};

const   AssignedCalling = () => {
  const [data, setData] = useState<Student[]>([]);
  const [selectedRow, setSelectedRow] = useState<Student | null>(null);
  const [open, setOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchStudentsByCallingId = async () => {
    try {
      setIsLoading(true);
      const users = await getUserByCallingId();
      setData(users);
    } catch (err) {
      console.log('Failed to fetch students by calling ID');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentsByCallingId();
  }, []);

  const columns = useMemo<MRT_ColumnDef<Student>[]>(() => [
    {
      accessorKey: 'name',
      header: 'Name',
      size: 200,
    },
    {
      accessorKey: 'mobile_number',
      header: 'Phone Number',
      size: 150,
    },
    {
      accessorKey: 'profession',
      header: 'Profession',
      size: 150,
    },
    {
      accessorKey: 'student_status',
      header: 'Student Status',
      size: 150,
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
  ], []);

  if (isLoading) {
    return <div className="mt-6 px-6 text-lg dark:bg-white">Loading...</div>;
  }

  return (
    <>
      <div>
        <h2 className="mb-3 text-lg font-bold dark:text-white">
          Assigned Calling
        </h2>
        <div className="mb-5 mt-0 rounded-md bg-white p-5 shadow-2xl">
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
            muiTableBodyRowProps={{
              sx: {
                '&:hover': {
                  backgroundColor: '#f3f4f6',
                },
                cursor: 'pointer',
              },
            }}
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

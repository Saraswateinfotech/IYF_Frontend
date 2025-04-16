'use client';

import { useEffect, useMemo, useState } from 'react';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { getFrontlinerdetailReport } from 'services/apiCollection';
import { FaPhoneAlt } from 'react-icons/fa';
import ChangeGroup from 'components/allifycomponents/facilitators/ChangeGroup';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useParams } from 'next/navigation';

type Student = {
  user_id: number;
  name: string;
  mobile_number: string;
  profession: string;
};

const FacilitatorDetails = () => {
  const params = useParams();
  const facilitatorId = params.UserId;

  const [data, setData] = useState<Student[]>([]);
  const [selectedRow, setSelectedRow] = useState<Student | null>(null);
  const [open, setOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [groupName, setGroupName] = useState('DYS');

  const fetchGetStudentGroupWise = async (group_name: string) => {
    try {
      setIsLoading(true);
      const users = await getFrontlinerdetailReport(facilitatorId, group_name);
      setData(users.users);
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

  const columns = useMemo<MRT_ColumnDef<Student>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        size: 200,
      },
     
      {
        accessorKey: 'profession',
        header: 'Profession',
        size: 150,
        Cell: ({ cell }) => formatProfession(cell.getValue() as string),
      },
      {
        accessorKey: 'mobile_number',
        header: 'Phone Number',
        size: 150,
        Cell: ({ row }) => (
          <a
            href={`tel:${row.original.mobile_number}`}
            className="flex transform items-center space-x-4 rounded-lg bg-indigo-900 px-4 py-2 text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-indigo-800"
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
            className="rounded bg-indigo-900 px-3 py-1 text-white hover:bg-indigo-800"
          >
            <BsThreeDotsVertical size={18} />
          </button>
        ),
      },
     
    ],
    [],
  );

  if (isLoading) {
    return <div className="mt-6 px-6 text-lg dark:bg-white">Loading...</div>;
  }

  return (
    <>
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
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-900 focus:ring-blue-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-900 dark:focus:ring-blue-900"
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
              className="ml-1.5 rounded-lg bg-blue-900 px-4 py-2 font-medium text-white hover:bg-blue-800"
            >
              Show
            </button>
          </form>
        </div>

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

      <ChangeGroup
        isOpens={open}
        closeModal={() => setOpen(false)}
        selectedRow={selectedRow}
        onSuccess={() => fetchGetStudentGroupWise(groupName)}
      />
    </>
  );
};

export default FacilitatorDetails;

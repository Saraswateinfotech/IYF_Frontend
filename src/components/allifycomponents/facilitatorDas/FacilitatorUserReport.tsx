'use client';

import { useEffect, useMemo, useState } from 'react';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { getStudentGroupWise } from 'services/apiCollection';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { FaPhoneAlt } from 'react-icons/fa';
import { BsThreeDotsVertical } from 'react-icons/bs';

type Student = {
  user_id: number;
  name: string;
  chanting_round: string;
  action: string;
  mobile_number: string;
};

const groupList = [
  'DYS',
  'Jagganath',
  'Nachiketa',
  'Shadev',
  'Nakul',
  'Arjun',
  'GourangSabha',
  'Bhima',
];

const ActionCell = ({ row }: { row: any }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [btnPosition, setBtnPosition] = useState({ x: 0, y: 0 });

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const rect = (e.target as HTMLButtonElement).getBoundingClientRect();
    setBtnPosition({ x: rect.right, y: rect.bottom });
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (open) setOpen(false);
    };
    if (open) window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [open]);

  const handleRouteOne = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    router.push(`/admin/facilitators/attendanceReport`);
    setOpen(false);
  };

  const handleRouteTwo = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const dataString = encodeURIComponent(JSON.stringify(row.original));
    router.push(
      `/admin/batches/BatchId/edit/${row.original.user_id}?data=${dataString}`,
    );
    setOpen(false);
  };

  const popDownMenu = (
    <div
      style={{ position: 'fixed', top: btnPosition.y, left: btnPosition.x }}
      className="z-[9999] mt-2 w-40 rounded border border-gray-200 bg-white shadow-md"
    >
      <button
        onClick={handleRouteOne}
        className="block w-full px-4 py-2 text-left hover:bg-gray-100"
      >
        Attendance Report
      </button>
      <button
        onClick={handleRouteTwo}
        className="block w-full px-4 py-2 text-left hover:bg-gray-100"
      >
        Edit detail
      </button>
    </div>
  );

  return (
    <>
      <button
        onClick={handleToggle}
        className="relative rounded bg-indigo-900 px-3 py-1 text-white hover:bg-indigo-800"
      >
        <BsThreeDotsVertical size={18} />
      </button>
      {open &&
        typeof document !== 'undefined' &&
        createPortal(popDownMenu, document.body)}
    </>
  );
};

const FacilitatorUserReport = () => {
  const facilitatorId =
    typeof window !== 'undefined' ? localStorage.getItem('frontlinerId') : null;

  const [data, setData] = useState<Student[]>([]);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [groupName, setGroupName] = useState('DYS');

  const fetchGetStudentGroupWise = async (group_name: string) => {
    if (!facilitatorId) return;
    setIsLoading(true);
    try {
      const users = await getStudentGroupWise(facilitatorId, group_name);
      setData(users.users);
    } catch (err) {
      console.log('Failed to fetch students by group', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (groupName) {
      fetchGetStudentGroupWise(groupName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupName]);

  const columns = useMemo<MRT_ColumnDef<Student>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        size: 200,
      },
      {
        accessorKey: 'chanting_round',
        header: 'Chanting',
        size: 200,
      },
      // {
      //   accessorKey: 'total_report',
      //   header: 'Total Report',
      //   size: 200,
      // },
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
        accessorKey: 'action',
        header: 'Action',
        size: 150,
        Cell: ({ row }) => <ActionCell row={row} />,
      },
    ],
    [],
  );

  if (isLoading) {
    return <div className="mt-6 px-6 text-lg dark:bg-white">Loading...</div>;
  }

  return (
    <div className="mt-10">

      {/* Group Selector */}
      <div className="mb-4 mt-10 flex justify-end">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchGetStudentGroupWise(groupName);
          }}
          className="flex max-w-2xl flex-wrap justify-end"
        >
          <select
            id="groups"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="block w-48 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
          >
            <option disabled>Select a Group</option>
            {groupList.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="ml-1.5 rounded-lg bg-blue-900 px-4 py-2 font-medium text-white hover:bg-blue-800"
          >
            Show
          </button>
        </form>
      </div>

      {/* Table with "accordion" detail panel and global filter */}
      <div className="mb-5 mt-0 rounded-md bg-white p-5 shadow-2xl">
        <MaterialReactTable
          columns={columns}
          data={data}
          enableSorting
          // For "accordion" row expansion
          enableExpanding
          positionExpandColumn="last"
          renderDetailPanel={({ row }) => (
            <div className="p-4">
              <p>
                This is the accordion content for <strong>{row.original.name}</strong>.
              </p>
              <p>Place any additional info here.</p>
            </div>
          )}

          // Add top search (global filter)
          enableGlobalFilter
          positionGlobalFilter="right"
          initialState={{ showGlobalFilter: true }}

          // If you also want column-level filters, uncomment:
          // enableColumnFilters

          onRowSelectionChange={setRowSelection}
          state={{ rowSelection }}
          getRowId={(row) => row.user_id.toString()}
          muiTablePaperProps={{
            sx: {
              overflow: 'visible !important',
            },
          }}
          muiTableBodyCellProps={{
            sx: {
              overflow: 'visible',
            },
          }}
        />
      </div>
    </div>
  );
};

export default FacilitatorUserReport;

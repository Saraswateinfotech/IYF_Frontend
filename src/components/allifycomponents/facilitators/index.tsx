

'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { toast, ToastContainer } from 'react-toastify';
import {
  fetchAllFacilitatorOrFrontliner,
  getdashboardReport,
} from 'services/apiCollection';
import { FaPhoneAlt } from 'react-icons/fa';
import { FaWhatsapp } from 'react-icons/fa6';

type Frontliner = {
  user_id: number;
  name: string;
  phone_number: string;
  role: string;
};

const Facilitators = () => {
  const [frontliners, setFrontliners] = useState<Frontliner[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [frontlinerRes, dashboardReport] = await Promise.all([
          fetchAllFacilitatorOrFrontliner(),
          getdashboardReport(),
        ]);

        // Filter to only include items where role is 'frontliner'
        const filteredFrontliners = frontlinerRes.filter(
          (item: Frontliner) => item.role === 'facilitator'
        );
        setFrontliners(filteredFrontliners);

      } catch (err) {
        console.error('Error fetching data:', err);
        toast.error('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const frontlinerColumns = useMemo<MRT_ColumnDef<Frontliner>[]>(() => [
    { accessorKey: 'name', header: 'Name' },
    // { accessorKey: 'phone_number', header: 'Phone Number',Cell: ({ row }) => (
    //                 <a
    //                   href={`tel:${row.original.phone_number}`}
    //                   onClick={(e) => e.stopPropagation()}
    //                   className="inline-flex items-center space-x-5 px-6   py-2 rounded-lg bg-indigo-900 text-white hover:bg-indigo-800 transition duration-300 ease-in-out transform hover:scale-105"
    //                 >
    //                   <FaPhoneAlt className="text-xl" />
    //                   <span className="text-sm md:text-base">{row.original.phone_number}</span>
    //                 </a>
    //               ), },
    {
      accessorKey: 'phone_number',
      header: 'Phone Number',
      Cell: ({ row }) => (
        <div className="flex space-x-4">
           <a
            href={`https://wa.me/${row.original.phone_number}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-500 transition duration-300 ease-in-out transform hover:scale-105"
          >
            <FaWhatsapp className="text-lg" />
            {/* <span className="text-sm md:text-base">WhatsApp</span> */}
          </a>
          <a
            href={`tel:${row.original.phone_number}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-indigo-900 text-white hover:bg-indigo-800 transition duration-300 ease-in-out transform hover:scale-105"
          >
            <FaPhoneAlt className="text-lg" />
            <span className="text-sm md:text-base">{row.original.phone_number}</span>
          </a>
         
        </div>
      ),
    },
    // { accessorKey: 'role', header: 'Role' },
  ], []);

  const handleFrontlinerClick = (frontliner: Frontliner) => {
    router.push(`/admin/facilitators/${frontliner.user_id}?facilitatorName=${frontliner.name}`);
    // router.push(`/admin/facilitators/${frontliner.user_id}`);
  };

  if (isLoading) {
    return <div className="mt-6 px-6 text-lg dark:bg-white">Loading...</div>;
  }

  return (
    <>
      <ToastContainer />
      <div className="mt-8">
        <div className="mb-5 mt-0 rounded-md bg-white p-5 shadow-2xl">
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
        </div>
      </div>
    </>
  );
};

export default Facilitators;

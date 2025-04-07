// 'use client';

// import React, { useState } from 'react';

// const facilitatorsData = [
//   { id: 1, name: 'Ram Sharma', number: '9876543210', class: '10th', group: 'A', details: 'Ram teaches Mathematics and Science.' },
//   { id: 2, name: 'Sita Verma', number: '8765432109', class: '12th', group: 'B', details: 'Sita teaches English and History.' },
//   { id: 3, name: 'Mohan Das', number: '7654321098', class: '10th', group: 'C', details: 'Mohan specializes in Physics and Chemistry.' },
// ];

// const Facilitators = () => {
//   const [selectedFacilitator, setSelectedFacilitator] = useState(null);

//   return (
//     <div className="p-2 mt-6 min-h-screen text-gray-900 dark:text-white">
//       <div className="overflow-x-auto flex justify-center">
//         <table className="w-full border border-gray-300 dark:border-gray-700 shadow-xl rounded-lg overflow-hidden">
//           <thead>
//             <tr className="bg-gray-900 dark:bg-gray-900 text-white">
//               <th className="p-3 text-left">Name</th>
//               <th className="p-3 text-left">Number</th>
//               <th className="p-3 text-left">Class</th>
//               <th className="p-3 text-left">Group</th>
//             </tr>
//           </thead>
//           <tbody>
//             {facilitatorsData.map((facilitator, index) => (
//               <tr
//                 key={facilitator.id}
//                 className={`cursor-pointer transition duration-200 ${index % 2 === 0 ? 'bg-gray-200 dark:bg-gray-800' : 'bg-white dark:bg-gray-700'} hover:bg-blue-100 dark:hover:bg-blue-900`}
//                 onClick={() => setSelectedFacilitator(facilitator)}
//               >
//                 <td className="p-3 border-b border-gray-300 dark:border-gray-600">{facilitator.name}</td>
//                 <td className="p-3 border-b border-gray-300 dark:border-gray-600">{facilitator.number}</td>
//                 <td className="p-3 border-b border-gray-300 dark:border-gray-600">{facilitator.class}</td>
//                 <td className="p-3 border-b border-gray-300 dark:border-gray-600">{facilitator.group}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
      
//       {selectedFacilitator && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
//           <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl w-full max-w-lg relative">
//             <button 
//               className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
//               onClick={() => setSelectedFacilitator(null)}
//             >
//               ✕
//             </button>
//             <h3 className="text-xl font-bold mb-2">{selectedFacilitator.name}'s Details</h3>
//             <p><strong>Number:</strong> {selectedFacilitator.number}</p>
//             <p><strong>Class:</strong> {selectedFacilitator.class}</p>
//             <p><strong>Group:</strong> {selectedFacilitator.group}</p>
//             <p><strong>Description:</strong> {selectedFacilitator.details}</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Facilitators;







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
    { accessorKey: 'phone_number', header: 'Phone Number',Cell: ({ row }) => (
                    <a
                      href={`tel:${row.original.phone_number}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center space-x-5 px-6   py-2 rounded-lg bg-indigo-900 text-white hover:bg-indigo-800 transition duration-300 ease-in-out transform hover:scale-105"
                    >
                      <FaPhoneAlt className="text-xl" />
                      <span className="text-sm md:text-base">{row.original.phone_number}</span>
                    </a>
                  ), },
    // { accessorKey: 'role', header: 'Role' },
  ], []);

  const handleFrontlinerClick = (frontliner: Frontliner) => {
    router.push(`/admin/facilitators/${frontliner.user_id}`);
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

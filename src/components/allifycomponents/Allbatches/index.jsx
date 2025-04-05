// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { MdPlaylistAdd } from 'react-icons/md';
// import CreateBatcheModal from './CreateBatcheModal';
// import { getAllBatches, getBatchesByfacilitatorId } from 'services/apiCollection';

// const AllBatches = () => {
//   const router = useRouter();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [batches, setBatches] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null;

//   // Fetch batches based on role
//   const fetchBatches = async () => {
//     try {
//       let data;
//       if (role === 'facilitator') {
//         const facilitatorId = localStorage.getItem('frontlinerId');
//         data = await getBatchesByfacilitatorId(facilitatorId);
//       } else {
//         data = await getAllBatches();
//       }
//       setBatches(data);
//     } catch (error) {
//       console.error('Failed to fetch batches:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBatches();
//   }, []);

//   return (
//     <>
//       <div className="mt-5 p-2">
//         <div className="mb-4 mt-2 flex items-center justify-end">
//           <button
//             onClick={() => setIsModalOpen(true)}
//             className="flex w-full items-center justify-center rounded-full bg-indigo-900 px-4 py-2 text-lg font-medium text-white hover:bg-indigo-800 sm:w-auto"
//           >
//             <MdPlaylistAdd className="text-xl" />
//             <span className="hidden pl-2 sm:block">Create Batch</span>
//           </button>
//         </div>

//         {loading ? (
//           <p className="text-center text-gray-600">Loading batches...</p>
//         ) : batches.length === 0 ? (
//           <p className="text-center text-gray-600">No batches found.</p>
//         ) : (
//           <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {batches.map((batch) => (
//               <div
//                 key={batch.BatchId}
//                 className="cursor-pointer rounded-lg border p-4 shadow-lg transition-all hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
//                 onClick={() => router.push(`/admin/batches/${batch.BatchId}`)}
//               >
//                 <h3 className="text-xl font-semibold">{batch.BatchId}</h3>
//                 <p className="text-gray-600 dark:text-gray-300">
//                   📅 Start Date: {new Date(batch.BatchCreatedDate).toLocaleDateString('en-IN')}
//                 </p>
//                 <p className="text-gray-600 dark:text-gray-300">
//                   🎤 Speaker: {batch.FacilitatorName || 'N/A'}
//                 </p>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       <CreateBatcheModal
//         isOpen={isModalOpen}
//         closeModal={() => setIsModalOpen(false)}
//         onSuccess={fetchBatches}
//       />
//     </>
//   );
// };

// export default AllBatches;



// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { MdPlaylistAdd } from 'react-icons/md';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// import CreateBatcheModal from './CreateBatcheModal';
// import {
//   getAllBatches,
//   getBatchesByfacilitatorId,
//   updateBatchStartStatus,
// } from 'services/apiCollection';

// const AllBatches = () => {
//   const router = useRouter();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [batches, setBatches] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null;

//   const fetchBatches = async () => {
//     try {
//       let data;
//       if (role === 'facilitator') {
//         const facilitatorId = localStorage.getItem('frontlinerId');
//         data = await getBatchesByfacilitatorId(facilitatorId);
//       } else {
//         data = await getAllBatches();
//       }
//       setBatches(data);
//     } catch (error) {
//       console.error('Failed to fetch batches:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBatches();
//   }, []);

//   const handleToggle = async (batchId, currentStatus) => {
//     try {
//       await updateBatchStartStatus(batchId, !currentStatus);
//       toast.success(`Batch ${!currentStatus ? 'started' : 'stopped'} successfully`);

//       //  Local state update for instant UI toggle
//       setBatches((prev) =>
//         prev.map((batch) =>
//           batch.BatchId === batchId
//             ? { ...batch, is_start: !currentStatus ? 1 : 0 }
//             : batch
//         )
//       );
//     } catch (error) {
//       console.error('Toggle failed:', error);
//       toast.error('Failed to update batch status');
//     }
//   };

//   return (
//     <>
//       <div className="mt-5 p-2">
//         <div className="mb-4 mt-2 flex items-center justify-end">
//           <button
//             onClick={() => setIsModalOpen(true)}
//             className="flex w-full items-center justify-center rounded-full bg-indigo-900 px-4 py-2 text-lg font-medium text-white hover:bg-indigo-800 sm:w-auto"
//           >
//             <MdPlaylistAdd className="text-xl" />
//             <span className="hidden pl-2 sm:block">Create Batch</span>
//           </button>
//         </div>

//         {loading ? (
//           <p className="text-center text-gray-600">Loading batches...</p>
//         ) : batches.length === 0 ? (
//           <p className="text-center text-gray-600">No batches found.</p>
//         ) : (
//           <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {batches.map((batch) => (
//               <div
//                 key={batch.BatchId}
//                 className="rounded-lg border p-4 shadow-lg transition-all hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
//               >
//                 <div
//                   onClick={() => router.push(`/admin/batches/${batch.BatchId}`)}
//                   className="cursor-pointer"
//                 >
//                   <h3 className="text-xl font-semibold">Batch ID: {batch.BatchId}</h3>
//                   <p className="text-gray-600 dark:text-gray-300">
//                     📅 Start Date: {new Date(batch.BatchCreatedDate).toLocaleDateString('en-IN')}
//                   </p>
//                   <p className="text-gray-600 dark:text-gray-300">
//                     🎤 Speaker: {batch.FacilitatorName || 'N/A'}
//                   </p>
//                 </div>

//                 {/* Toggle Switch */}
//                 <div className="mt-4 flex items-center justify-between cursor-default">
//                   <span className="text-sm text-gray-600 dark:text-gray-300">Started?</span>
//                   <label className="relative inline-flex cursor-pointer items-center">
//                     <input
//                       type="checkbox"
//                       className="peer sr-only"
//                       checked={batch.is_start === 1}
//                       onChange={(e) => {
//                         e.stopPropagation(); // Prevent card click
//                         handleToggle(batch.BatchId, batch.is_start === 1);
//                       }}
//                     />
//                     <div className="peer h-6 w-11 rounded-full bg-gray-300 peer-checked:bg-green-500 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full"></div>
//                   </label>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       <CreateBatcheModal
//         isOpen={isModalOpen}
//         closeModal={() => setIsModalOpen(false)}
//         onSuccess={fetchBatches}
//       />
//     </>
//   );
// };

// export default AllBatches;




'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MdPlaylistAdd } from 'react-icons/md';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import CreateBatcheModal from './CreateBatcheModal';
import {
  getAllBatches,
  getBatchesByfacilitatorId,
  updateBatchStartStatus,
} from 'services/apiCollection';

const AllBatches = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null;

  const fetchBatches = async () => {
    try {
      let data;
      if (role === 'facilitator') {
        const facilitatorId = localStorage.getItem('frontlinerId');
        data = await getBatchesByfacilitatorId(facilitatorId);
      } else {
        data = await getAllBatches();
      }
      setBatches(data);
    } catch (error) {
      console.error('Failed to fetch batches:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleToggle = async (batchId, currentStatus) => {
    try {
      await updateBatchStartStatus(batchId, !currentStatus);
      toast.success(`Batch ${!currentStatus ? 'started' : 'stopped'} successfully`);

      //  Local state update for instant UI toggle
      setBatches((prev) =>
        prev.map((batch) =>
          batch.BatchId === batchId
            ? { ...batch, is_start: !currentStatus ? 1 : 0 }
            : batch
        )
      );
    } catch (error) {
      console.error('Toggle failed:', error);
      toast.error('Failed to update batch status');
    }
  };

  return (
    <>
      <div className="mt-5 p-2">
        {/* Only show Create Batch button if role is not 'facilitator' */}
        {role !== 'facilitator' && (
          <div className="mb-4 mt-2 flex items-center justify-end">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex w-full items-center justify-center rounded-full bg-indigo-900 px-4 py-2 text-lg font-medium text-white hover:bg-indigo-800 sm:w-auto"
            >
              <MdPlaylistAdd className="text-xl" />
              <span className="hidden pl-2 sm:block">Create Batch</span>
            </button>
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-600">Loading batches...</p>
        ) : batches.length === 0 ? (
          <p className="text-center text-gray-600">No batches found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {batches.map((batch) => (
              <div
                key={batch.BatchId}
                className="rounded-lg border p-4 shadow-lg transition-all hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
              >
                <div
                  onClick={() => router.push(`/admin/batches/${batch.BatchId}`)}
                  className="cursor-pointer"
                >
                  <h3 className="text-xl font-semibold">Batch ID: {batch.BatchId}</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    📅 Start Date: {new Date(batch.BatchCreatedDate).toLocaleDateString('en-IN')}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    🎤 Speaker: {batch.FacilitatorName || 'N/A'}
                  </p>
                </div>

                {/* Toggle Switch (Only for non-facilitator roles) */}
                {role !== 'facilitator' && (
                  <div className="mt-4 flex items-center justify-between cursor-default">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Started?</span>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={batch.is_start === 1}
                        onChange={(e) => {
                          e.stopPropagation(); // Prevent card click
                          handleToggle(batch.BatchId, batch.is_start === 1);
                        }}
                      />
                      <div className="peer h-6 w-11 rounded-full bg-gray-300 peer-checked:bg-green-500 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full"></div>
                    </label>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <CreateBatcheModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        onSuccess={fetchBatches}
      />
    </>
  );
};

export default AllBatches;

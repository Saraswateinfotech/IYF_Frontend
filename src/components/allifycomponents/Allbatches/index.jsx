'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MdPlaylistAdd } from 'react-icons/md';
import CreateBatcheModal from './CreateBatcheModal';

const AllBatches = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const batches = [
    {
      id: 1,
      name: 'DYS-1',
      startDate: '12/01/2025',
      Speaker: 'HG Hari Bhakti Prabhuji',
    },
    {
      id: 2,
      name: 'DYS-2',
      startDate: '12/02/2025',
      Speaker: 'HG Hari Bhakti Prabhuji',
    },
    {
      id: 3,
      name: 'DYS-3',
      startDate: '12/01/2025',
      Speaker: 'HG Hari Bhakti Prabhuji',
    },
    {
      id: 4,
      name: 'DYS-4',
      startDate: '12/01/2025',
      Speaker: 'HG Hari Bhakti Prabhuji',
    },
    {
      id: 5,
      name: 'DYS-5',
      startDate: '12/03/2025',
      Speaker: 'HG Hari Bhakti Prabhuji',
    },
    {
      id: 6,
      name: 'DYS-6',
      startDate: '12/01/2025',
      Speaker: 'HG Hari Bhakti Prabhuji',
    },
    {
      id: 7,
      name: 'DYS-7',
      startDate: '12/01/2025',
      Speaker: 'HG Hari Bhakti Prabhuji',
    },
    {
      id: 8,
      name: 'Nachiketa',
      startDate: '12/04/2025',
      Speaker: 'HG Mohan Murari Prabhuji',
    },
    {
      id: 9,
      name: 'Sahdev',
      startDate: '12/01/2025',
      Speaker: 'HG Hari Bhakti Prabhuji',
    },
    {
      id: 10,
      name: 'Nakul',
      startDate: '12/09/2025',
      Speaker: 'HG Hari Bhakti Prabhuji',
    },
  ];

  return (
    <>
      <div className="mt-5 p-2">
        <div className=" mb-4 mt-2 flex items-center justify-end rounded-full  text-navy-700 dark:bg-navy-900 dark:text-white ">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex w-full items-center justify-center rounded-full bg-indigo-900 px-4 py-2 text-lg font-medium text-white hover:bg-indigo-800 sm:w-auto"
          >
            <MdPlaylistAdd className="text-xl" />
            <span className="hidden pl-2 sm:block">create Batche</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {batches.map((batch) => (
            <div
              key={batch.id}
              className="cursor-pointer rounded-lg border p-4 shadow-lg transition-all hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
              onClick={() => router.push(`/admin/batches/${batch.name}`)}
            >
              <h3 className="text-xl font-semibold">{batch.name}</h3>
              <p className="text-gray-600 dark:text-gray-300">
                📅 Start Date: {batch.startDate}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                🎤 Speaker: {batch.Speaker}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Component */}
      <CreateBatcheModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default AllBatches;

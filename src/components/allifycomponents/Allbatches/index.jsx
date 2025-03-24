

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const AllBatches = () => {
  const router = useRouter();

  const batches = [
    { id: 1, name: 'DYS-1', startDate: "12/01/2025", Speaker: "HG Hari Bhakti Prabhuji" },
    { id: 2, name: 'DYS-2', startDate: "12/02/2025", Speaker: "HG Hari Bhakti Prabhuji" },
    { id: 3, name: 'DYS-3', startDate: "12/01/2025", Speaker: "HG Hari Bhakti Prabhuji" },
    { id: 4, name: 'DYS-4', startDate: "12/01/2025", Speaker: "HG Hari Bhakti Prabhuji" },
    { id: 5, name: 'DYS-5', startDate: "12/03/2025", Speaker: "HG Hari Bhakti Prabhuji" },
    { id: 6, name: 'DYS-6', startDate: "12/01/2025", Speaker: "HG Hari Bhakti Prabhuji" },
    { id: 7, name: 'DYS-7', startDate: "12/01/2025", Speaker: "HG Hari Bhakti Prabhuji" },
    { id: 8, name: 'Nachiketa', startDate: "12/04/2025", Speaker: "HG Mohan Murari Prabhuji" },
    { id: 9, name: 'Sahdev', startDate: "12/01/2025", Speaker: "HG Hari Bhakti Prabhuji" },
    { id: 10, name: 'Nakul', startDate: "12/09/2025", Speaker: "HG Hari Bhakti Prabhuji" },
  ];

  return (
    <div className="p-2 mt-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {batches.map((batch) => (
          <div
            key={batch.id}
            className="p-4 border rounded-lg shadow-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 dark:border-gray-600 dark:bg-gray-900 dark:text-white transition-all"
            onClick={() => router.push(`/admin/batches/${batch.name}`)}
          >
            <h3 className="text-xl font-semibold">{batch.name}</h3>
            <p className="text-gray-600 dark:text-gray-300">📅 Start Date: {batch.startDate}</p>
            <p className="text-gray-600 dark:text-gray-300">🎤 Speaker: {batch.Speaker}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllBatches;

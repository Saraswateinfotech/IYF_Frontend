// 'use client';

// import { useEffect, useState } from 'react';
// import { getGroupUserCount } from 'services/apiCollection';
// import { Users } from 'lucide-react';
// import FacilitatorUserReport from './FacilitatorUserReport';

// type Student = {
//   user_id: number;
//   name: string;
//   chanting_round: string;
//   action: string;
//   mobile_number: string;
// };

// const groupList = [
//   'DYS',
//   'Jagganath',
//   'Nachiketa',
//   'Shadev',
//   'Nakul',
//   'Arjun',
//   'GourangSabha',
//   'Bhima',
// ];

// const darkColors = [
//   'bg-blue-700',
//   'bg-green-700',
//   'bg-yellow-600',
//   'bg-purple-700',
//   'bg-pink-700',
//   'bg-indigo-700',
//   'bg-orange-700',
//   'bg-teal-700',
// ];

// const FacilitatorDas = () => {
//   const facilitatorId =
//     typeof window !== 'undefined' ? localStorage.getItem('frontlinerId') : null;

//   const [groupData, setGroupData] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     async function fetchData() {
//       if (!facilitatorId) return;
//       setIsLoading(true);
//       try {
//         const rawData = await getGroupUserCount(facilitatorId);
//         const formatted = groupList.map((group, index) => {
//           const match = rawData.find((d: any) => d.group_name === group);
//           return {
//             group_name: group,
//             total_users: match ? match.total_users : 0,
//             color: darkColors[index % darkColors.length],
//           };
//         });
//         setGroupData(formatted);
//       } catch (err) {
//         console.error('Failed to fetch group count', err);
//       } finally {
//         setIsLoading(false);
//       }
//     }
//     fetchData();
//   }, [facilitatorId]);

//   return (
//     <div className="mt-10">
//       <div className="mx-auto max-w-7xl">
//       <h2 className="mb-5 text-lg font-bold dark:text-white">
//       Your Group Student Count</h2>
//         <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//           {isLoading
//             ? Array.from({ length: 4 }).map((_, idx) => (
//                 <div
//                   key={idx}
//                   className="animate-pulse rounded-xl bg-gray-300 p-6 h-32"
//                 />
//               ))
//             : groupData
//                 .filter((group) => group.total_users > 0)
//                 .map((group, idx) => (
//                   <div
//                     key={idx}
//                     className={`rounded-xl p-4 text-white shadow-2xl transition-transform duration-300 hover:scale-105 ${group.color}`}
//                   >
//                     <div className="flex items-center justify-between">
//                       <h2 className="text-xl font-semibold">{group.group_name}</h2>
//                       <Users className="h-6 w-6" />
//                     </div>
//                     <p className="mt-2 text-4xl font-bold">{group.total_users}</p>
//                   </div>
//                 ))}
//         </div>
//       </div>
//       {!isLoading && <FacilitatorUserReport groupData={groupData.filter(g => g.total_users > 0)} />}
//       </div>
//   );
// };

// export default FacilitatorDas;



"use client";

import { useEffect, useState } from 'react';
import { getGroupUserCount } from 'services/apiCollection';
import { Users } from 'lucide-react';
import FacilitatorUserReport from './FacilitatorUserReport';
import BoxModale from './BoxModale';

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

const darkColors = [
  'bg-blue-700',
  'bg-green-700',
  'bg-yellow-600',
  'bg-purple-700',
  'bg-pink-700',
  'bg-indigo-700',
  'bg-orange-700',
  'bg-teal-700',
];

const FacilitatorDas = () => {
  const facilitatorId =
    typeof window !== 'undefined' ? localStorage.getItem('frontlinerId') : null;

  const [groupData, setGroupData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalData, setModalData] = useState<{ title: string; count: number; facilitatorIds:any } | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!facilitatorId) return;
      setIsLoading(true);
      try {
        const rawData = await getGroupUserCount(facilitatorId);
        const formatted = groupList.map((group, index) => {
          const match = rawData.find((d: any) => d.group_name === group);
          return {
            group_name: group,
            total_users: match ? match.total_users : 0,
            color: darkColors[index % darkColors.length],
          };
        });
        setGroupData(formatted);
      } catch (err) {
        console.error('Failed to fetch group count', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [facilitatorId]);

  const openModal = (groupName: string, userCount: number) => {
    setModalData({ title: groupName, count: userCount, facilitatorIds:facilitatorId });
  };

  const closeModal = () => {
    setModalData(null);
  };

  return (
    <div className="mt-10">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-5 text-lg font-bold dark:text-white">
          Your Group Student Count
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="animate-pulse rounded-xl bg-gray-300 p-6 h-32" />
              ))
            : groupData
                .filter((group) => group.total_users > 0)
                .map((group, idx) => (
                  <div
                    key={idx}
                    className={`rounded-xl p-4 text-white shadow-2xl transition-transform duration-300 hover:scale-105 cursor-pointer ${group.color}`}
                    onClick={() => openModal(group.group_name, group.total_users)}
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">{group.group_name}</h2>
                      <Users className="h-6 w-6" />
                    </div>
                    <p className="mt-2 text-4xl font-bold">{group.total_users}</p>
                  </div>
                ))}
        </div>
      </div>
      {!isLoading && <FacilitatorUserReport groupData={groupData.filter(g => g.total_users > 0)} />}
      <BoxModale isOpen={!!modalData} onClose={closeModal} title={modalData?.title || ''} facilitatorIds={facilitatorId}>
        <p></p>
      </BoxModale>
    </div>
  );
};

export default FacilitatorDas;

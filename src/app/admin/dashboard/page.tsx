// 'use client';
// // import WeeklyRevenue from 'components/admin/default/WeeklyRevenue';
// // import TotalSpent from 'components/admin/default/TotalSpent';
// import { IoMdHome } from 'react-icons/io';
// import { IoDocuments } from 'react-icons/io5';
// import { MdBarChart, MdDashboard } from 'react-icons/md';
// import Widget from 'components/widget/Widget';
// import CallingSystem from 'components/allifycomponet/callingSystem';

// const facilitators = [
//   { id: 1, name: "John Doe", country: "US" },
//   { id: 2, name: "Jane Smith", country: "UK" },
//   { id: 3, name: "Alice Brown", country: "CA" },
//   { id: 4, name: "Robert Johnson", country: "AU" },
// ];


// const Dashboard = () => {
//   return (
//     <div>
// <nav className="sticky top-4 z-10 mt-5 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#0b14374d]">
//   <div className=''>
//     <form className="max-w-sm mx-auto flex items-center space-x-2">
//       <select
//         id="countries"
//         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
//                    focus:ring-blue-500 focus:border-blue-500 block 
//                    w-full md:w-80 lg:w-[500px] p-2
//                    dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
//                    dark:focus:ring-blue-500 dark:focus:border-blue-500"
//       >
//         <option selected>Facilitator</option>
//         {facilitators.map((facilitator) => (
//           <option key={facilitator.id} value={facilitator.country}>
//             {facilitator.name} ({facilitator.country})
//           </option>
//         ))}
//       </select>
      
//       <button 
//         type="button" 
//         className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
//       >
//         Show
//       </button>
//     </form>
//   </div>
// </nav>
//       {/* Card widget */}
//       <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
//         <Widget
//           icon={<MdBarChart className="h-7 w-7" />}
//           title={'Total Amount'}
//           subtitle={'Rs 340.5'}
//         />
//         <Widget
//           icon={<IoDocuments className="h-6 w-6" />}
//           title={'Pending Amount'}
//           subtitle={'Rs 642.39'}
//         />
//         <Widget
//           icon={<MdBarChart className="h-7 w-7" />}
//           title={'Total Register'}
//           subtitle={'1574'}
//         />
//         {/* <Widget
//           icon={<MdDashboard className="h-6 w-6" />}
//           title={'Data List Report'}
//           subtitle={'1,000'}
//         /> */}
//         <Widget
//           icon={<MdBarChart className="h-7 w-7" />}
//           title={'Weekly Totel Registered'}
//           subtitle={'145'}
//         />
//         <Widget
//           icon={<IoMdHome className="h-6 w-6" />}
//           title={'Total Students'}
//           subtitle={'2433'}
//         />
//       </div>

//       {/* Charts */}

//       <div className="mt-5">
//         {/* <TotalSpent />
//         <WeeklyRevenue /> */}
//         <h2 className="text-lg font-bold mb-3 dark:text-white">Calling System</h2>
//         <CallingSystem/>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;




'use client';
import { useState, useEffect } from 'react';
import { IoMdHome } from 'react-icons/io';
import { IoDocuments } from 'react-icons/io5';
import { MdBarChart } from 'react-icons/md';
import Widget from 'components/widget/Widget';
import CallingSystem from 'components/allifycomponents/callingSystem';

const facilitators = [
  { id: 0, name: "All", stats: { total: "Rs 2000", pending: "Rs 1262.39", register: "5574", weekly: "615", students: "9333" } },
  { id: 1, name: "John Doe", stats: { total: "Rs 500.5", pending: "Rs 200", register: "1200", weekly: "90", students: "2200" } },
  { id: 2, name: "Jane Smith", stats: { total: "Rs 340.5", pending: "Rs 642.39", register: "1574", weekly: "145", students: "2433" } },
  { id: 3, name: "Alice Brown", stats: { total: "Rs 700.0", pending: "Rs 300", register: "1800", weekly: "200", students: "2600" } },
  { id: 4, name: "Robert Johnson", stats: { total: "Rs 450.2", pending: "Rs 120", register: "1000", weekly: "80", students: "2100" } },
];

const Dashboard = () => {
  const [selectedFacilitator, setSelectedFacilitator] = useState(facilitators[0]); // Default "All"

  useEffect(() => {
    // API कॉल के लिए जगह छोड़ी गई है
  }, [selectedFacilitator]);

  return (
    <div>
      <nav className="sticky top-4 z-10 mt-5 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#0b14374d]">
        <div>
          <form className="max-w-sm mx-auto flex items-center space-x-2">
            <select
              id="facilitators"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                         focus:ring-blue-500 focus:border-blue-500 block 
                         w-full md:w-80 lg:w-[500px] p-2
                         dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
                         dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={(e) => {
                const selected = facilitators.find(fac => fac.id === Number(e.target.value));
                setSelectedFacilitator(selected);
              }}
            >
              {facilitators.map((facilitator) => (
                <option key={facilitator.id} value={facilitator.id}>
                  {facilitator.name}
                </option>
              ))}
            </select>

            <button 
              type="button" 
              className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Show
            </button>
          </form>
        </div>
      </nav>

      {/* Card widget */}
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        <Widget icon={<MdBarChart className="h-7 w-7" />} title={'Total Amount'} subtitle={selectedFacilitator.stats.total} />
        <Widget icon={<IoDocuments className="h-6 w-6" />} title={'Pending Amount'} subtitle={selectedFacilitator.stats.pending} />
        <Widget icon={<MdBarChart className="h-7 w-7" />} title={'Total Register'} subtitle={selectedFacilitator.stats.register} />
        <Widget icon={<MdBarChart className="h-7 w-7" />} title={'Weekly Total Registered'} subtitle={selectedFacilitator.stats.weekly} />
        <Widget icon={<IoMdHome className="h-6 w-6" />} title={'Total Students'} subtitle={selectedFacilitator.stats.students} />
      </div>

      {/* Charts */}
      <div className="mt-5">
        <div className='flex justify-between'>


        <h2 className="text-lg font-bold mb-3 dark:text-white">Calling System</h2>
      <label className="inline-flex items-center cursor-pointer">
  <input type="checkbox" value="" className="sr-only peer"/>
  <div className="relative w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
</label>
        </div>
        <CallingSystem />
      </div>
    </div>
  );
};

export default Dashboard;

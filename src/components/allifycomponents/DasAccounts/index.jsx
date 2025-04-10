// 'use client';
// import React, { useState, useEffect } from 'react';
// import { IoPersonAddSharp } from 'react-icons/io5';
// import { FaCopy, FaTrash } from 'react-icons/fa';
// import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
// import AccountModal from './AccountModal';
// import {
//   deleteDashboardAccount,
//   fetchDashboardAccounts,
// } from 'services/apiCollection';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const DasAccounts = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [showPassword, setShowPassword] = useState({});
//   const [accounts, setAccounts] = useState([]);
//   const [isLoading, setIsLoading] = useState(true); // loading state

//   const role = localStorage.getItem('role');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true); // Start loading
//         const data = await fetchDashboardAccounts();
//         setAccounts(data);
//       } catch (err) {
//         console.error('Error fetching accounts:', err);
//         toast.error('Failed to load accounts. Please try again.');
//       } finally {
//         setIsLoading(false); // End loading
//       }
//     };

//     fetchData();
//   }, []);

//   const fetchAccounts = async () => {
//     try {
//       setIsLoading(true);
//       const data = await fetchDashboardAccounts();
//       setAccounts(data);
//     } catch (err) {
//       console.error('Error fetching accounts:', err);
//       toast.error('Failed to fetch accounts');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const togglePasswordVisibility = (index) => {
//     setShowPassword((prevState) => ({
//       ...prevState,
//       [index]: !prevState[index],
//     }));
//   };

//   const copyToClipboard = (text) => {
//     navigator.clipboard.writeText(text);
//     toast.success('Copied to clipboard!');
//   };

//   const handleDelete = async (user_id) => {
//     if (!confirm('Are you sure you want to delete this account?')) return;

//     try {
//       await deleteDashboardAccount(user_id);
//       setAccounts(accounts.filter((account) => account.user_id !== user_id));
//       toast.success('Account deleted successfully!');
//     } catch (error) {
//       console.error('Error deleting account:', error);
//       toast.error('Failed to delete account. Please try again.');
//     }
//   };

//   return (
//     <>
//       <ToastContainer position="top-right" reverseOrder={false} />
//       {role === 'frontliner' ? (
//         <> your not allow </>
//       ) : (
//         <div className="mt-8">
//           <div className="mb-4 flex items-center justify-end">
//             <button
//               onClick={() => setIsModalOpen(true)}
//               className="flex transform items-center rounded-lg bg-blue-900 px-5 py-2 text-white shadow-lg transition-transform hover:scale-105"
//             >
//               <IoPersonAddSharp size={20} />
//               <span className="ml-2 text-lg">Create Account</span>
//             </button>
//           </div>

//           {isLoading ? (
//             <div className="flex justify-center py-10 text-lg text-gray-600 dark:text-gray-300">
//               Loading accounts...
//             </div>
//           ) : (
//             <div className="overflow-x-auto rounded-lg bg-white shadow-lg dark:bg-gray-900 dark:text-white">
//               <table className="w-full p-14 border-collapse text-left">
//                 <thead className="bg-blue-900 text-gray-100">
//                   <tr>
//                     <th className="p-4">Name</th>
//                     <th className="p-4">Number</th>
//                     <th className="p-4">Role</th>
//                     <th className="p-4">Dashboard ID/Password</th>
//                     <th className="p-4 text-center">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {accounts.length > 0 ? (
//                     accounts.map((account, index) => (
//                       <tr
//                         key={account.user_id}
//                         className="border-t transition hover:bg-gray-50 dark:hover:bg-gray-700"
//                       >
//                         <td className="p-4">{account.name}</td>
//                         <td className="p-4">{account.phone_number}</td>
//                         <td className="p-4">{account.role}</td>
//                         <td className="flex items-center gap-2 p-3">
//                           <span className="px-2 py-1">{account.user_id}</span>
//                           <button
//                             onClick={() => copyToClipboard(account.user_id)}
//                             className="text-blue-500 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
//                           >
//                             <FaCopy size={14} />
//                           </button>
//                         </td>
//                         <td className="flex items-center gap-2 p-3">
//                           {showPassword[index] ? (
//                             <span className="rounded bg-gray-100 px-2 py-1 font-mono dark:bg-gray-600">
//                               {account.textpassword}
//                             </span>
//                           ) : (
//                             <span className="font-mono text-gray-500 dark:text-gray-400">
//                               ••••••••
//                             </span>
//                           )}
//                           <button
//                             onClick={() => togglePasswordVisibility(index)}
//                             className="text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
//                           >
//                             {showPassword[index] ? (
//                               <AiFillEyeInvisible size={18} />
//                             ) : (
//                               <AiFillEye size={18} />
//                             )}
//                           </button>
//                           <button
//                             onClick={() => copyToClipboard(account.textpassword)}
//                             className="text-blue-500 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
//                           >
//                             <FaCopy size={14} />
//                           </button>
//                         </td>
//                         <td className="p-4 text-center">
//                           <button
//                             onClick={() => handleDelete(account.user_id)}
//                             className="text-red-700 transition hover:text-red-900 dark:text-red-800 dark:hover:text-red-900"
//                           >
//                             <FaTrash size={16} />
//                           </button>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td
//                         colSpan="6"
//                         className="p-6 text-center text-gray-500 dark:text-gray-400"
//                       >
//                         No accounts found.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}

//           <AccountModal
//             isOpen={isModalOpen}
//             closeModal={() => setIsModalOpen(false)}
//             fetchAccounts={fetchAccounts}  // Pass the fetchAccounts function to refresh the account list
//           />
//         </div>
//       )}
//     </>
//   );
// };

// export default DasAccounts;







'use client';

import React, { useState, useEffect } from 'react';
import { IoPersonAddSharp } from 'react-icons/io5';
import { FaCopy, FaPhoneAlt, FaTrash } from 'react-icons/fa';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import AccountModal from './AccountModal';
import {
  deleteDashboardAccount,
  fetchDashboardAccounts,
} from 'services/apiCollection';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DasAccounts = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState({});
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const rawRole = typeof window !== 'undefined' ? localStorage.getItem('role') : '';
  const role = rawRole?.toLowerCase().trim();
  const isAllowed = role === 'admin' || role === 'coordinator';

  useEffect(() => {
    if (!isAllowed) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchDashboardAccounts();

        // ✅ Apply filtering based on role
        let filtered = data;
        if (role === 'admin') {
          filtered = data.filter((acc) => acc.role === 'facilitator');
        } else if (role === 'coordinator') {
          filtered = data.filter((acc) => acc.role === 'frontliner');
        }

        setAccounts(filtered);
      } catch (err) {
        console.error('Error fetching accounts:', err);
        toast.error('Failed to load accounts. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAllowed, role]);

  const fetchAccounts = async () => {
    if (!isAllowed) return;

    try {
      setIsLoading(true);
      const data = await fetchDashboardAccounts();

      // ✅ Apply filtering again here
      let filtered = data;
      if (role === 'admin') {
        filtered = data.filter((acc) => acc.role === 'facilitator');
      } else if (role === 'coordinator') {
        filtered = data.filter((acc) => acc.role === 'frontliner');
      }

      setAccounts(filtered);
    } catch (err) {
      console.error('Error fetching accounts:', err);
      toast.error('Failed to fetch accounts');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (index) => {
    setShowPassword((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const handleDelete = async (user_id) => {
    if (!confirm('Are you sure you want to delete this account?')) return;

    try {
      await deleteDashboardAccount(user_id);
      setAccounts((prev) => prev.filter((account) => account.user_id !== user_id));
      toast.success('Account deleted successfully!');
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account. Please try again.');
    }
  };

  return (
    <>
      <ToastContainer position="top-right" reverseOrder={false} />
      {!isAllowed ? (
        <div className="mt-10 text-center text-lg text-red-600">
          You are not allowed to access this page.
        </div>
      ) : (
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-end">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex transform items-center rounded-lg bg-blue-900 px-5 py-2 text-white shadow-lg transition-transform hover:scale-105"
            >
              <IoPersonAddSharp size={20} />
              <span className="ml-2 text-lg">Create Account</span>
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-10 text-lg text-gray-600 dark:text-gray-300">
              Loading accounts...
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg bg-white shadow-lg dark:bg-gray-900 dark:text-white">
              <table className="w-full p-14 border-collapse text-left">
                <thead className="bg-blue-900 text-gray-100">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Number</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Dashboard ID/Password</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.length > 0 ? (
                    accounts.map((account, index) => (
                      <tr
                        key={account.user_id}
                        className="border-t transition hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="p-4">{account.name}</td>
                        <td className="p-4">
                        <a
          href={`tel:${account.mobile_number}`}
          className="flex items-center space-x-4 px-4 py-2 rounded-lg bg-indigo-900 text-white hover:bg-indigo-800 transition duration-300 ease-in-out transform hover:scale-105"
        >
          <FaPhoneAlt className="text-xl" />
          <span className="text-sm md:text-base">{account.phone_number}</span>
        </a>
                        </td>
                        <td className="p-4">{account.role}</td>
                        <td className="flex items-center gap-2 p-3">
                          <span className="px-2 py-1">{account.user_id}</span>
                          <button
                            onClick={() => copyToClipboard(account.user_id)}
                            className="text-blue-500 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <FaCopy size={14} />
                          </button>
                        </td>
                        <td className="flex items-center gap-2 p-3">
                          {showPassword[index] ? (
                            <span className="rounded bg-gray-100 px-2 py-1 font-mono dark:bg-gray-600">
                              {account.textpassword}
                            </span>
                          ) : (
                            <span className="font-mono text-gray-500 dark:text-gray-400">
                              ••••••••
                            </span>
                          )}
                          <button
                            onClick={() => togglePasswordVisibility(index)}
                            className="text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                          >
                            {showPassword[index] ? (
                              <AiFillEyeInvisible size={18} />
                            ) : (
                              <AiFillEye size={18} />
                            )}
                          </button>
                          <button
                            onClick={() => copyToClipboard(account.textpassword)}
                            className="text-blue-500 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <FaCopy size={14} />
                          </button>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleDelete(account.user_id)}
                            className="text-red-700 transition hover:text-red-900 dark:text-red-800 dark:hover:text-red-900"
                          >
                            <FaTrash size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="p-6 text-center text-gray-500 dark:text-gray-400"
                      >
                        No accounts found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          <AccountModal
            isOpen={isModalOpen}
            closeModal={() => setIsModalOpen(false)}
            fetchAccounts={fetchAccounts}
          />
        </div>
      )}
    </>
  );
};

export default DasAccounts;

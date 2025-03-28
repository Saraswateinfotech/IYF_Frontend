// 'use client';

// import { useState } from 'react';
// import Default from 'components/auth/variants/DefaultAuthLayout';
// import { useRouter } from 'next/navigation';
// import { loginUser } from 'services/authService';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// function SignInDefault() {
//   const [userId, setUserId] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const data = await loginUser(userId, password);
      
//       if (data?.token) {
//         localStorage.setItem('token', data.token); 
//         toast.success('Login successful! Redirecting...');
//         router.push('/admin/dashboard'); 
//       } else {
//         throw new Error('Invalid login response'); 
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <ToastContainer position="top-right" />
//       <Default
//         maincard={
//           <div className="mb-16 mt-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
//             <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
//               <h3 className="mb-4 text-4xl font-bold text-navy-700 dark:text-white text-center">
//                 Sign In
//               </h3>

//               <form onSubmit={handleLogin}>
//                 {/* Email */}
//                 <div className="w-full mb-4">
//                   <label htmlFor="text" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
//                     User Id*
//                   </label>
//                   <input
//                     id="text"
//                     type="text"
//                     value={userId}
//                     onChange={(e) => setUserId(e.target.value)}
//                     required
//                     placeholder="*******"
//                     className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
//                   />
//                 </div>

//                 {/* Password */}
//                 <div className="w-full mb-4">
//                   <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
//                     Password*
//                   </label>
//                   <input
//                     id="password"
//                     type="password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                     placeholder="Min. 8 characters"
//                     className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
//                   />
//                 </div>

//                 {/* Sign In Button */}
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className={`w-full py-3 text-base font-medium text-white bg-blue-600 rounded-lg transition 
//                     hover:bg-blue-700 active:bg-blue-800 focus:ring-4 focus:ring-blue-300 
//                     dark:bg-blue-500 dark:hover:bg-blue-400 dark:active:bg-blue-600 dark:focus:ring-blue-400 
//                     ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
//                 >
//                   {loading ? 'Signing In...' : 'Sign In'}
//                 </button>
//               </form>
//             </div>
//           </div>
//         }
//       />
//     </>
//   );
// }

// export default SignInDefault;



'use client';

import { useState } from 'react';
import Default from 'components/auth/variants/DefaultAuthLayout';
import { useRouter } from 'next/navigation';
import { loginUser } from 'services/authService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SignInDefault() {
  const [formData, setFormData] = useState({ userId: '', password: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { userId, password } = formData;
      const data = await loginUser(userId, password);

      if (data?.token) {
        localStorage.setItem('token', data.token);
        toast.success('Login successful! Redirecting...');
        router.push('/admin/dashboard');
      } else {
        throw new Error('Invalid login response');
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.error ||
        (err.response?.status === 400 ? 'Invalid User ID or Password' : 'Something went wrong!');
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" />
      <Default
        maincard={
          <div className="mb-16 mt-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
            <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
              <h3 className="mb-4 text-4xl font-bold text-navy-700 dark:text-white text-center">Sign In</h3>

              <form onSubmit={handleLogin}>
                {/* User ID */}
                <div className="w-full mb-4">
                  <label htmlFor="userId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    User Id*
                  </label>
                  <input
                    id="userId"
                    name="userId"
                    type="text"
                    value={formData.userId}
                    onChange={handleChange}
                    required
                    placeholder="Like .HH00000"
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 
                    focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 
                    dark:focus:border-blue-400"
                  />
                </div>

                {/* Password */}
                <div className="w-full mb-4">
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Password*
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="*******"
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 
                    focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 
                    dark:focus:border-blue-400"
                  />
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 text-base font-medium text-white bg-blue-600 rounded-lg transition 
                    hover:bg-blue-700 active:bg-blue-800 focus:ring-4 focus:ring-blue-300 
                    dark:bg-blue-500 dark:hover:bg-blue-400 dark:active:bg-blue-600 dark:focus:ring-blue-400 
                    ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>
            </div>
          </div>
        }
      />
    </>
  );
}

export default SignInDefault;

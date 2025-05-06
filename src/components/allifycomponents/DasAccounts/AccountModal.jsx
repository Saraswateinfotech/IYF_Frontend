




// 'use client';

// import React, { useState, useEffect } from "react";
// import { X } from "lucide-react";
// import { createDashboardAccount } from "services/authService";
// import { toast } from "react-toastify";

// const AccountModal = ({ isOpen, closeModal, fetchAccounts }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     phone_number: "",
//     email: "",
//     password: "",
//   });

//   const [role, setRole] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (isOpen) {
//       const storedRole = localStorage.getItem("role")?.toLowerCase().trim();
//       if (storedRole === "admin") setRole("facilitator");
//       else if (storedRole === "coordinator") setRole("frontliner");
//       else setRole("");
//     }
//   }, [isOpen]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     // Phone validation: allow only 10 digits
//     if (name === "phone_number" && !/^\d{0,10}$/.test(value)) return;

//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     if (formData.phone_number.length !== 10) {
//       toast.error("Phone number must be exactly 10 digits");
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await createDashboardAccount(
//         formData.name,
//         formData.phone_number,
//         formData.email,
//         formData.password,
//         role
//       );

//       toast.success(response.message || "Account created successfully!");
//       fetchAccounts();
//       setTimeout(() => closeModal(), 1000);
//     } catch (err) {
//       // const errorMessage =
//       //   err?.response?.data?.error || err?.message;
//       toast.error(err.error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!isOpen || !role) return null;

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-md z-50 p-4">
//       <div className="bg-white p-6 rounded-lg w-full max-w-xl shadow-lg relative">
//         <button onClick={closeModal} className="absolute top-3 right-3 text-gray-700">
//           <X size={20} />
//         </button>

//         <div className="w-full max-w-xl bg-white p-6 rounded-lg shadow-md">
//           <h2 className="text-2xl font-bold text-center mb-4">Create Dashboard Account</h2>
//           {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-3">{error}</div>}
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <input
//               type="text"
//               name="name"
//               placeholder="Name"
//               required
//               onChange={handleChange}
//               className="w-full p-2 border rounded"
//             />
//             <input
//               type="text"
//               name="phone_number"
//               placeholder="Phone Number"
//               required
//               onChange={handleChange}
//               value={formData.phone_number}
//               className="w-full p-2 border rounded"
//             />
//             <input
//               type="email"
//               name="email"
//               placeholder="Email"
//               required
//               onChange={handleChange}
//               className="w-full p-2 border rounded"
//             />
//             <input
//               type="password"
//               name="password"
//               placeholder="Password"
//               required
//               onChange={handleChange}
//               className="w-full p-2 border rounded"
//             />
//             <input
//               type="text"
//               value={role}
//               readOnly
//               className="w-full p-2 border rounded bg-gray-100 text-gray-600"
//             />
//             <button
//               type="submit"
//               className="w-full bg-blue-900 text-white p-2 rounded hover:bg-blue-600"
//               disabled={loading}
//             >
//               {loading ? "Signing Up..." : "Sign Up"}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AccountModal;




// 'use client';

// import React, { useState, useEffect } from "react";
// import { X } from "lucide-react";
// import { createDashboardAccount } from "services/authService";
// import { toast } from "react-toastify";

// const AccountModal = ({ isOpen, closeModal, fetchAccounts }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     phone_number: "",
//     email: "",
//     password: "",
//   });

//   const [role, setRole] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (isOpen) {
//       const storedRole = localStorage.getItem("role")?.toLowerCase().trim();
//       if (storedRole === "admin") setRole("facilitator");
//       else if (storedRole === "coordinator") setRole("frontliner");
//       else setRole("");
//     }
//   }, [isOpen]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name === "phone_number" && !/^\d{0,10}$/.test(value)) return;

//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (formData.phone_number.length !== 10) {
//       toast.error("Phone number must be exactly 10 digits");
//       setLoading(false);
//       return;
//     }

//     if (!emailRegex.test(formData.email)) {
//       toast.error("Please enter a valid email address");
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await createDashboardAccount(
//         formData.name,
//         formData.phone_number,
//         formData.email,
//         formData.password,
//         role
//       );

//       toast.success(response.message || "Account created successfully!");
//       fetchAccounts();
//       setTimeout(() => closeModal(), 1000);
//     } catch (err) {
//       toast.error(err.error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!isOpen || !role) return null;

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-md z-50 p-4">
//       <div className="bg-white p-6 rounded-lg w-full max-w-xl shadow-lg relative">
//         <button onClick={closeModal} className="absolute top-3 right-3 text-gray-700">
//           <X size={20} />
//         </button>

//         <div className="w-full max-w-xl bg-white p-6 rounded-lg shadow-md">
//           <h2 className="text-2xl font-bold text-center mb-4">Create Dashboard Account</h2>
//           {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-3">{error}</div>}
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <input
//               type="text"
//               name="name"
//               placeholder="Name"
//               required
//               onChange={handleChange}
//               className="w-full p-2 border rounded"
//             />
//             <input
//               type="text"
//               name="phone_number"
//               placeholder="Phone Number"
//               required
//               onChange={handleChange}
//               value={formData.phone_number}
//               className="w-full p-2 border rounded"
//             />
//             <input
//               type="email"
//               name="email"
//               placeholder="Email"
//               required
//               onChange={handleChange}
//               value={formData.email}
//               className="w-full p-2 border rounded"
//             />
//             <input
//               type="password"
//               name="password"
//               placeholder="Password"
//               required
//               onChange={handleChange}
//               className="w-full p-2 border rounded"
//             />
//             <input
//               type="text"
//               value={role}
//               readOnly
//               className="w-full p-2 border rounded bg-gray-100 text-gray-600"
//             />
//             <button
//               type="submit"
//               className="w-full bg-blue-900 text-white p-2 rounded hover:bg-blue-600"
//               disabled={loading}
//             >
//               {loading ? "Signing Up..." : "Sign Up"}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AccountModal;





// 'use client';

// import React, { useState, useEffect } from "react";
// import { X } from "lucide-react";
// import { createDashboardAccount } from "services/authService";
// import { toast } from "react-toastify";

// const AccountModal = ({ isOpen, closeModal, fetchAccounts }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     phone_number: "",
//     email: "",
//     password: "",
//   });

//   const [role, setRole] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (isOpen) {
//       const storedRole = localStorage.getItem("role")?.toLowerCase().trim();
//       if (storedRole === "admin") setRole("facilitator"); // default selection
//       else if (storedRole === "coordinator") setRole("frontliner");
//       else setRole("");
//     }
//   }, [isOpen]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name === "phone_number" && !/^\d{0,10}$/.test(value)) return;

//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (formData.phone_number.length !== 10) {
//       toast.error("Phone number must be exactly 10 digits");
//       setLoading(false);
//       return;
//     }

//     if (!emailRegex.test(formData.email)) {
//       toast.error("Please enter a valid email address");
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await createDashboardAccount(
//         formData.name,
//         formData.phone_number,
//         formData.email,
//         formData.password,
//         role
//       );

//       toast.success(response.message || "Account created successfully!");
//       fetchAccounts();
//       setTimeout(() => closeModal(), 1000);
//     } catch (err) {
//       toast.error(err.error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!isOpen || !role) return null;

//   const storedRole = localStorage.getItem("role")?.toLowerCase().trim();

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-md z-50 p-4">
//       <div className="bg-white p-6 rounded-lg w-full max-w-xl shadow-lg relative">
//         <button onClick={closeModal} className="absolute top-3 right-3 text-gray-700">
//           <X size={20} />
//         </button>

//         <div className="w-full max-w-xl bg-white p-6 rounded-lg shadow-md">
//           <h2 className="text-2xl font-bold text-center mb-4">Create Dashboard Account</h2>
//           {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-3">{error}</div>}
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <input
//               type="text"
//               name="name"
//               placeholder="Name"
//               required
//               onChange={handleChange}
//               className="w-full p-2 border rounded"
//             />
//             <input
//               type="text"
//               name="phone_number"
//               placeholder="Phone Number"
//               required
//               onChange={handleChange}
//               value={formData.phone_number}
//               className="w-full p-2 border rounded"
//             />
//             <input
//               type="email"
//               name="email"
//               placeholder="Email"
//               required
//               onChange={handleChange}
//               value={formData.email}
//               className="w-full p-2 border rounded"
//             />
//             <input
//               type="password"
//               name="password"
//               placeholder="Password"
//               required
//               onChange={handleChange}
//               className="w-full p-2 border rounded"
//             />

//             {storedRole === "admin" ? (
//               <select
//                 value={role}
//                 onChange={(e) => setRole(e.target.value)}
//                 required
//                 className="w-full p-2 border rounded bg-white text-gray-800"
//               >
//                 <option value="">Select Role</option>
//                 <option value="facilitator">Facilitator</option>
//                 <option value="Coordinator">Coordinator</option>
//               </select>
//             ) : (
//               <input
//                 type="text"
//                 value={role}
//                 readOnly
//                 className="w-full p-2 border rounded bg-gray-100 text-gray-600"
//               />
//             )}

//             <button
//               type="submit"
//               className="w-full bg-blue-900 text-white p-2 rounded hover:bg-blue-600"
//               disabled={loading}
//             >
//               {loading ? "Signing Up..." : "Sign Up"}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AccountModal;



'use client';

import React, { useState, useEffect } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { createDashboardAccount } from "services/authService";
import { toast, ToastContainer } from "react-toastify";

const AccountModal = ({ isOpen, closeModal, fetchAccounts }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [role, setRole] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  useEffect(() => {
    if (isOpen) {
      const storedRole = localStorage.getItem("role")?.toLowerCase().trim();
      if (storedRole === "admin") setRole("facilitator");
      else if (storedRole === "coordinator") setRole("frontliner");
      else setRole("");
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone_number" && !/^\d{0,10}$/.test(value)) return;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // reset error on change
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (formData.phone_number.length !== 10) newErrors.phone_number = "Phone number must be exactly 10 digits";
    if (!emailRegex.test(formData.email)) newErrors.email = "Enter a valid email";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Confirm Password is required";
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await createDashboardAccount(
        formData.name,
        formData.phone_number,
        formData.email,
        formData.password,
        role
      );

      toast.success(response.message || "Account created successfully!");
      fetchAccounts();
      setTimeout(() => closeModal(), 2000);
    } catch (err) {
      toast.error(err.error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !role) return null;

  const storedRole = localStorage.getItem("role")?.toLowerCase().trim();

  return (
    <>
    {/* <ToastContainer/> */}
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-md z-50 p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-xl shadow-lg relative">
        <button onClick={closeModal} className="absolute top-3 right-3 text-gray-700">
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold text-center mb-4">Create Dashboard Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Name"
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <input
              type="text"
              name="phone_number"
              placeholder="Phone Number"
              onChange={handleChange}
              value={formData.phone_number}
              className="w-full p-2 border rounded"
            />
            {errors.phone_number && <p className="text-red-600 text-sm mt-1">{errors.phone_number}</p>}
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              value={formData.email}
              className="w-full p-2 border rounded"
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>

   {/* Password Field with Eye Icon */}
   <div className="relative">
   <input
     type={showPassword ? "text" : "password"}
     name="password"
     placeholder="Password"
     onChange={handleChange}
     className="w-full p-2 border rounded pr-10"
   />
   <span
     className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
     onClick={() => setShowPassword((prev) => !prev)}
   >
     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
   </span>
   {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
 </div>

 {/* Confirm Password Field with Eye Icon */}
 <div className="relative">
   <input
     type={showConfirmPassword ? "text" : "password"}
     name="confirmPassword"
     placeholder="Confirm Password"
     onChange={handleChange}
     className="w-full p-2 border rounded pr-10"
   />
   <span
     className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
     onClick={() => setShowConfirmPassword((prev) => !prev)}
   >
     {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
   </span>
   {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
 </div>

          {storedRole === "admin" ? (
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="w-full p-2 border rounded bg-white text-gray-800"
            >
              <option value="">Select Role</option>
              <option value="facilitator">Facilitator</option>
              <option value="Coordinator">Coordinator</option>
            </select>
          ) : (
            <input
              type="text"
              value={role}
              readOnly
              className="w-full p-2 border rounded bg-gray-100 text-gray-600"
            />
          )}

          <button
            type="submit"
            className="w-full bg-blue-900 text-white p-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
    </>
  );
};

export default AccountModal;


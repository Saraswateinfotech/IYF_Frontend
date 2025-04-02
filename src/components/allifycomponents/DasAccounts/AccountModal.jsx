// 'use client';

// import React, { useState } from "react";
// import { X } from "lucide-react";
// import { createDashboardAccount } from "services/authService";
// import { toast } from "react-toastify";

// const roles = ['frontliner', 'facilitator'];

// const AccountModal = ({ isOpen, closeModal, fetchAccounts }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     phone_number: "",
//     email: "",
//     password: "",
//     role: "",
//   });

//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const response = await createDashboardAccount(
//         formData.name,
//         formData.phone_number,
//         formData.email,
//         formData.password,
//         formData.role
//       );

//       toast.success(response.message || "Account created successfully!");

//       // Trigger the account list refresh after successful account creation
//       fetchAccounts();

//       setTimeout(() => {
//         closeModal();
//       }, 1000);
//     } catch (err) {
//       setError(err.response?.data?.error || "Something went wrong");
//       toast.error(err.response?.data?.error || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-md z-50 p-4">
//       <div className="bg-white p-6 rounded-lg w-full max-w-xl shadow-lg relative">
//         {/* Close Button */}
//         <button onClick={closeModal} className="absolute top-3 right-3 text-gray-700">
//           <X size={20} />
//         </button>

//         <div className="w-full max-w-xl bg-white p-6 rounded-lg shadow-md">
//           <h2 className="text-2xl font-bold text-center mb-4">Create Dashboard Account</h2>
//           {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-3">{error}</div>}
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <input type="text" name="name" placeholder="Name" required onChange={handleChange} className="w-full p-2 border rounded" />
//             <input type="text" name="phone_number" placeholder="Phone Number" required onChange={handleChange} className="w-full p-2 border rounded" />
//             <input type="email" name="email" placeholder="Email" required onChange={handleChange} className="w-full p-2 border rounded" />
//             <input type="password" name="password" placeholder="Password" required onChange={handleChange} className="w-full p-2 border rounded" />
//             <select name="role" required onChange={handleChange} className="w-full p-2 border rounded">
//               <option value="">Select Role</option>
//               {roles.map((role) => (
//                 <option key={role} value={role}>
//                   {role}
//                 </option>
//               ))}
//             </select>
//             <button type="submit" className="w-full bg-blue-900 text-white p-2 rounded hover:bg-blue-600" disabled={loading}>
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
import { X } from "lucide-react";
import { createDashboardAccount } from "services/authService";
import { toast } from "react-toastify";

const AccountModal = ({ isOpen, closeModal, fetchAccounts }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    email: "",
    password: "",
  });

  const [role, setRole] = useState(""); // role handled separately
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Set role from localStorage on modal open
  useEffect(() => {
    if (isOpen) {
      const storedRole = localStorage.getItem("role")?.toLowerCase().trim();
      console.log("Stored Role:", storedRole);

      if (storedRole === "admin") {
        setRole("facilitator");
      } else if (storedRole === "coordinator") {
        setRole("frontliner");
      } else {
        setRole("");
      }
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await createDashboardAccount(
        formData.name,
        formData.phone_number,
        formData.email,
        formData.password,
        role // send correct role
      );

      toast.success(response.message || "Account created successfully!");
      fetchAccounts();

      setTimeout(() => {
        closeModal();
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
      toast.error(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  //  Don't render form until role is set
  if (!isOpen || !role) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-md z-50 p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-xl shadow-lg relative">
        <button onClick={closeModal} className="absolute top-3 right-3 text-gray-700">
          <X size={20} />
        </button>

        <div className="w-full max-w-xl bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center mb-4">Create Dashboard Account</h2>
          {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-3">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              required
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="phone_number"
              placeholder="Phone Number"
              required
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />

            {/* Optional: Show role read-only */}
            <input
              type="text"
              value={role || ""}
              readOnly
              className="w-full p-2 border rounded bg-gray-100 text-gray-600"
            />

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
    </div>
  );
};

export default AccountModal;

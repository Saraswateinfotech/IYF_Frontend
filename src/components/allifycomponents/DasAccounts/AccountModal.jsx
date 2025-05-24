'use client';

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { createDashboardAccount } from "services/authService";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const AccountModal = ({ isOpen, closeModal, fetchAccounts }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    email: "",
    password: "",
  });

  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(document.body.classList.contains('dark'));

  // Sync darkMode state with document.body.classList
  useEffect(() => {
    const updateDarkMode = () => {
      const isDark = document.body.classList.contains('dark');
      setDarkMode(isDark);
    };

    updateDarkMode();

    const observer = new MutationObserver(updateDarkMode);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (formData.phone_number.length !== 10) {
      toast.error("Phone number must be exactly 10 digits");
      setLoading(false);
      return;
    }

    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      setLoading(false);
      return;
    }

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
      setTimeout(() => closeModal(), 1000);
    } catch (err) {
      toast.error(err.error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !role) return null;

  return (
    <>
      <style jsx global>{`
        .Toastify__toast {
          color: ${darkMode ? '#ffffff' : '#000000'} !important;
          background-color: ${darkMode ? '#2d396b' : '#ffffff'} !important;
          border: 1px solid ${darkMode ? '#374151' : '#e5e7eb'} !important;
        }
        .Toastify__toast--success {
          background-color: ${darkMode ? '#1a4a3b' : '#e6fffa'} !important;
          color: ${darkMode ? '#34d399' : '#38a169'} !important;
        }
        .Toastify__toast--error {
          background-color: ${darkMode ? '#4a1a1a' : '#fff1f0'} !important;
          color: ${darkMode ? '#f87171' : '#e53e3e'} !important;
        }
        .Toastify__toast--info {
          background-color: ${darkMode ? '#1a3a4a' : '#e6f0fa'} !important;
          color: ${darkMode ? '#60a5fa' : '#3182ce'} !important;
        }
        .Toastify__toast--warning {
          background-color: ${darkMode ? '#4a3a1a' : '#fffbeb'} !important;
          color: ${darkMode ? '#fbbf24' : '#d97706'} !important;
        }
        .Toastify__progress-bar {
          background-color: ${darkMode ? '#4b5563' : '#cbd5e0'} !important;
        }
      `}</style>

      <ToastContainer
        position="top-right"
        reverseOrder={false}
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? 'dark' : 'light'}
      />

      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-md z-50 p-4">
        <div className={`p-6 rounded-lg w-full max-w-xl shadow-lg relative ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <button onClick={closeModal} className={`absolute top-3 right-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <X size={20} />
          </button>

          <div className="w-full max-w-xl p-6 rounded-lg">
            <h2 className={`text-2xl font-bold text-center mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Create Dashboard Account
            </h2>
            {error && (
              <div className={`p-2 rounded mb-3 ${darkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-700'}`}>
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                required
                onChange={handleChange}
                className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
              />
              <input
                type="text"
                name="phone_number"
                placeholder="Phone Number"
                required
                onChange={handleChange}
                value={formData.phone_number}
                className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                onChange={handleChange}
                value={formData.email}
                className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                onChange={handleChange}
                className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
              />
              <input
                type="text"
                value={role}
                readOnly
                className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-600 text-gray-300 border-gray-600' : 'bg-gray-100 text-gray-600 border-gray-300'}`}
              />
              <button
                type="submit"
                className={`w-full p-2 rounded text-white transition duration-300 ease-in-out hover:scale-105 ${
                  darkMode ? 'bg-blue-800 hover:bg-blue-700' : 'bg-blue-900 hover:bg-blue-800'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountModal;
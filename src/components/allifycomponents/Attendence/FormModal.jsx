'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Script from 'next/script';
import {
  submitRegistrationForm,
} from 'services/apiCollection';
import { useDashboardContext } from 'contexts/DashboardContext';

const RegistrationForm = ({ isOpen, closeModal }) => {
  const { triggerUpdate } = useDashboardContext();  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [darkMode, setDarkMode] = useState(document.body.classList.contains('dark'));

  // Retrieve frontliner details from localStorage
  const frontlinerName = localStorage.getItem('name'); 
  const frontlinerId = localStorage.getItem('frontlinerId'); 

  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    mobile: '',
    frontlinerid: frontlinerId,
    profession: '',
    address: '',
    classMode: '',
    paymentMethod: '',
    amount: 0,
    razorpay_payment_id: '',
  });

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

  const resetForm = () => {
    setFormData({
      name: '',
      dob: '',
      mobile: '',
      frontlinerid: frontlinerId,
      profession: '',
      address: '',
      classMode: '',
      paymentMethod: '',
      amount: 0,
      razorpay_payment_id: '',
    });
    setErrors({});
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.name) newErrors.name = 'Name is required!';
    if (!formData.mobile) {
      newErrors.mobile = 'Mobile Number is required!';
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Mobile Number must be 10 digits!';
    }
    
    if (!formData.profession)
      newErrors.profession = 'Please select a profession!';
    if (!formData.classMode)
      newErrors.classMode = 'Please select a class mode!';
    if (!formData.paymentMethod)
      newErrors.paymentMethod = 'Please select a payment method!';
    if (
      (formData.classMode === 'Online' ||
        formData.paymentMethod === 'Referral') &&
      formData.amount === 0
    ) {
      newErrors.amount =
        'Payment is required for Online & Referral registrations!';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedAmount = formData.amount;
    if (name === 'profession') {
      updatedAmount =
        value === 'Student' ? 100 : value === 'Job Candidate' ? 200 : 0;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      amount: updatedAmount,
    }));

    // Clear error for this field
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    const method = formData.paymentMethod.toLowerCase();
    const updatedForm = {
      ...formData,
      payment_status: method === 'unpaid' || method === 'cash' ? 'not_received' : 'received',
    };

    if (method === 'online' || method === 'referral') {
      await createOrder(updatedForm);
      setIsSubmitting(false);
    } else {
      try {
        await submitRegistrationForm(updatedForm);
        toast.success('Form submitted successfully!');
        triggerUpdate();  
        setTimeout(() => {
          resetForm();
          closeModal();
        }, 2000);
      } catch (error) {
        toast.error(error.error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const createOrder = async (formToSubmit) => {
    try {
      const res = await fetch('/api/createOrder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: formToSubmit.amount * 100 }),
      });

      if (!res.ok) throw new Error('Failed to create order');

      const data = await res.json();

      const payment = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        order_id: data.id,
        amount: formToSubmit.amount * 100,
        currency: 'INR',
        name: 'Hare Krishna',
        description: 'Payment for Registration',
        prefill: {
          name: formToSubmit.name,
          contact: formToSubmit.mobile,
        },
        handler: async function (response) {
          try {
            await submitRegistrationForm({
              ...formToSubmit,
              razorpay_payment_id: response.razorpay_payment_id,
            });
            toast.success('Payment successful and form submitted!');
            triggerUpdate();  
            setTimeout(() => {
              resetForm();
              closeModal();
            }, 3000);
          } catch (error) {
            toast.error('Form submission failed after payment!');
          }
        },
      });

      payment.open();
    } catch (error) {
      toast.error('Failed to initiate payment');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
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
        .Toastify__progress-bar {
          background-color: ${darkMode ? '#4b5563' : '#cbd5e0'} !important;
        }
        input, select {
          background-color: ${darkMode ? '#707eae' : '#fff'} !important;
          color: ${darkMode ? 'white' : 'inherit'} !important;
          border-color: ${darkMode ? '#4b5563' : '#d1d5db'} !important;
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: ${darkMode ? 'invert(1)' : 'none'};
        }
        select {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${darkMode ? 'white' : 'black'}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
          background-size: 1em;
        }
        select::-ms-expand {
          display: none;
        }
      `}</style>

      <ToastContainer
        position="top-right"
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
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 p-4 backdrop-blur-md">
        <div className={`scrollbar-hide relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg p-6 shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <button
            onClick={closeModal}
            className={`absolute right-3 top-3 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}
          >
            <X size={20} />
          </button>
          <h2 className={`mb-4 text-center text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Registration Form
          </h2>

          <div className="flex flex-col gap-4">
            {/* Name */}
            <label className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              Name *
            </label>
            <input
              type="text"
              name="name"
              className="rounded-md border px-4 py-2"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}

            {/* DOB */}
            <label className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              Date of Birth (Optional)
            </label>
            <input
              type="date"
              name="dob"
              className="rounded-md border px-4 py-2"
              value={formData.dob}
              onChange={handleChange}
            />

            {/* Mobile */}
            <label className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              Mobile Number *
            </label>
            <input
              type="text"
              name="mobile"
              className="rounded-md border px-4 py-2"
              value={formData.mobile}
              onChange={handleChange}
            />
            {errors.mobile && (
              <p className="text-sm text-red-500">{errors.mobile}</p>
            )}

            {/* Address */}
            <label className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              Address (Optional)
            </label>
            <input
              type="text"
              name="address"
              className="rounded-md border px-4 py-2"
              value={formData.address}
              onChange={handleChange}
            />

            {/* Frontliner */}
            <label className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              Frontliner Name *
            </label>
            <input
              type="text"
              name="frontlinerid"
              className="rounded-md border px-4 py-2"
              value={frontlinerName}
              readOnly 
            />

            {/* Profession */}
            <label className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              Profession *
            </label>
            <select
              name="profession"
              className="rounded-md border px-4 py-2"
              value={formData.profession}
              onChange={handleChange}
            >
              <option value="">Select Profession</option>
              <option value="Student">Student (₹100)</option>
              <option value="Job Candidate">Job Candidate (₹200)</option>
            </select>
            {errors.profession && (
              <p className="text-sm text-red-500">{errors.profession}</p>
            )}

            {/* Class Mode */}
            <label className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              Class Mode *
            </label>
            <select
              name="classMode"
              className="rounded-md border px-4 py-2"
              value={formData.classMode}
              onChange={handleChange}
            >
              <option value="">Select Class Mode</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
            {errors.classMode && (
              <p className="text-sm text-red-500">{errors.classMode}</p>
            )}

            {/* Payment Method */}
            <label className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              Payment Method *
            </label>
            <select
              name="paymentMethod"
              className="rounded-md border px-4 py-2"
              value={formData.paymentMethod}
              onChange={handleChange}
            >
              <option value="">Select Payment Method</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Online">Online</option>
              <option value="Cash">Cash</option>
            </select>
            {errors.paymentMethod && (
              <p className="text-sm text-red-500">{errors.paymentMethod}</p>
            )}

            {/* Submit Button */}
            <button
              className={`rounded-md px-4 py-2 text-white disabled:opacity-50 ${darkMode ? 'bg-indigo-800 hover:bg-indigo-700' : 'bg-indigo-900 hover:bg-indigo-800'}`}
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegistrationForm;
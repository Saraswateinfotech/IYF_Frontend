'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Script from 'next/script';
import {
  submitRegistrationForm,
  fetchDashboardAccounts,
} from 'services/apiCollection';

const RegistrationForm = ({ isOpen, closeModal }) => {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    mobile: '',
    frontlinerid: '',
    profession: '',
    address: '',
    classMode: '',
    paymentMethod: '',
    amount: 0,
    razorpay_payment_id: '',
  });

  const [frontliners, setFrontliners] = useState([]); // Will store the list of frontliners from API
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetching frontliner data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchDashboardAccounts();
        setFrontliners(data); // Store the fetched frontliners
      } catch (err) {
        console.error('Error fetching accounts:', err);
        toast.error('Failed to load accounts. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      dob: '',
      mobile: '',
      frontlinerid: '',
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
    if (!formData.dob) newErrors.dob = 'Date of Birth is required!';
    if (!formData.mobile) newErrors.mobile = 'Mobile Number is required!';
    if (!formData.profession)
      newErrors.profession = 'Please select a profession!';
    if (!formData.classMode)
      newErrors.classMode = 'Please select a class mode!';
    if (!formData.paymentMethod)
      newErrors.paymentMethod = 'Please select a payment method!';
    if (!formData.frontlinerid)
      newErrors.frontlinerid = 'Please select a frontliner!';
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
      // payment_status: method === 'unpaid' ? 'not_received' : 'received',
      payment_status: method === 'unpaid' || method === 'cash' ? 'not_received' : 'received',

    };

    if (method === 'online' || method === 'referral') {
      await createOrder(updatedForm);
      setIsSubmitting(false);
    } else {
      try {
        await submitRegistrationForm(updatedForm);
        toast.success('Form submitted successfully!');
        resetForm();
        closeModal();
      } catch (error) {
        toast.error('Failed to submit form');
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
            resetForm();
            closeModal();
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
      <ToastContainer />
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 p-4 backdrop-blur-md">
        <div className="scrollbar-hide relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
          <button
            onClick={closeModal}
            className="absolute right-3 top-3 text-gray-700"
          >
            <X size={20} />
          </button>
          <h2 className="mb-4 text-center text-xl font-bold">
            Registration Form
          </h2>

          <div className="flex flex-col gap-4">
            {/* Name */}
            <label className="font-semibold">Name *</label>
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
            <label className="font-semibold">Date of Birth *</label>
            <input
              type="date"
              name="dob"
              className="rounded-md border px-4 py-2"
              value={formData.dob}
              onChange={handleChange}
            />
            {errors.dob && <p className="text-sm text-red-500">{errors.dob}</p>}

            {/* Mobile */}
            <label className="font-semibold">Mobile Number *</label>
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
            <label className="font-semibold">Address (Optional)</label>
            <input
              type="text"
              name="address"
              className="rounded-md border px-4 py-2"
              value={formData.address}
              onChange={handleChange}
            />

            {/* Frontliner */}
            <label className="font-semibold">Frontliner Name *</label>
            <select
              name="frontlinerid"
              className="rounded-md border px-4 py-2"
              value={formData.frontlinerid}
              onChange={handleChange}
              disabled={isLoading} // optional if you want to disable while loading
            >
              <option value="">Select Frontliner Name</option>
              {frontliners.map((item) => (
                <option key={item.id} value={item.user_id}>
                  {item.name}
                </option>
              ))}
            </select>
            {errors.frontlinerid && (
              <p className="text-sm text-red-500">{errors.frontlinerid}</p>
            )}

            {/* Profession */}
            <label className="font-semibold">Profession *</label>
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
            <label className="font-semibold">Class Mode *</label>
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
            <label className="font-semibold">Payment Method *</label>
            <select
              name="paymentMethod"
              className="rounded-md border px-4 py-2"
              value={formData.paymentMethod}
              onChange={handleChange}
            >
              <option value="">Select Payment Method</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Online">Online</option>
              <option value="Referral">Referral</option>
              <option value="Cash">Cash</option>
            </select>
            {errors.paymentMethod && (
              <p className="text-sm text-red-500">{errors.paymentMethod}</p>
            )}

            {/* Submit Button */}
            <button
              className="rounded-md bg-indigo-900 px-4 py-2 text-white hover:bg-indigo-800 disabled:opacity-50"
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

'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Script from 'next/script';
import { submitRegistrationForm } from 'services/apiCollection';

const RegistrationForm = ({ isOpen, closeModal }) => {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    mobile: '',
    frontlinerName: '',
    profession: '',
    address: '',
    classMode: '',
    paymentMethod: '',
    amount: 0,
    razorpay_payment_id: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setFormData({
      name: '',
      dob: '',
      mobile: '',
      frontlinerName: '',
      profession: '',
      address: '',
      classMode: '',
      paymentMethod: '',
      amount: 0,
      razorpay_payment_id: ''
    });
    setErrors({});
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.name) newErrors.name = 'Name is required!';
    if (!formData.dob) newErrors.dob = 'Date of Birth is required!';
    if (!formData.mobile) newErrors.mobile = 'Mobile Number is required!';
    if (!formData.profession) newErrors.profession = 'Please select a profession!';
    if (!formData.classMode) newErrors.classMode = 'Please select a class mode!';
    if (!formData.paymentMethod) newErrors.paymentMethod = 'Please select a payment method!';
    if (!formData.frontlinerName) newErrors.frontlinerName = 'Please select a frontliner!';
    if ((formData.classMode === 'Online' || formData.paymentMethod === 'Referral') && formData.amount === 0) {
      newErrors.amount = 'Payment is required for Online & Referral registrations!';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedAmount = formData.amount;
    if (name === 'profession') {
      updatedAmount = value === 'Student' ? 100 : value === 'Job Candidate' ? 200 : 0;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      amount: updatedAmount,
    }));

    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    const method = formData.paymentMethod.toLowerCase();

    const updatedForm = {
      ...formData,
      payment_status: method === 'unpaid' ? 'not_received' : 'received',
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
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-md z-50 p-4">
        <div className="bg-white p-6 rounded-lg w-full max-w-2xl shadow-xl relative max-h-[90vh] overflow-y-auto scrollbar-hide">
          <button onClick={closeModal} className="absolute top-3 right-3 text-gray-700">
            <X size={20} />
          </button>
          <h2 className="text-xl font-bold mb-4 text-center">Registration Form</h2>

          <div className="flex flex-col gap-4">
            {/* Name */}
            <label className="font-semibold">Name *</label>
            <input type="text" name="name" className="px-4 py-2 border rounded-md" value={formData.name} onChange={handleChange} />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

            {/* DOB */}
            <label className="font-semibold">Date of Birth *</label>
            <input type="date" name="dob" className="px-4 py-2 border rounded-md" value={formData.dob} onChange={handleChange} />
            {errors.dob && <p className="text-red-500 text-sm">{errors.dob}</p>}

            {/* Mobile */}
            <label className="font-semibold">Mobile Number *</label>
            <input type="text" name="mobile" className="px-4 py-2 border rounded-md" value={formData.mobile} onChange={handleChange} />
            {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}

            {/* Address */}
            <label className="font-semibold">Address (Optional)</label>
            <input type="text" name="address" className="px-4 py-2 border rounded-md" value={formData.address} onChange={handleChange} />

            {/* Frontliner */}
            <label className="font-semibold">Frontliner Name *</label>
            <select name="frontlinerName" className="px-4 py-2 border rounded-md" value={formData.frontlinerName} onChange={handleChange}>
              <option value="">Select Frontliner Name</option>
              <option value="Ramesh">Ramesh</option>
              <option value="Suresh">Suresh</option>
              <option value="Mahesh">Mahesh</option>
              <option value="Rajesh">Rajesh</option>
            </select>
            {errors.frontlinerName && <p className="text-red-500 text-sm">{errors.frontlinerName}</p>}

            {/* Profession */}
            <label className="font-semibold">Profession *</label>
            <select name="profession" className="px-4 py-2 border rounded-md" value={formData.profession} onChange={handleChange}>
              <option value="">Select Profession</option>
              <option value="Student">Student (₹100)</option>
              <option value="Job Candidate">Job Candidate (₹200)</option>
            </select>
            {errors.profession && <p className="text-red-500 text-sm">{errors.profession}</p>}

            {/* Class Mode */}
            <label className="font-semibold">Class Mode *</label>
            <select name="classMode" className="px-4 py-2 border rounded-md" value={formData.classMode} onChange={handleChange}>
              <option value="">Select Class Mode</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
            {errors.classMode && <p className="text-red-500 text-sm">{errors.classMode}</p>}

            {/* Payment Method */}
            <label className="font-semibold">Payment Method *</label>
            <select name="paymentMethod" className="px-4 py-2 border rounded-md" value={formData.paymentMethod} onChange={handleChange}>
              <option value="">Select Payment Method</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Online">Online</option>
              <option value="Referral">Referral</option>
              <option value="Cash">Cash</option>
            </select>
            {errors.paymentMethod && <p className="text-red-500 text-sm">{errors.paymentMethod}</p>}

            {/* Submit Button */}
            <button
              className="bg-indigo-900 hover:bg-indigo-800 text-white px-4 py-2 rounded-md disabled:opacity-50"
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
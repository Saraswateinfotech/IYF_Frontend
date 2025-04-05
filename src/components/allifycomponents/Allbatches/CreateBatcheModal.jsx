'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  batchCreateBatch,
  fetchAllFacilitatorOrFrontliner,
} from 'services/apiCollection';

const CreateBatcheModal = ({ isOpen, closeModal, onSuccess }) => {
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [frontlinerList, setFrontlinerList] = useState([]);

  const [formData, setFormData] = useState({
    // batcheName: '',
    facilitatorid: '',
  });

  // Fetch frontliner list on modal open
  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      try {
        const data = await fetchAllFacilitatorOrFrontliner();
        setFrontlinerList(data);
      } catch (err) {
        console.error('Error fetching frontliner list:', err);
        toast.error('Failed to load facilitator list.');
      }
    };

    fetchData();
  }, [isOpen]);

  const resetForm = () => {
    setFormData({
      // batcheName: '',
      facilitatorid: '',
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    // if (!formData.batcheName) newErrors.batcheName = 'Batch Name is required!';
    if (!formData.facilitatorid)
      newErrors.facilitatorid = 'Please select a facilitator!';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);

    const payload = {
      // GroupName: formData.batcheName,
      FacilitatorId: formData.facilitatorid,
    };

    try {
      await batchCreateBatch(payload);
      toast.success('✅ Batch created successfully!');
      setTimeout(() => {
        onSuccess();
        resetForm();
        closeModal();
      }, 2000);
    } catch (err) {
      toast.error(err.message || 'Something went wrong!');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <ToastContainer />
      <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-40 p-4">
        <div className="relative w-full max-w-xl rounded-md bg-white p-6 shadow-lg">
          <button
            onClick={closeModal}
            className="absolute right-3 top-3 text-gray-500"
          >
            <X size={20} />
          </button>

          <h2 className="mb-4 text-center text-xl font-bold">Create Batch</h2>

          <div className="flex flex-col gap-4">
            {/* Batch Name */}
            {/* <div>
              <label className="font-medium">Batch Name *</label>
              <input
                type="text"
                name="batcheName"
                className="w-full rounded-md border px-3 py-2"
                value={formData.batcheName}
                onChange={handleChange}
              />
              {errors.batcheName && (
                <p className="text-sm text-red-500">{errors.batcheName}</p>
              )}
            </div> */}

            {/* Facilitator Select */}
            <div>
              <label className="font-medium">Facilitator *</label>
              <select
                name="facilitatorid"
                className="w-full rounded-md border px-3 py-2"
                value={formData.facilitatorid}
                onChange={handleChange}
              >
                <option value="">Select Facilitator</option>
                {frontlinerList
                  .filter((f) => f.role === 'facilitator')
                  .map((f) => (
                    <option key={f.id} value={f.user_id}>
                      {f.name} ({f.user_id})
                    </option>
                  ))}
              </select>
              {errors.facilitatorid && (
                <p className="text-sm text-red-500">{errors.facilitatorid}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="rounded bg-indigo-700 px-4 py-2 text-white hover:bg-indigo-800 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateBatcheModal;

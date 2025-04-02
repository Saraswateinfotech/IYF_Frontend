// 'use client';

// import React, { useState } from 'react';
// import { X } from 'lucide-react';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Script from 'next/script';

// const CreateBatcheModal = ({ isOpen, closeModal }) => {
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const [formData, setFormData] = useState({
//     name: '',
//     mobile: '',
//     classMode: '',
//     frontlinerid: '',
//   });

//   const frontlinerList = [
//     { id: '1', name: 'HG Hari Bhakti Prabhuji' },
//     { id: '2', name: 'HG Mohan Murari Prabhuji' },
//   ];

//   const resetForm = () => {
//     setFormData({
//         batcheName: '',
//       mobile: '',
//       batcheMode: '',
//       facilitatorid: '',
//     });
//     setErrors({});
//   };

//   const validateForm = () => {
//     let newErrors = {};

//     if (!formData.batcheName) newErrors.name = 'Batche Name is required!';
//     if (!formData.mobile) newErrors.mobile = 'Mobile Number is required!';
//     if (!formData.batcheMode)
//       newErrors.batcheMode = 'Please select a Batche mode!';
//     if (!formData.facilitatorid)
//       newErrors.facilitatorid = 'Please select a facilitator!';

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setErrors((prev) => ({ ...prev, [name]: '' }));
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) return;

//     setIsSubmitting(true);

//     // Simulate API submission delay
//     setTimeout(() => {
//       toast.success('Batch created successfully!');
//       setIsSubmitting(false);
//       resetForm();
//       closeModal();
//     }, 1000);
//   };

//   if (!isOpen) return null;

//   return (
//     <>
//       <ToastContainer />

//       <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 p-4 backdrop-blur-md">
//         <div className="scrollbar-hide relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
//           <button
//             onClick={closeModal}
//             className="absolute right-3 top-3 text-gray-700"
//           >
//             <X size={20} />
//           </button>
//           <h2 className="mb-4 text-center text-xl font-bold">Create Batch</h2>

//           <div className="flex flex-col gap-4">
//             {/*Batche Name */}
//             <label className="font-semibold">Batche Name *</label>
//             <input
//               type="text"
//               name="name"
//               className="rounded-md border px-4 py-2"
//               value={formData.batcheName}
//               onChange={handleChange}
//             />
//             {errors.batcheName && (
//               <p className="text-sm text-red-500">{errors.batcheName}</p>
//             )}

//             {/*🎤 Speaker Name */}
//             <label className="font-semibold">🎤 Speaker Name *</label>
//             <input
//               type="text"
//               name="name"
//               className="rounded-md border px-4 py-2"
//               value={formData.speakerName}
//               onChange={handleChange}
//             />
//             {errors.speakerName && (
//               <p className="text-sm text-red-500">{errors.speakerName}</p>
//             )}

//             {/* Mobile */}
//             <label className="font-semibold">Mobile Number *</label>
//             <input
//               type="text"
//               name="mobile"
//               className="rounded-md border px-4 py-2"
//               value={formData.mobile}
//               onChange={handleChange}
//             />
//             {errors.mobile && (
//               <p className="text-sm text-red-500">{errors.mobile}</p>
//             )}

//             {/* Frontliner */}
//             <label className="font-semibold">Facilitator Name *</label>
//             <select
//               name="frontlinerid"
//               className="rounded-md border px-4 py-2"
//               value={formData.facilitatorid}
//               onChange={handleChange}
//             >
//               <option value="">Select Facilitator Name</option>
//               {frontlinerList.map((f) => (
//                 <option key={f.id} value={f.id}>
//                   {f.name}
//                 </option>
//               ))}
//             </select>
//             {errors.facilitatorid && (
//               <p className="text-sm text-red-500">{errors.facilitatorid}</p>
//             )}

//             {/* Class Mode */}
//             <label className="font-semibold">Batche Mode *</label>
//             <select
//               name="classMode"
//               className="rounded-md border px-4 py-2"
//               value={formData.batcheMode}
//               onChange={handleChange}
//             >
//               <option value="">Select Batch Mode</option>
//               <option value="Online">Online</option>
//               <option value="Offline">Offline</option>
//             </select>
//             {errors.batcheMode && (
//               <p className="text-sm text-red-500">{errors.batcheMode}</p>
//             )}

//             {/* Submit Button */}
//             <button
//               className="rounded-md bg-indigo-900 px-4 py-2 text-white hover:bg-indigo-800 disabled:opacity-50"
//               onClick={handleSubmit}
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? 'Submitting...' : 'Submit'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default CreateBatcheModal;







'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { batchCreateBatch } from 'services/apiCollection';

const CreateBatcheModal = ({ isOpen, closeModal }) => {
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    batcheName: '',
    facilitatorid: '',
  });

  const frontlinerList = [
    { id: 'VIP980543', name: 'HG Hari Bhakti Prabhuji' },
    { id: 'COO437978', name: 'HG Mohan Murari Prabhuji' },
  ];

  const resetForm = () => {
    setFormData({
      batcheName: '',
      facilitatorid: '',
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.batcheName) newErrors.batcheName = 'Batch Name is required!';
    if (!formData.facilitatorid) newErrors.facilitatorid = 'Please select a facilitator!';

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
      GroupName: formData.batcheName,
      FacilitatorId: formData.facilitatorid,
    };

    try {
      await batchCreateBatch(payload);
      toast.success('✅ Batch created successfully!');
      resetForm();
      closeModal();
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

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 p-4 backdrop-blur-md">
        <div className="scrollbar-hide relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
          <button
            onClick={closeModal}
            className="absolute right-3 top-3 text-gray-700"
          >
            <X size={20} />
          </button>
          <h2 className="mb-4 text-center text-xl font-bold">Create Batch</h2>

          <div className="flex flex-col gap-4">
            {/* Batch Name */}
            <label className="font-semibold">Batch Name *</label>
            <input
              type="text"
              name="batcheName"
              className="rounded-md border px-4 py-2"
              value={formData.batcheName}
              onChange={handleChange}
            />
            {errors.batcheName && (
              <p className="text-sm text-red-500">{errors.batcheName}</p>
            )}

            {/* Facilitator */}
            <label className="font-semibold">Facilitator Name *</label>
            <select
              name="facilitatorid"
              className="rounded-md border px-4 py-2"
              value={formData.facilitatorid}
              onChange={handleChange}
            >
              <option value="">Select Facilitator Name</option>
              {frontlinerList.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
            {errors.facilitatorid && (
              <p className="text-sm text-red-500">{errors.facilitatorid}</p>
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

export default CreateBatcheModal;

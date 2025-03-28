// 'use client';

// import React, { useState } from 'react';
// import { X } from 'lucide-react';

// const DetailsModal = ({ isOpen, closeModal, selectedRow }) => {
//   const [facilitator, setFacilitator] = useState(selectedRow?.facilitatorName || '');
//   const [paymentReceived, setPaymentReceived] = useState(selectedRow?.paymentReceived || false);

//   const handleSubmit = async () => {
//     try {
//       const response = await fetch('/api/Transfer-to-dys', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           ...selectedRow,
//           facilitator,
//           paymentReceived,
//         }),
//       });

//       const result = await response.json();
//       if (response.ok) {
//         closeModal();
//       } else {
//         console.error('Error:', result.message);
//       }
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   const handleFacilitatorChange = async () => {
//     try {
//       const response = await fetch('/api/Change-Facilitator', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           studentId: selectedRow?.id,
//           newFacilitator: facilitator,
//           paymentReceived,
//         }),
//       });

//       const result = await response.json();
//       if (response.ok) {
//         alert('Facilitator and Payment Status updated successfully');
//       } else {
//         console.error('Error:', result.message);
//       }
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   if (!isOpen || !selectedRow) return null;

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-md z-50 p-4">
//       <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl relative">
//         <button onClick={closeModal} className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition">
//           <X size={24} />
//         </button>
//         <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Student Details</h2>
//         <div className="space-y-4">
//           <div className="bg-gray-100 p-4 rounded-lg">
//             <p><strong>Name:</strong> {selectedRow?.name}</p>
//             <p><strong>Phone:</strong> {selectedRow?.phoneNumber}</p>
//             <p><strong>Age:</strong> {selectedRow?.age}</p>
//             <p><strong>Profession:</strong> {selectedRow?.profession}</p>
//             <p><strong>Student Status:</strong> {selectedRow?.studentStatus}</p>
//           </div>
//           {/* Facilitator Change Dropdown */}
//           <div>
//             <label htmlFor="facilitator" className="block mb-2 text-sm font-medium text-gray-900">Facilitator</label>
//             <select id="facilitator" value={facilitator} onChange={(e) => setFacilitator(e.target.value)}
//               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5">
//               <option value="">Select Facilitator</option>
//               <option value="John Doe">John Doe</option>
//               <option value="Jane Smith">Jane Smith</option>
//               <option value="Michael Johnson">Michael Johnson</option>
//             </select>
//           </div>
//           {/* Payment Received Checkbox */}
//           <div className="flex items-center">
//             <input type="checkbox" id="paymentReceived" checked={paymentReceived} onChange={(e) => setPaymentReceived(e.target.checked)}
//               className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
//             <label htmlFor="paymentReceived" className="ml-2 text-sm font-medium text-gray-900">Payment Received</label>
//           </div>
//           <button onClick={handleFacilitatorChange} className="bg-green-600 text-white px-6 py-2 rounded-lg w-full hover:bg-green-700 transition font-medium">
//             Save
//           </button>
//           <button onClick={handleSubmit} className="bg-blue-600 text-white px-6 py-2 rounded-lg w-full hover:bg-blue-700 transition font-medium">
//             Transfer to DYS
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DetailsModal;




'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { updatePaymentStatus } from 'services/apiCollection';

type Student = {
  user_id: number;
};

const DetailsModal = ({
  isOpen,
  closeModal,
  selectedRow,
  onSuccess,
}: {
  isOpen: boolean;
  closeModal: () => void;
  selectedRow: Student | null;
  onSuccess: () => void;
}) => {
  const [response, setResponse] = useState<string>('');

  const handleSubmit = async () => {
    if (!response || !selectedRow) return;

    try {
      await updatePaymentStatus(selectedRow.user_id, response);
      toast.success('Payment status update successfully');
      setResponse('');
      closeModal();
      onSuccess(); // Fetch updated data
    } catch (err) {
      console.error(err);
      toast.error('Failed to Payment status update');
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={closeModal}
      PaperProps={{
        sx: {
          width: '500px',
          height: '220px',
          padding: 2,
        },
      }}
    >
      <DialogTitle>Update Payment Status</DialogTitle>
      <DialogContent>
        <RadioGroup
          value={response}
          onChange={(e) => setResponse(e.target.value)}
        >
          <FormControlLabel value="received" control={<Radio />} label="received" />
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeModal}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={!response}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DetailsModal;

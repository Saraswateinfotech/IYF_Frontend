// 'use client';

// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   RadioGroup,
//   FormControlLabel,
//   Radio,
// } from '@mui/material';
// import { useState } from 'react';
// import { toast, ToastContainer } from 'react-toastify';
// import { updateStudentStatus } from 'services/apiCollection';

// type Student = {
//   user_id: number;
//   name: string;
// };

// const ResponseModal = ({
//   isOpen,
//   closeModal,
//   selectedRow,
//   onSuccess,
// }: {
//   isOpen: boolean;
//   closeModal: () => void;
//   selectedRow: Student | null;
//   onSuccess: () => void;
// }) => {
//   const [response, setResponse] = useState<string>('');

//   const handleSubmit = async () => {
//     if (!response || !selectedRow) return;

//     try {
//       console.log('Submitting response:', response, 'for', selectedRow?.name);
//       await updateStudentStatus(selectedRow.user_id, response);
//       toast.success('Response submitted successfully');

//       setTimeout(() => {
//         setResponse('');
//         closeModal();
//         onSuccess(); // Fetch updated data
//       }, 2000);
//     } catch (err) {
//       console.error(err);
//       toast.error('Failed to submit response');
//     }
//   };

//   return (
//     <>
//       <ToastContainer />
//       <Dialog
//         open={isOpen}
//         onClose={closeModal}
//         PaperProps={{
//           sx: {
//             width: '500px',
//             height: '350px',
//             padding: 2,
//           },
//         }}
//       >
//         <DialogTitle>Calling Response</DialogTitle>
//         <DialogContent>
//           <p>
//             Please select a response for <strong>{selectedRow?.name}</strong>:
//           </p>
//           <RadioGroup
//             value={response}
//             onChange={(e) => setResponse(e.target.value)}
//           >
//             <FormControlLabel
//               value="will_come"
//               control={<Radio />}
//               label="Interested (Will Come)"
//             />
//             <FormControlLabel
//               value="not_interested"
//               control={<Radio />}
//               label="Not Interested"
//             />
//             <FormControlLabel value="busy" control={<Radio />} label="Busy" />
//             <FormControlLabel
//               value="might_come"
//               control={<Radio />}
//               label="Might Come"
//             />
//           </RadioGroup>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={closeModal}>Cancel</Button>
//           <Button onClick={handleSubmit} disabled={!response}>
//             Submit
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// };

// export default ResponseModal;



// 'use client';

// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   RadioGroup,
//   FormControlLabel,
//   Radio,
// } from '@mui/material';
// import { useState } from 'react';
// import { toast } from 'react-toastify';
// import { updateStudentStatus } from 'services/apiCollection';

// type Student = {
//   user_id: number;
//   name: string;
// };

// const ResponseModal = ({
//   isOpen,
//   closeModal,
//   selectedRow,
//   onSuccess,
// }: {
//   isOpen: boolean;
//   closeModal: () => void;
//   selectedRow: Student | null;
//   onSuccess: () => void;
// }) => {
//   const [response, setResponse] = useState<string>('');

//   const handleSubmit = async () => {
//     if (!response || !selectedRow) return;

//     try {
//       await updateStudentStatus(selectedRow.user_id, response);
//       toast.success('Response submitted successfully');
      
//       // Immediate state updates
//       setResponse('');
//       closeModal();
//       onSuccess(); // Fetch updated data
//     } catch (err) {
//       console.error(err);
//       toast.error('Failed to submit response');
//     }
//   };

//   return (
//     <Dialog
//       open={isOpen}
//       onClose={closeModal}
//       PaperProps={{
//         sx: {
//           width: '500px',
//           height: '350px',
//           padding: 2,
//         },
//       }}
//     >
//       <DialogTitle>Calling Response</DialogTitle>
//       <DialogContent>
//         <p className="mb-4">
//           Please select a response for <strong>{selectedRow?.name}</strong>:
//         </p>
//         <RadioGroup
//           value={response}
//           onChange={(e) => setResponse(e.target.value)}
//         >
//           <FormControlLabel
//             value="will_come"
//             control={<Radio />}
//             label="Interested (Will Come)"
//           />
//           <FormControlLabel
//             value="not_interested"
//             control={<Radio />}
//             label="Not Interested"
//           />
//           <FormControlLabel 
//             value="busy" 
//             control={<Radio />} 
//             label="Busy" 
//           />
//           <FormControlLabel
//             value="might_come"
//             control={<Radio />}
//             label="Might Come"
//           />
//         </RadioGroup>
//       </DialogContent>
//       <DialogActions>
//         <Button 
//           onClick={closeModal}
//           color="secondary"
//         >
//           Cancel
//         </Button>
//         <Button 
//           onClick={handleSubmit} 
//           disabled={!response}
//           color="primary"
//           variant="contained"
//         >
//           Submit
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default ResponseModal;



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
  TextField, // Import TextField
} from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { updateStudentStatus } from 'services/apiCollection';

type Student = {
  user_id: number;
  name: string;
};

const ResponseModal = ({
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
      await updateStudentStatus(selectedRow.user_id, response);
      toast.success('Response submitted successfully');
      
      // Immediate state updates
      setResponse('');
      closeModal();
      onSuccess(); // Fetch updated data
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit response');
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={closeModal}
      PaperProps={{
        sx: {
          width: '500px',
          height: '400px', // Adjust height to fit new input field
          padding: 2,
        },
      }}
    >
      <DialogTitle>Calling Response</DialogTitle>
      <DialogContent>
        <p className="mb-4">
          Please select a response for <strong>{selectedRow?.name}</strong>:
        </p>
        <RadioGroup
          value={response}
          onChange={(e) => setResponse(e.target.value)}
        >
          <FormControlLabel
            value="will Come"
            control={<Radio />}
            label="Interested (Will Come)"
          />
          <FormControlLabel
            value="Not Interested"
            control={<Radio />}
            label="Not Interested"
          />
          <FormControlLabel 
            value="busy" 
            control={<Radio />} 
            label="Busy" 
          />
          <FormControlLabel
            value="Might Come"
            control={<Radio />}
            label="Might Come"
          />
        </RadioGroup>

        {/* Text input for custom message */}
        <TextField
          label="Add Custom Message"
          variant="outlined"
          fullWidth
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={closeModal}
          color="secondary"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={!response}
          color="primary"
          variant="contained"
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResponseModal;

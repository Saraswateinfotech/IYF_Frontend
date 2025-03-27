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
// import { getUserByCallingId, updateStudentStatus } from 'services/apiCollection';

// type Student = {
//   user_id: number;
//   name: string;
// };

// const ResponseModal = ({
//   isOpen,
//   closeModal,
//   selectedRow,
// }: {
//   isOpen: boolean;
//   closeModal: () => void;
//   selectedRow: Student | null;
// }) => {
//   const [response, setResponse] = useState<string>('');

//   const handleSubmit = async () => {
//     if (!response || !selectedRow) return;

//     try {
//       console.log('Submitting response:', response, 'for', selectedRow?.name);
//       await updateStudentStatus(selectedRow.user_id, response);
//       toast.success('Response submitted successfully');
//       closeModal();
//       setResponse('');
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
//         <p>Please select a response for <strong>{selectedRow?.name}</strong>:</p>
//         <RadioGroup
//           value={response}
//           onChange={(e) => setResponse(e.target.value)}
//         >
//           <FormControlLabel value="will_come" control={<Radio />} label="Interested (Will Come)" />
//           <FormControlLabel value="not_interested" control={<Radio />} label="Not Interested" />
//           <FormControlLabel value="busy" control={<Radio />} label="Busy" />
//           <FormControlLabel value="might_come" control={<Radio />} label="Might Come" />
//         </RadioGroup>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={closeModal}>Cancel</Button>
//         <Button onClick={handleSubmit} disabled={!response}>Submit</Button>
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
      console.log('Submitting response:', response, 'for', selectedRow?.name);
      await updateStudentStatus(selectedRow.user_id, response);
      toast.success('Response submitted successfully');
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
          height: '350px',
          padding: 2,
        },
      }}
    >
      <DialogTitle>Calling Response</DialogTitle>
      <DialogContent>
        <p>Please select a response for <strong>{selectedRow?.name}</strong>:</p>
        <RadioGroup
          value={response}
          onChange={(e) => setResponse(e.target.value)}
        >
          <FormControlLabel value="will_come" control={<Radio />} label="Interested (Will Come)" />
          <FormControlLabel value="not_interested" control={<Radio />} label="Not Interested" />
          <FormControlLabel value="busy" control={<Radio />} label="Busy" />
          <FormControlLabel value="might_come" control={<Radio />} label="Might Come" />
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeModal}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={!response}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResponseModal;

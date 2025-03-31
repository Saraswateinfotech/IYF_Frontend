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
import { toast, ToastContainer } from 'react-toastify';
import { updatePaymentStatus } from 'services/apiCollection';

type Student = {
  user_id: number;
};

const PaymentStatus = ({
  isOpens,
  closeModal,
  selectedRow,
  onSuccess,
}: {
  isOpens: boolean;
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

      setTimeout(() => {
        setResponse('');
        closeModal();
        onSuccess(); // Fetch updated data
      }, 2000);
    } catch (err) {
      console.error(err);
      toast.error('Failed to Payment status update');
    }
  };

  return (
    <>
      <ToastContainer />
      <Dialog
        open={isOpens}
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
            <FormControlLabel
              value="received"
              control={<Radio />}
              label="received"
            />
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!response}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PaymentStatus;







'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { updatestudentgroupwisename } from 'services/apiCollection';

type Student = {
  user_id: number;
  student_id?: number;
};

const ChangeGroup = ({
  isOpens,
  closeModal,
  selectedRow,
  onSuccess,
  priviousGroupName, // Receive currentGroupName prop
}: {
  isOpens: boolean;
  closeModal: () => void;
  selectedRow: Student | null;
  onSuccess: () => void;
  priviousGroupName: string; // currentGroupName is passed as a prop
}) => {
  const [currentGroup, setNewGroupName] = useState(priviousGroupName);

  const handleSubmit = async () => {
    if (!currentGroup || !selectedRow) return;
    try {
      await updatestudentgroupwisename(selectedRow.student_id, priviousGroupName, currentGroup);
      toast.success('Updated student group name successfully');

      setTimeout(() => {
        setNewGroupName('');
        closeModal();
        onSuccess(); // Refresh data
      }, 2000);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update group name');
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
        <DialogTitle>Update Group</DialogTitle>
        <DialogContent>
          <form className="mx-auto max-w-sm">
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Select a Group
            </label>
            <select
              value={currentGroup}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            >
              <option value="">Select a Group</option>
              <option value="DYS">DYS</option>
              <option value="Jagganath">Jagganath</option>
              <option value="Nachiketa">Nachiketa</option>
              <option value="Shadev">Shadev</option>
              <option value="Nakul">Nakul</option>
              <option value="Arjun">Arjun</option>
              <option value="GourangSabha">GourangSabha</option>
              <option value="Bhima">Bhima</option>
            </select>
          </form>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeModal}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!currentGroup}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ChangeGroup;

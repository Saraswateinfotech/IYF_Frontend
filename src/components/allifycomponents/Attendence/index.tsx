'use client';
import { useMemo, useState } from 'react';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { ToastContainer, toast } from 'react-toastify';
import { MdAddTask } from 'react-icons/md';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

// Example data type
type Person = {
  id: number;
  name: { firstName: string; lastName: string };
  number: number;
  address: string;
  city: string;
  state: string;
};

// Sample students (not in table initially)
const allStudents: Person[] = [
  {
    id: 1,
    name: { firstName: 'John', lastName: 'Doe' },
    number: 56663666612,
    address: '261 Erdman Ford',
    city: 'East Daphne',
    state: 'Kentucky',
  },
  {
    id: 2,
    name: { firstName: 'Jane', lastName: 'Doe' },
    number: 64196456525,
    address: '769 Dominic Grove',
    city: 'Columbus',
    state: 'Ohio',
  },
  {
    id: 3,
    name: { firstName: 'Alice', lastName: 'Smith' },
    number: 64188456525,
    address: '123 Maple Street',
    city: 'New York',
    state: 'New York',
  },
  {
    id: 4,
    name: { firstName: 'John', lastName: 'Doe' },
    number: 56663666613,
    address: '261 Erdman Ford',
    city: 'East Daphne',
    state: 'Kentucky',
  },
];

const Attendance = () => {
  const [data, setData] = useState<Person[]>([]); // Initially empty table
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async () => {
    if (data.length === 0) {
      toast.info('⚠ Please add students before submitting attendance.');
      return;
    }
    try {
      const response = await fetch('/api/submit-attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok) {
        toast.success('✅ Attendance submitted successfully!');
      } else {
        toast.error(`❌ Error: ${result.message || 'Something went wrong!'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('❌ Server connection error!');
    }
  };

  const handleAutocompleteChange = (event: any, newValue: Person[]) => {
    setData(newValue); // Set only selected students in table
  };

  const columns = useMemo<MRT_ColumnDef<Person>[]>(
    () => [
      { accessorKey: 'name.firstName', header: 'First Name', size: 150 },
      { accessorKey: 'name.lastName', header: 'Last Name', size: 150 },
      { accessorKey: 'number', header: 'Number', size: 200 },
      { accessorKey: 'address', header: 'Address', size: 200 },
      { accessorKey: 'city', header: 'City', size: 150 },
      { accessorKey: 'state', header: 'State', size: 150 },
    ],
    [data],
  );

  return (
    <>
      <ToastContainer />
      <div className="flex flex-wrap justify-end gap-4 p-4">
  
        <button
          onClick={handleSubmit}
          className="flex w-full items-center rounded-full bg-indigo-900 px-6 py-3 text-lg font-medium text-white hover:bg-indigo-800 sm:w-auto"
        >
          <MdAddTask />
          <span className="pl-2">Submit Attendance</span>
        </button>
      </div>

      <div className="max-w-2xll mx-auto mb-5 w-full rounded-md bg-white p-5 shadow-2xl">
        <Autocomplete
          multiple
          id="checkboxes-tags-demo"
          options={allStudents}
          getOptionLabel={(option) =>
            `${option.name.firstName} ${option.name.lastName} ${option.number}`
          }
          onChange={handleAutocompleteChange}
          className="w-full"
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Students"
              placeholder="Search..."
              fullWidth
            />
          )}
        />
      </div>

      {data.length === 0 ? (
        <>
<div className="flex justify-center items-center">
  <div className="bg-white dark:bg-gray-800 p-5 mb-5 rounded-md shadow-2xl w-full max-w-2xll mx-auto text-center">
    <p className="text-lg font-medium text-gray-900 dark:text-gray-100">Not Selected Attendence</p>
  </div>
</div>
</>
      ) : (
        <>
          <div className="mb-5 rounded-md bg-white p-5 shadow-2xl">
            <MaterialReactTable columns={columns} data={data} enableSorting />
          </div>
        
        </>
      )}

   
    </>
  );
};

export default Attendance;

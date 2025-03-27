
'use client';
import { useEffect, useMemo, useState } from 'react';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { ToastContainer, toast } from 'react-toastify';
import { MdAddTask } from 'react-icons/md';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { fetchAllStudents } from 'services/apiCollection';

type Person = {
  name: string;
  mobile_number: string;
  address: string;
  city: string;
  state: string;
};

const Attendance = () => {
  const [data, setData] = useState<Person[]>([]);
  const [allStudents, setAllStudents] = useState<Person[]>([]); // ✅ new state
    const [isLoading, setIsLoading] = useState(true);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const resp = await fetchAllStudents();
        setAllStudents(resp.students);
      } catch (error) {
        console.error('Failed to fetch all students:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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
    setData(newValue);
  };

  const columns = useMemo<MRT_ColumnDef<Person>[]>(
    () => [
      { accessorKey: 'name', header: 'Name', size: 150 },
      { accessorKey: 'mobile_number', header: 'Number', size: 200 },
      { accessorKey: 'address', header: 'Address', size: 200 },
      { accessorKey: 'city', header: 'City', size: 150 },
      { accessorKey: 'state', header: 'State', size: 150 },
    ],
    [],
  );
  if (isLoading) {
    return <div className="mt-7 p-5">Loading...</div>;
  }
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
          options={allStudents}
          getOptionLabel={(option) =>
            ` ${option.name} ${option.mobile_number}`
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
        <div className="flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 p-5 mb-5 rounded-md shadow-2xl w-full max-w-2xll mx-auto text-center">
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Not Selected Attendance
            </p>
          </div>
        </div>
      ) : (
        <div className="mb-5 rounded-md bg-white p-5 shadow-2xl">
          <MaterialReactTable columns={columns} data={data} enableSorting />
        </div>
      )}
    </>
  );
};

export default Attendance;

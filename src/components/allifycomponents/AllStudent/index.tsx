// 'use client';

// import { useMemo, useState } from 'react';
// import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
// import EditModal from './EditModal';

// // Example data type
// type Person = {
//   id: number;
//   name: { firstName: string; lastName: string };
//   address: string;
//   city: string;
//   state: string;
//   attendance?: boolean;
//   group:string;
// };

// // Sample data with IDs
// const initialData: Person[] = [
//   { id: 1, name: { firstName: 'John', lastName: 'Doe' }, address: '261 Erdman Ford', city: 'East Daphne', state: 'Kentucky',group:"DYS-1", },
//   { id: 2, name: { firstName: 'Jane', lastName: 'Doe' }, address: '769 Dominic Grove', city: 'Columbus', state: 'Ohio',group:"DYS-2", },
//   { id: 3, name: { firstName: 'John', lastName: 'Doe' }, address: '261 Erdman Ford', city: 'East Daphne', state: 'Kentucky',group:"DYS-5", },
//   { id: 4, name: { firstName: 'John', lastName: 'Doe' }, address: '261 Erdman Ford', city: 'East Daphne', state: 'Kentucky',group:"DYS-4", },
//   { id: 5, name: { firstName: 'Jane', lastName: 'Doe' }, address: '769 Dominic Grove', city: 'Columbus', state: 'Ohio',group:"DYS-1", },
// ];

// const MyStudent = () => {
//   const [data, setData] = useState(initialData);
//   const [selectedRow, setSelectedRow] = useState<Person | null>(null);
//   const [open, setOpen] = useState(false);

//   const columns = useMemo<MRT_ColumnDef<Person>[]>(() => [
//     { accessorKey: 'name.firstName', header: 'First Name', size: 150 },
//     { accessorKey: 'name.lastName', header: 'Last Name', size: 150 },
//     { accessorKey: 'address', header: 'Address', size: 200 },
//     { accessorKey: 'group', header: 'Group', size: 200 },
//     { accessorKey: 'city', header: 'City', size: 150 },
//     { accessorKey: 'state', header: 'State', size: 150 },
//   ], []);

//   // Row click handler
//   const handleRowClick = (row: Person) => {
//     setSelectedRow(row);
//     setOpen(true);
//   };

//   return (
//     <>
//       <div className='bg-white mt-7 p-5 mb-5 rounded-md shadow-2xl'>
//         <MaterialReactTable 
//           columns={columns} 
//           data={data} 
//           enableSorting
//           getRowId={(row) => row.id.toString()} 
//           muiTableBodyRowProps={({ row }) => ({
//             onClick: () => handleRowClick(row.original),
//             style: { cursor: 'pointer' }
//           })}
//         />
//       </div>

//       {/* Beautiful Modal/Dialog */}

//       <EditModal isOpen={open}
//         closeModal={() => setOpen(false)}  selectedRow={selectedRow}/>
//     </>
//   );
// };

// export default MyStudent;

'use client';

import { useMemo, useState } from 'react';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { useRouter } from 'next/navigation';

// Example data type
type Person = {
  id: number;
  name: { firstName: string; lastName: string };
  dob: string;
  mobileNumber: string;
  frontlinerName: string;
  profession: string;
  address?: string;
  paymentGateway?: string;
  referral?: string;
  chantingRound?: number;
  email?: string;
  photo?: string;
  rating?: number;
  services?: string;
  city: string;
  state: string;
  permanentAddress?: string;
  remark?: string;
  skill?: string;
  comment?: string;
  interest?: string;
  hobby?: string;
  roles?: string;
  studyField?: string;
  fatherOccupation?: string;
  fatherNumber?: string;
  sankalpCamp?: boolean;
  classMode?: string;
  registrationDateTime?: string;
  paymentMode?: string;
  gender?: string;
  role?: string;
  facilitatorId?: string;
  paymentStatus?: string;
  studentStatus?: string;
  activeStatus?: string;
  group: string;
};

// Sample data with IDs
const initialData: Person[] = [
  {
    id: 1,
    name: { firstName: 'John', lastName: 'Doe' },
    dob: '2000-01-01',
    mobileNumber: '1234567890',
    frontlinerName: 'Admin',
    profession: 'Student',
    address: '261 Erdman Ford',
    paymentGateway: 'PayPal',
    referral: 'Friend',
    chantingRound: 16,
    email: 'john.doe@example.com',
    photo: 'john.jpg',
    rating: 4.5,
    services: 'Counseling',
    city: 'East Daphne',
    state: 'Kentucky',
    permanentAddress: '123 Main St',
    remark: 'Active Student',
    skill: 'Programming',
    comment: 'Good performance',
    interest: 'Coding',
    hobby: 'Reading',
    roles: 'Student',
    studyField: 'Computer Science',
    fatherOccupation: 'Engineer',
    fatherNumber: '9876543210',
    sankalpCamp: true,
    classMode: 'Online',
    registrationDateTime: '2025-01-01T10:00:00',
    paymentMode: 'Credit Card',
    gender: 'Male',
    role: 'Participant',
    facilitatorId: 'FAC123',
    paymentStatus: 'Paid',
    studentStatus: 'Active',
    activeStatus: 'Yes',
    group: 'DYS-1',
  },
];

const AllStudent = () => {
  const [data] = useState(initialData);
  const router = useRouter();

  const columns = useMemo<MRT_ColumnDef<Person>[]>(() => [
    { accessorKey: 'name.firstName', header: 'First Name', size: 150 },
    { accessorKey: 'name.lastName', header: 'Last Name', size: 150 },
    { accessorKey: 'dob', header: 'DOB', size: 100 },
    { accessorKey: 'mobileNumber', header: 'Mobile Number', size: 150 },
    { accessorKey: 'frontlinerName', header: 'Frontliner Name', size: 150 },
    { accessorKey: 'profession', header: 'Profession', size: 150 },
    { accessorKey: 'address', header: 'Address', size: 200 },
    { accessorKey: 'paymentGateway', header: 'Payment Gateway', size: 150 },
    { accessorKey: 'referral', header: 'Referral', size: 150 },
    { accessorKey: 'chantingRound', header: 'Chanting Round', size: 100 },
    { accessorKey: 'email', header: 'Email', size: 200 },
    { accessorKey: 'photo', header: 'Photo', size: 100 },
    { accessorKey: 'rating', header: 'Rating', size: 100 },
    { accessorKey: 'services', header: 'Services', size: 150 },
    { accessorKey: 'city', header: 'City', size: 150 },
    { accessorKey: 'state', header: 'State', size: 150 },
    { accessorKey: 'permanentAddress', header: 'Permanent Address', size: 200 },
    { accessorKey: 'remark', header: 'Remark', size: 200 },
    { accessorKey: 'skill', header: 'Skill', size: 150 },
    { accessorKey: 'comment', header: 'Comment', size: 200 },
    { accessorKey: 'interest', header: 'Interest', size: 150 },
    { accessorKey: 'hobby', header: 'Hobby', size: 150 },
    { accessorKey: 'roles', header: 'Roles', size: 150 },
    { accessorKey: 'studyField', header: 'Study Field', size: 150 },
    { accessorKey: 'fatherOccupation', header: 'Father Occupation', size: 150 },
    { accessorKey: 'fatherNumber', header: 'Father Number', size: 150 },
    { accessorKey: 'sankalpCamp', header: 'Sankalp Camp', size: 100 },
    { accessorKey: 'classMode', header: 'Class Mode', size: 150 },
    { accessorKey: 'registrationDateTime', header: 'Registration Date & Time', size: 200 },
    { accessorKey: 'paymentMode', header: 'Payment Mode', size: 150 },
    { accessorKey: 'gender', header: 'Gender', size: 100 },
    { accessorKey: 'role', header: 'Role', size: 150 },
    { accessorKey: 'facilitatorId', header: 'Facilitator ID', size: 150 },
    { accessorKey: 'paymentStatus', header: 'Payment Status', size: 150 },
    { accessorKey: 'studentStatus', header: 'Student Status', size: 150 },
    { accessorKey: 'activeStatus', header: 'Active Status', size: 150 },
    { accessorKey: 'group', header: 'Group', size: 100 },
    {
      accessorKey: 'edit',
      header: 'Edit',
      size: 100,
      Cell: ({ row }) => (
        <button
          className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600'
          onClick={() =>
            router.push(`/admin/allstudent/edit/${row.original.id}?data=${encodeURIComponent(JSON.stringify(row.original))}`)
          }
        >
          Edit
        </button>
      ),
    },
  ], [router]);

  return (
    <div className='bg-white mt-7 p-5 mb-5 rounded-md shadow-2xl'>
      <MaterialReactTable
        columns={columns}
        data={data}
        enableSorting
        getRowId={(row) => row.id.toString()}
        enableColumnResizing
        enableColumnOrdering
        enableStickyHeader
        muiTableContainerProps={{ sx: { maxWidth: '100%', overflowX: 'auto' } }}
        muiTableBodyCellProps={{ sx: { whiteSpace: 'nowrap' } }}
      />
    </div>
  );
};

export default AllStudent;


'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { toast, ToastContainer } from 'react-toastify';
import {
  getFrontlinerReport,
  frontlinerStudentById,
} from 'services/apiCollection';
import { FaCheckCircle, FaPhoneAlt, FaTimesCircle } from 'react-icons/fa';
import PaymentStatus from 'components/allifycomponents/callingSystem/PaymentStatus';
import Reports from 'components/allifycomponents/Reports';
import { FaWhatsapp } from 'react-icons/fa6';

interface Student {
  user_id: number;
  name: string;
  mobile_number: string;
  payment_mode: string;
  registration_date: string;
  student_status: string;
  student_status_date: string;
  profession: string;
  payment_status: string;
}

interface Frontliner {
  user_id: number;
  name: string;
  phone_number: string;
  role: string;
}

const FrontlinerRegistrationgPage = () => {
  const [allfrontlinerStudents, setAllFrontlinerStudents] = useState<Student[]>(
    [],
  );
  const [frontlinerReport, setFrontlinerReport] = useState<any>(null);
  const [selectedRow, setSelectedRow] = useState<Student | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);

  const { id: frontlinerId } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const frontlinerName = searchParams.get('frontlinerName');

  const fetchData = useCallback(async () => {
    if (!frontlinerId) return;
    setIsLoading(true);
    try {
      const [reportRes, allstudentRes] = await Promise.all([
        getFrontlinerReport(frontlinerId),
        frontlinerStudentById(frontlinerId),
      ]);
      setFrontlinerReport(reportRes[0]);
      setAllFrontlinerStudents(allstudentRes.users);
    } catch (err) {
      console.error('Error fetching data:', err);
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  }, [frontlinerId]);

  useEffect(() => {
    if (frontlinerId) fetchData();
  }, [frontlinerId, fetchData]);

  const refreshStudentAndReport = useCallback(async () => {
    if (!frontlinerId) return;
    try {
      const [allstudentRes, reportRes] = await Promise.all([
        frontlinerStudentById(frontlinerId),
        getFrontlinerReport(frontlinerId),
      ]);
      setAllFrontlinerStudents(allstudentRes.users);
      setFrontlinerReport(reportRes[0]);
    } catch (err) {
      console.error(err);
      toast.error('Failed to refresh data');
    }
  }, [frontlinerId]);

  const allstudentColumns = useMemo<MRT_ColumnDef<Student>[]>(
    () => [
      { accessorKey: 'name', header: 'Name', size: 180 },
      { accessorKey: 'payment_mode', header: 'Payment Mode', size: 80 },
      {
        accessorKey: 'registration_date',
        header: 'Registration Date',
        size: 180,
        Cell: ({ cell }) => {
          const raw = cell.getValue<string>();
          const date = new Date(raw);
          const formatted = date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          });
          return <span>{formatted}</span>;
        },
      },
      {
        accessorKey: 'payment_status',
        header: 'Payment Status',
        size: 150,
        Cell: ({ row, cell }) => {
          const value = cell.getValue<string>();
          const user = row.original;
          const paymentStatusMap: Record<string, string> = {
            received: 'Received',
            not_received: 'Not Received',
          };

          const handleClick = () => {
            if (value === 'not_received') {
              setSelectedRow(user);
              setPaymentModalOpen(true);
            }
          };

          return (
            <span
              onClick={handleClick}
              style={{
                color: value === 'received' ? 'green' : 'red',
                fontWeight: 'bold',
                cursor: value === 'not_received' ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {value === 'received' ? (
                <FaCheckCircle style={{ marginRight: '8px' }} />
              ) : (
                <FaTimesCircle style={{ marginRight: '8px' }} />
              )}
              {paymentStatusMap[value] || value}
            </span>
          );
        },
      },
     
      {
        accessorKey: 'phone_number',
        header: 'Phone Number',
        Cell: ({ row }) => (
          <div className="flex space-x-4">
            <a
              href={`https://wa.me/${row.original.mobile_number}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex transform items-center space-x-2 rounded-lg bg-green-600 px-4 py-2 text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-green-500"
            >
              <FaWhatsapp className="text-lg" />
              {/* <span className="text-sm md:text-base">WhatsApp</span> */}
            </a>
            <a
              href={`tel:${row.original.mobile_number}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex transform items-center space-x-2 rounded-lg bg-indigo-900 px-4 py-2 text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-indigo-800"
            >
              <FaPhoneAlt className="text-lg" />
              <span className="text-sm md:text-base">
                {row.original.mobile_number}
              </span>
            </a>
          </div>
        ),
      },
    ],
    [],
  );

  if (isLoading) {
    <>loading........</>;
  }
  return (
    <>
      <ToastContainer />
      <div className="mt-8">
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => router.back()}
            className="rounded-md bg-red-800 px-4 py-2 text-white hover:bg-red-700"
          >
            ← Back
          </button>
        </div>

        <h2 className="mb-5 text-lg font-bold dark:text-white">
          Frontliner {frontlinerName} Report
        </h2>
        <Reports report={frontlinerReport} />

        <div className="mt-5 rounded-md bg-white p-5 shadow-2xl">
          <>
            <h2 className="mb-10 text-lg font-bold ">
              Frontliner {frontlinerName} Registration
            </h2>
            <MaterialReactTable
              columns={allstudentColumns}
              data={allfrontlinerStudents}
              enableSorting
              onRowSelectionChange={setRowSelection}
              state={{ rowSelection }}
              getRowId={(row) => row.user_id.toString()}
              muiTableHeadCellProps={{
                sx: {
                  backgroundColor: '#312e81',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  borderRadius: '2px',
                },
              }}
            />
          </>
        </div>

        <PaymentStatus
          isOpens={paymentModalOpen}
          closeModal={() => setPaymentModalOpen(false)}
          selectedRow={selectedRow}
          onSuccess={refreshStudentAndReport}
        />
      </div>
    </>
  );
};

export default FrontlinerRegistrationgPage;

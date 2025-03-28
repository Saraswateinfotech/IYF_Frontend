'use client';
import { useEffect, useState } from 'react';
import { getFrontlinerReport } from 'services/apiCollection';
import { FaCalendarCheck, FaClock, FaUsers, FaWallet } from 'react-icons/fa6';

const FrontlinerReport = () => {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const calling_id = localStorage.getItem('frontlinerId');
        const data = await getFrontlinerReport(calling_id);
        setReport(data[0]);
      } catch (err) {
        console.error('Failed to fetch dashboard report:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  if (loading) return <div className="p-4">Loading dashboard...</div>;

  return (
    <div className="mt-8">
      <h2 className="mb-3 text-lg font-bold dark:text-white">
        Frontliner Report
      </h2>
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Total Registered */}
        <div className="flex items-center space-x-4 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
          <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
            <FaUsers className="text-blue-500 dark:text-blue-300" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
              Total Registered
            </h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {report.total_register}
            </p>
          </div>
        </div>

        {/* Total Amount */}
        <div className="flex items-center space-x-4 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
          <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
            <FaWallet
              className="text-green-500 dark:text-green-300"
              size={24}
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
              Total Amount
            </h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {report.total_amount}
            </p>
          </div>
        </div>

        {/* Pending Amount */}
        <div className="flex items-center space-x-4 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
          <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900">
            <FaClock
              className="text-yellow-500 dark:text-yellow-300"
              size={24}
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
              Pending Amount
            </h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {report.pending_amount}
            </p>
          </div>
        </div>

        {/* Weekly Registered */}
        <div className="flex items-center space-x-4 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
          <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900">
            <FaCalendarCheck
              className="text-purple-500 dark:text-purple-300"
              size={24}
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
              Weekly Registered
            </h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {report.weekly_total_registered_student_number}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrontlinerReport;

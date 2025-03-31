'use client';
import { FaCalendarCheck, FaClock, FaUsers, FaWallet } from 'react-icons/fa6';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';

const Reports = ({ report }: { report: any }) => {
  if (!report) {
    return <div>Loading Report...</div>;
  }
  return (
    <div>
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Total Registered */}
        <div className="flex items-center space-x-4 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
          <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
            <AiOutlineUsergroupAdd
              className="text-blue-500 dark:text-blue-300"
              size={24}
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
              Total Registered
            </h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {report.total_register || 0}
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
              {report.total_amount || 0}
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
              {report.pending_amount || 0}
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
              {report.weekly_total_registered_student_number || 0}
            </p>
          </div>
        </div>

        {/*Weekly Will Come Student */}
        <div className="flex items-center space-x-4 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
          <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900">
            <FaUsers className="text-blue-900 dark:text-blue-600" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-100">
              Weekly Will Come Student
            </h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {report.weekly_will_come_student_number || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;

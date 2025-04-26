'use client';

import { useEffect, useState } from 'react';
import {
  getStudentClassReport,
} from 'services/apiCollection';

const monthList = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DetailPanel = ({ user_id }: { user_id: number }) => {
    const [classReport, setClassReport] = useState<any[]>([]);
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
  
    const currentMonth = monthList[new Date().getMonth()];
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => `${currentYear - i}`);
  
    const [month, setMonth] = useState(currentMonth);
    const [year, setYear] = useState(`${currentYear}`);
  
    useEffect(() => {
      const fetchReport = async () => {
        try {
          const res = await getStudentClassReport(user_id);
          setClassReport(res);
        } finally {
          setLoading(false);
        }
      };
  
      fetchReport();
    }, [user_id]);
  
    useEffect(() => {
      if (!classReport.length) return;
  
      const filtered = classReport.filter((e) => {
        const d = new Date(e.class_date);
        return (
          monthList[d.getMonth()] === month && d.getFullYear().toString() === year
        );
      });
      setFilteredData(filtered);
    }, [classReport, month, year]);
  
    return (
      <div className="rounded-md bg-blue-50 p-4 text-sm">
        <div className="mb-6 flex gap-2 justify-end">
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="rounded w-44 border p-2 text-sm"
          >
            {monthList.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="rounded w-44 border p-2 text-sm"
          >
            {years.map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
        </div>
  
        {loading ? (
          <p>Loading…</p>
        ) : filteredData.length === 0 ? (
          <p className="flex justify-center">
            No class report for {month} {year}.
          </p>
        ) : (
          <ul className="space-y-2">
            {filteredData.map((e, i) => {
              const d = new Date(e.class_date);
              const formatted = d.toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                weekday: 'long',
              });
              const present = e.status?.toLowerCase().includes('present');
              return (
                <li
                  key={i}
                  className={`flex flex-wrap md:flex-nowrap justify-between items-center gap-2 rounded p-3 shadow-sm ${
                    present ? 'bg-green-100' : 'bg-red-100'
                  }`}
                >
                  <span className="w-full md:w-1/3 font-medium text-gray-800">
                    {formatted}
                  </span>
                  <span className="w-full md:w-1/3 flex items-center gap-2 font-semibold">
                    {present ? '✅ Present' : '❌ Absent'}
                  </span>
                  <span className="w-full md:w-1/3 text-xs text-gray-600">
                    Session: {e.AttendanceSession || '—'}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }

  export default DetailPanel;
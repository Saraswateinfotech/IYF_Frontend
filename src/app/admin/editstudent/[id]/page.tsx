'use client';

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { getStudentById, updateStudentById } from "services/apiCollection";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type StudentField = {
  name: string;
  label: string;
  type: string;
  placeholder: string;
};

const STUDENT_FIELDS: StudentField[] = [
  { name: "name", label: "Full Name", type: "text", placeholder: "Enter full name" },
  { name: "email", label: "Email", type: "email", placeholder: "Enter email" },
  { name: "dob", label: "Date of Birth", type: "date", placeholder: "Select date of birth" },
  { name: "gender", label: "Gender", type: "text", placeholder: "Enter gender" },
  { name: "mobile_number", label: "Mobile Number", type: "text", placeholder: "Enter mobile number" },
  { name: "father_number", label: "Father's Number", type: "text", placeholder: "Enter father's number" },
  { name: "father_occupation", label: "Father's Occupation", type: "text", placeholder: "Enter father's occupation" },
  { name: "address", label: "Current Address", type: "text", placeholder: "Enter current address" },
  { name: "permanent_address", label: "Permanent Address", type: "text", placeholder: "Enter permanent address" },
  { name: "city", label: "City", type: "text", placeholder: "Enter city" },
  { name: "state", label: "State", type: "text", placeholder: "Enter state" },
  { name: "profession", label: "Profession", type: "text", placeholder: "Enter profession" },
  { name: "study_field", label: "Field of Study", type: "text", placeholder: "Enter field of study" },
  { name: "hobby", label: "Hobby", type: "text", placeholder: "Enter hobby" },
  { name: "interest", label: "Interest", type: "text", placeholder: "Enter interest" },
  { name: "skill", label: "Skill", type: "text", placeholder: "Enter skill" },
  { name: "group_name", label: "Group Name", type: "text", placeholder: "Enter group name" },
  { name: "chanting_round", label: "Chanting Rounds", type: "number", placeholder: "Enter chanting rounds" },
  { name: "sankalp_camp", label: "Sankalp Camp", type: "number", placeholder: "Enter sankalp camp count" },
  { name: "class_mode", label: "Class Mode", type: "text", placeholder: "Enter class mode" },
  { name: "payment_mode", label: "Payment Mode", type: "text", placeholder: "Enter payment mode" },
  { name: "payment_amount", label: "Payment Amount", type: "text", placeholder: "Enter payment amount" },
  { name: "student_status", label: "Student Status", type: "text", placeholder: "Enter student status" },
  { name: "frontliner_name", label: "Frontliner Name", type: "text", placeholder: "Enter frontliner name" },
  { name: "rating", label: "Rating", type: "number", placeholder: "Enter rating" },
  { name: "remark", label: "Remark", type: "text", placeholder: "Enter remark" },
  { name: "comment", label: "Comment", type: "text", placeholder: "Enter comment" },
];

export default function EditStudentPage() {
  const { id } = useParams();
  const [studentData, setStudentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [darkMode, setDarkMode] = useState(document.body.classList.contains('dark'));

  // Sync darkMode state with document.body.classList
  useEffect(() => {
    const updateDarkMode = () => {
      const isDark = document.body.classList.contains('dark');
      setDarkMode(isDark);
    };

    updateDarkMode();

    const observer = new MutationObserver(updateDarkMode);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const initializeNullFields = useCallback((userData: any) => {
    const initialized = { ...userData };
    STUDENT_FIELDS.forEach(field => {
      if (initialized[field.name] === null || initialized[field.name] === undefined) {
        initialized[field.name] = field.type === "number" ? 0 : null;
      }
    });
    return initialized;
  }, []);

  const fetchStudent = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getStudentById(id as string);
      const initializedData = { user: initializeNullFields(data.user) };
      setStudentData(initializedData);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load student data");
    } finally {
      setLoading(false);
    }
  }, [id, initializeNullFields]);

  useEffect(() => {
    if (id) fetchStudent();
  }, [id, fetchStudent]);

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      await updateStudentById(id as string, studentData.user);
      toast.success("Student updated successfully!");
      setTimeout(() => {
        window.history.back();
      }, 2000);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update student");
    } finally {
      setUpdating(false);
    }
  };

  const handleChange = (field: string, value: string | number | null) => {
    setStudentData((prev: any) => ({
      ...prev,
      user: {
        ...prev.user,
        [field]: value === "" ? null : value
      }
    }));
  };

  const formatDateValue = (value: string | null, type: string) => {
    if (!value) return "";
    try {
      const date = new Date(value);
      if (isNaN(date.getTime())) return "";
      if (type === "datetime-local") {
        return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16);
      }
      return date.toISOString().split("T")[0];
    } catch {
      return "";
    }
  };

  const renderField = (field: StudentField) => {
    if (!studentData) return null;
    const value = studentData.user[field.name];
    const displayValue = field.type.includes("date")
      ? formatDateValue(value, field.type)
      : value;

    return (
      <div key={field.name} className="space-y-1">
        <label
          htmlFor={field.name}
          className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
        >
          {field.label}
        </label>
        <input
          id={field.name}
          className={`w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
          type={field.type}
          placeholder={field.placeholder}
          value={displayValue || ""}
          onChange={(e) => handleChange(
            field.name,
            field.type === "number" ? parseInt(e.target.value) || null : e.target.value || null
          )}
        />
      </div>
    );
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${darkMode ? 'border-blue-300' : 'border-blue-500'}`}></div>
    </div>
  );

  if (error) return (
    <div className={`p-4 ${darkMode ? 'text-red-400' : 'text-red-500'}`}>
      {error}
      <button
        onClick={fetchStudent}
        className={`ml-4 px-3 py-1 rounded ${darkMode ? 'bg-blue-800 text-blue-200 hover:bg-blue-700' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
      >
        Retry
      </button>
    </div>
  );

  if (!studentData) return (
    <div className={`p-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
      No student found.
    </div>
  );

  return (
    <>
      <style jsx global>{`
        .Toastify__toast {
          color: ${darkMode ? '#ffffff' : '#000000'} !important;
          background-color: ${darkMode ? '#2d396b' : '#ffffff'} !important;
          border: 1px solid ${darkMode ? '#374151' : '#e5e7eb'} !important;
        }
        .Toastify__toast--success {
          background-color: ${darkMode ? '#1a4a3b' : '#e6fffa'} !important;
          color: ${darkMode ? '#34d399' : '#38a169'} !important;
        }
        .Toastify__toast--error {
          background-color: ${darkMode ? '#4a1a1a' : '#fff1f0'} !important;
          color: ${darkMode ? '#f87171' : '#e53e3e'} !important;
        }
        .Toastify__progress-bar {
          background-color: ${darkMode ? '#4b5563' : '#cbd5e0'} !important;
        }
      `}</style>

      <div className={`p-4 max-w-6xl mx-auto ${darkMode ? 'bg-gray-900' : 'inherit'}`}>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={darkMode ? 'dark' : 'light'}
        />
        <h1 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Edit Student
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STUDENT_FIELDS.map(renderField)}
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={() => window.history.back()}
            className={`px-4 py-2 border rounded-md
              ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={updating}
            className={`px-6 py-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2
              ${updating
                ? (darkMode ? 'bg-blue-500 cursor-not-allowed' : 'bg-blue-400 cursor-not-allowed')
                : (darkMode ? 'bg-blue-700 hover:bg-blue-600 focus:ring-blue-400' : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500')}`}
          >
            {updating ? "Updating..." : "Update Student"}
          </button>
        </div>
      </div>
    </>
  );
}
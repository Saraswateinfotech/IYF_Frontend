
'use client';


import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const EditModal = ({ isOpen, closeModal, selectedRow }) => {
  const [studentData, setStudentData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    group: "",
  });

  const groups = [
    { name: "DYS-1" },
    { name: "DYS-2" },
    { name: "DYS-3" },
    { name: "DYS-4" },
    { name: "DYS-5" },
    { name: "DYS-6" },
    { name: "DYS-7" },
    { name: "Nachiketa" },
    { name: "Sahdev" },
    { name: "Nakul" },
  ];

  useEffect(() => {
    if (selectedRow) {
      setStudentData({
        firstName: selectedRow?.name?.firstName || "",
        lastName: selectedRow?.name?.lastName || "",
        address: selectedRow?.address || "",
        city: selectedRow?.city || "",
        state: selectedRow?.state || "",
        group: selectedRow?.group || "",
      });
    }
  }, [selectedRow]);

  const handleSubmit = async () => {
    try {
      const response = await fetch(`/api/edit-student/${selectedRow.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData),
      });

      const result = await response.json();
      if (response.ok) {
        closeModal();
      } else {
        console.error("Error:", result.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-md z-50 p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg relative">
        <button onClick={closeModal} className="absolute top-3 right-3 text-gray-700">
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold mb-4 text-center">Edit Student Details</h2>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="First Name"
            className="border p-2 w-full rounded"
            value={studentData.firstName}
            onChange={(e) => setStudentData({ ...studentData, firstName: e.target.value })}
          />
          <input
            type="text"
            placeholder="Last Name"
            className="border p-2 w-full rounded"
            value={studentData.lastName}
            onChange={(e) => setStudentData({ ...studentData, lastName: e.target.value })}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-2 w-full rounded"
            value={studentData.address}
            onChange={(e) => setStudentData({ ...studentData, address: e.target.value })}
          />
          <input
            type="text"
            placeholder="City"
            className="border p-2 w-full rounded"
            value={studentData.city}
            onChange={(e) => setStudentData({ ...studentData, city: e.target.value })}
          />
          <input
            type="text"
            placeholder="State"
            className="border p-2 w-full rounded"
            value={studentData.state}
            onChange={(e) => setStudentData({ ...studentData, state: e.target.value })}
          />
          <select
            className="border p-2 w-full rounded"
            value={studentData.group}
            onChange={(e) => setStudentData({ ...studentData, group: e.target.value })}
          >
            <option value="">Select Group</option>
            {groups.map((group, index) => (
              <option key={index} value={group.name}>{group.name}</option>
            ))}
          </select>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition"
          >
           Upgrade And Edit Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;

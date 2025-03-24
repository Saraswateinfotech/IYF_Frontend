// 'use client';
// import React from 'react';



// const edit = () => {
//   return (
//  <>
//  <p>ivfdhjfbveeeeeeeeeee</p>
//  </>
//   );
// };

// export default edit;




"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { ArrowLeft } from "lucide-react";

const EditPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    id: "",
    name: { firstName: "", lastName: "" },
    dob: "",
    mobileNumber: "",
    frontlinerName: "",
    profession: "",
    address: "",
    paymentGateway: "",
    referral: "",
    chantingRound: "",
    email: "",
    photo: "",
    rating: "",
    services: "",
    city: "",
    state: "",
    permanentAddress: "",
    remark: "",
    skill: "",
    comment: "",
    interest: "",
    hobby: "",
    roles: "",
    studyField: "",
    fatherOccupation: "",
    fatherNumber: "",
    sankalpCamp: false,
    classMode: "",
    registrationDateTime: "",
    paymentMode: "",
    gender: "",
    role: "",
    facilitatorId: "",
    paymentStatus: "",
    studentStatus: "",
    activeStatus: "",
    group: "",
  });

  useEffect(() => {
    const dataParam = searchParams.get("data");
    if (dataParam) {
      const parsedData = JSON.parse(decodeURIComponent(dataParam));
      setFormData(parsedData);
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent] || {}),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("/api/student", formData);
      alert("Data saved successfully");
      router.push("/admin/allstudent");
    } catch (error) {
      console.error("Failed to save data", error);
      alert("Failed to save data");
    }
  };

  return (
    <div className="min-h-screen dark:text-white transition-colors duration-500 p-4 mt-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Edit Student</h2>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="font-medium">First Name</label>
          <input
            type="text"
            name="name.firstName"
            value={formData.name.firstName || ""}
            onChange={handleChange}
            className="p-2 border rounded-md bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-black dark:text-white"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-medium">Last Name</label>
          <input
            type="text"
            name="name.lastName"
            value={formData.name.lastName || ""}
            onChange={handleChange}
            className="p-2 border rounded-md bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-black dark:text-white"
          />
        </div>

        {Object.entries(formData).map(([key, value]) => {
          if (key === "name" || key === "id") return null;

          if (typeof value === "boolean") {
            return (
              <div key={key} className="flex flex-col">
                <label className="font-medium">{key}</label>
                <select
                  name={key}
                  value={value ? "true" : "false"}
                  onChange={(e) => handleChange({ target: { name: key, value: e.target.value === "true" } })}
                  className="p-2 border rounded-md bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-black dark:text-white"
                >
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>
              </div>
            );
          }

          if (typeof value === "object") return null;

          return (
            <div key={key} className="flex flex-col">
              <label className="font-medium">{key}</label>
              <input
                type="text"
                name={key}
                value={value || ""}
                onChange={handleChange}
                className="p-2 border rounded-md bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-black dark:text-white"
              />
            </div>
          );
        })}

        <button
          type="submit"
          className="col-span-2 p-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default EditPage;

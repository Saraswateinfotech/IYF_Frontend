"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { updateStudentById } from "services/apiCollection";

const labelMap: Record<string, string> = {
  name: "Name",
  dob: "Date of Birth",
  mobile_number: "Mobile Number",
  address: "Address",
  class_mode: "Class Mode",
  chanting_round: "Chanting Rounds",
  email: "Email",
  photo: "Photo URL",
  rating: "Rating (1-10)",
  services: "Services",
  city: "City",
  state: "State",
  permanent_address: "Permanent Address",
  remark: "Remark",
  skill: "Skills",
  comment: "Comment",
  interest: "Interest",
  hobby: "Hobby",
  study_field: "Study Field",
  father_occupation: "Father's Occupation",
  father_number: "Father's Contact Number",
  sankalp_camp: "Sankalp Camp Attended",
  gender: "Gender",
  profession: "Profession",
};

const EditPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    mobile_number: "",
    address: "",
    class_mode: "",
    chanting_round: "",
    email: "",
    photo: "",
    rating: 1, // Default to 1 for rating
    services: "",
    city: "",
    state: "",
    permanent_address: "",
    remark: "",
    skill: "",
    comment: "",
    interest: "",
    hobby: "",
    study_field: "",
    father_occupation: "",
    father_number: "",
    sankalp_camp: "",
    gender: "",
    profession: "student", // Default profession to "student"
    user_id: "", // Added user_id to the formData state
  });

  useEffect(() => {
    const dataParam = searchParams.get("data");
    if (dataParam) {
      const parsedData = JSON.parse(decodeURIComponent(dataParam));
      setFormData({ ...parsedData, user_id: parsedData.user_id || parsedData.id });
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, Math.min(10, Number(e.target.value))); // Ensure value is between 1 and 10
    setFormData((prev) => ({ ...prev, rating: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user_id = formData.user_id;
      await updateStudentById(user_id, formData);
      toast.success("Student updated successfully!");
      setTimeout(() => {
        router.back();
      }, 1000);
    } catch (error) {
      console.error("Failed to save data", error);
      toast.error("Failed to update student!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen dark:text-white transition-colors duration-500 p-4 mt-5">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Edit Student Details</h2>
          <button
            onClick={() => router.back()}
            className="rounded-md bg-red-800 px-4 py-2 text-white hover:bg-red-700"
          >
            ← Back
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(formData).map(([key, value]) => {
            // Skip fields that should not be in the form
            const skippedFields = [
              "user_id", "frontliner_name", "payment_mode", "payment_status", 
              "payment_amount", "referral_user_id", "registration_date", 
              "student_status", "facilitatorId", "facilitator_id", "razorpay_payment_id", 
              "frontliner_id", "calling_id", "student_status_date", "batch_id"
            ];
            if (skippedFields.includes(key)) return null;

            return (
              <div key={key} className="flex flex-col">
                <label className="font-medium mb-1">
                  {labelMap[key] || key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}
                </label>
                {key === "dob" ? (
                  <input
                    type="date"
                    name={key}
                    value={value || ""}
                    onChange={handleChange}
                    className="p-2 border rounded-md bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-black dark:text-white"
                  />
                ) : key === "rating" ? (
                  <input
                    type="number"
                    name={key}
                    value={value || 1}
                    onChange={handleRatingChange}
                    min={1}
                    max={10}
                    className="p-2 border rounded-md bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-black dark:text-white"
                  />
                ) : key === "profession" ? (
                  <select
                    name={key}
                    value={value || "student"}
                    onChange={handleChange}
                    className="p-2 border rounded-md bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-black dark:text-white">
                    <option value="student">Student</option>
                    <option value="job_candidate">Job Candidate</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    name={key}
                    value={value || ""}
                    onChange={handleChange}
                    className="p-2 border rounded-md bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-black dark:text-white"
                  />
                )}
              </div>
            );
          })}

          <button
            type="submit"
            disabled={isLoading}
            className={`col-span-1 sm:col-span-2 mt-6 p-3 rounded-md text-white font-semibold ${
              isLoading ? "bg-gray-600 cursor-not-allowed" : "bg-blue-900 hover:bg-blue-800"
            }`}
          >
            {isLoading ? "Updating..." : "Update Student"}
          </button>
        </form>
      </div>
    </>
  );
};

export default EditPage;

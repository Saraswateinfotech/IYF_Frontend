"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { updateStudentById } from "services/apiCollection";

const EditPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    user_id: "",  
    name: "",
    dob: "",
    mobile_number: "",
    frontliner_name: "",
    profession: "",
    address: "",
    class_mode: "",
    payment_mode: "",
    payment_amount: "",
    payment_status: "",
    referral_user_id: "",
    chanting_round: "",
    email: "",
    photo: "",
    rating: "",
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
    registration_date: "",
    gender: "",
    student_status: "",
    facilitator_id: "",
    razorpay_payment_id: "",
  });

  useEffect(() => {
    const dataParam = searchParams.get("data");
    if (dataParam) {
      const parsedData = JSON.parse(decodeURIComponent(dataParam));
      setFormData({ ...parsedData, user_id: parsedData.user_id || parsedData.id });
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Edit Student</h2>
          {/* Back Button */}
     <div className="flex justify-end">
          <button
            onClick={() => router.back()}
            className="rounded-md bg-red-800 px-4 py-2 text-white hover:bg-red-700"
          >
            ← Back
          </button>
        </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          {Object.entries(formData).map(([key, value]) => {
            if (key === "id") return null; // optional skip

            if (typeof value === "boolean") {
              return (
                <div key={key} className="flex flex-col">
                  <label className="font-medium">{key}</label>
                  <select
                    name={key}
                    value={value ? "true" : "false"}
                    onChange={(e) =>
                      handleChange({
                        target: {
                          name: key,
                          value: e.target.value === "true",
                        },
                      })
                    }
                    className="p-2 border rounded-md bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-black dark:text-white"
                  >
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                </div>
              );
            }

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
            disabled={isLoading}
            className={`col-span-2 p-2 rounded-md text-white transition ${
              isLoading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gray-900 hover:bg-gray-800"
            }`}
          >
            {isLoading ? "Updating..." : "Update"}
          </button>
        </form>
      </div>
    </>
  );
};

export default EditPage;
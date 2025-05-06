"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { getStudentById, updateStudentById } from "services/apiCollection";
import { toast, ToastContainer } from "react-toastify";

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
//   { name: "calling_id", label: "Calling ID", type: "text", placeholder: "Enter calling ID" },
  { name: "chanting_round", label: "Chanting Rounds", type: "number", placeholder: "Enter chanting rounds" },
  { name: "sankalp_camp", label: "Sankalp Camp", type: "number", placeholder: "Enter sankalp camp count" },
  { name: "class_mode", label: "Class Mode", type: "text", placeholder: "Enter class mode" },
  { name: "payment_mode", label: "Payment Mode", type: "text", placeholder: "Enter payment mode" },
  { name: "payment_amount", label: "Payment Amount", type: "text", placeholder: "Enter payment amount" },
//   { name: "payment_status", label: "Payment Status", type: "text", placeholder: "Enter payment status" },
//   { name: "razorpay_payment_id", label: "Razorpay ID", type: "text", placeholder: "Enter Razorpay ID" },
  { name: "student_status", label: "Student Status", type: "text", placeholder: "Enter student status" },
  { name: "frontliner_name", label: "Frontliner Name", type: "text", placeholder: "Enter frontliner name" },
//   { name: "frontliner_id", label: "Frontliner ID", type: "text", placeholder: "Enter frontliner ID" },
//   { name: "facilitator_id", label: "Facilitator ID", type: "text", placeholder: "Enter facilitator ID" },
  { name: "rating", label: "Rating", type: "number", placeholder: "Enter rating" },
  { name: "remark", label: "Remark", type: "text", placeholder: "Enter remark" },
  { name: "comment", label: "Comment", type: "text", placeholder: "Enter comment" },
//   { name: "registration_date", label: "Registration Date", type: "datetime-local", placeholder: "Select registration date" },
//   { name: "student_status_date", label: "Status Date", type: "datetime-local", placeholder: "Select status date" },
];

export default function EditStudentPage() {
  const { id } = useParams();
  const [studentData, setStudentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false); // नया state: button loading के लिए

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
        <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
          {field.label}
        </label>
        <input
          id={field.name}
          className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="p-4 text-red-500">
      {error}
      <button
        onClick={fetchStudent}
        className="ml-4 bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
      >
        Retry
      </button>
    </div>
  );

  if (!studentData) return (
    <div className="p-4 text-gray-500">No student found.</div>
  );

  return (
    <div className="p-4 max-w-6xl mx-auto">
        <ToastContainer/>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Student</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {STUDENT_FIELDS.map(renderField)}
      </div>

      <div className="mt-8 flex justify-end space-x-4">
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleUpdate}
          disabled={updating}
          className={`px-6 py-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2
            ${updating ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"}
          `}
        >
          {updating ? "Updating..." : "Update Student"}
        </button>
      </div>
    </div>
  );
}








// "use client";

// import { useEffect, useState, useCallback } from "react";
// import { useParams } from "next/navigation";
// import { getStudentById, updateStudentById } from "services/apiCollection";
// import { toast, ToastContainer } from "react-toastify";
// import dynamic from "next/dynamic";

// const MapWithNoSSR = dynamic(() => import("../../../../components/allifycomponents/StudentLocation/StudentLocationMap"), {
//   ssr: false
// });

// type StudentField = {
//   name: string;
//   label: string;
//   type: string;
//   placeholder: string;
// };

// const STUDENT_FIELDS: StudentField[] = [
//   { name: "name", label: "Full Name", type: "text", placeholder: "Enter full name" },
//   { name: "email", label: "Email", type: "email", placeholder: "Enter email" },
//   { name: "dob", label: "Date of Birth", type: "date", placeholder: "Select date of birth" },
//   { name: "gender", label: "Gender", type: "text", placeholder: "Enter gender" },
//   { name: "mobile_number", label: "Mobile Number", type: "text", placeholder: "Enter mobile number" },
//   { name: "father_number", label: "Father's Number", type: "text", placeholder: "Enter father's number" },
//   { name: "father_occupation", label: "Father's Occupation", type: "text", placeholder: "Enter father's occupation" },
//   { name: "address", label: "Current Address", type: "text", placeholder: "Enter current address" },
//   { name: "permanent_address", label: "Permanent Address", type: "text", placeholder: "Enter permanent address" },
//   { name: "city", label: "City", type: "text", placeholder: "Enter city" },
//   { name: "state", label: "State", type: "text", placeholder: "Enter state" },
//   { name: "profession", label: "Profession", type: "text", placeholder: "Enter profession" },
//   { name: "study_field", label: "Field of Study", type: "text", placeholder: "Enter field of study" },
//   { name: "hobby", label: "Hobby", type: "text", placeholder: "Enter hobby" },
//   { name: "interest", label: "Interest", type: "text", placeholder: "Enter interest" },
//   { name: "skill", label: "Skill", type: "text", placeholder: "Enter skill" },
//   { name: "group_name", label: "Group Name", type: "text", placeholder: "Enter group name" },
//   { name: "chanting_round", label: "Chanting Rounds", type: "number", placeholder: "Enter chanting rounds" },
//   { name: "sankalp_camp", label: "Sankalp Camp", type: "number", placeholder: "Enter sankalp camp count" },
//   { name: "class_mode", label: "Class Mode", type: "text", placeholder: "Enter class mode" },
//   { name: "payment_mode", label: "Payment Mode", type: "text", placeholder: "Enter payment mode" },
//   { name: "payment_amount", label: "Payment Amount", type: "text", placeholder: "Enter payment amount" },
//   { name: "student_status", label: "Student Status", type: "text", placeholder: "Enter student status" },
//   { name: "frontliner_name", label: "Frontliner Name", type: "text", placeholder: "Enter frontliner name" },
//   { name: "rating", label: "Rating", type: "number", placeholder: "Enter rating" },
//   { name: "remark", label: "Remark", type: "text", placeholder: "Enter remark" },
//   { name: "comment", label: "Comment", type: "text", placeholder: "Enter comment" },
//   { name: "latitude", label: "Latitude", type: "number", placeholder: "Enter latitude" },
//   { name: "longitude", label: "Longitude", type: "number", placeholder: "Enter longitude" },
//   { name: "location_address", label: "Location Address", type: "text", placeholder: "Enter location address" },
// ];

// export default function EditStudentPage() {
//   const { id } = useParams();
//   const [studentData, setStudentData] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [updating, setUpdating] = useState(false);
//   const [showMap, setShowMap] = useState(false);

//   const initializeNullFields = useCallback((userData: any) => {
//     const initialized = { ...userData };
//     STUDENT_FIELDS.forEach(field => {
//       if (initialized[field.name] === null || initialized[field.name] === undefined) {
//         initialized[field.name] = field.type === "number" ? 0 : null;
//       }
//     });
//     return initialized;
//   }, []);

//   const fetchStudent = useCallback(async () => {
//     try {
//       setLoading(true);
//       const data = await getStudentById(id as string);
//       const initializedData = { user: initializeNullFields(data.user) };
//       setStudentData(initializedData);
//       setError(null);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to load student data");
//     } finally {
//       setLoading(false);
//     }
//   }, [id, initializeNullFields]);

//   useEffect(() => {
//     if (id) fetchStudent();
//   }, [id, fetchStudent]);

//   const handleUpdate = async () => {
//     try {
//       setUpdating(true);
//       await updateStudentById(id as string, studentData.user);
//       toast.success("Student updated successfully!");
//       setTimeout(() => {
//         window.history.back();
//       }, 2000); 
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to update student");
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const handleChange = (field: string, value: string | number | null) => {
//     setStudentData((prev: any) => ({
//       ...prev,
//       user: {
//         ...prev.user,
//         [field]: value === "" ? null : value
//       }
//     }));
//   };

//   const handleLocationSelect = (lat: number, lng: number, address: string) => {
//     setStudentData((prev: any) => ({
//       ...prev,
//       user: {
//         ...prev.user,
//         latitude: lat,
//         longitude: lng,
//         location_address: address
//       }
//     }));
//     setShowMap(false);
//     toast.success("Location selected successfully!");
//   };

//   const formatDateValue = (value: string | null, type: string) => {
//     if (!value) return "";
//     try {
//       const date = new Date(value);
//       if (isNaN(date.getTime())) return "";
//       if (type === "datetime-local") {
//         return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
//           .toISOString()
//           .slice(0, 16);
//       }
//       return date.toISOString().split("T")[0];
//     } catch {
//       return "";
//     }
//   };

//   const renderField = (field: StudentField) => {
//     if (!studentData) return null;
//     const value = studentData.user[field.name];
//     const displayValue = field.type.includes("date")
//       ? formatDateValue(value, field.type)
//       : value;

//     return (
//       <div key={field.name} className="space-y-1">
//         <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
//           {field.label}
//         </label>
//         <input
//           id={field.name}
//           className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//           type={field.type}
//           placeholder={field.placeholder}
//           value={displayValue || ""}
//           onChange={(e) => handleChange(
//             field.name,
//             field.type === "number" ? parseInt(e.target.value) || null : e.target.value || null
//           )}
//         />
//       </div>
//     );
//   };

//   const renderLocationFields = () => {
//     if (!studentData) return null;

//     return (
//       <div className="space-y-4 col-span-full">
//         <h3 className="text-lg font-medium text-gray-900">Location Information</h3>
        
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div className="space-y-1">
//             <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
//               Latitude
//             </label>
//             <input
//               id="latitude"
//               className="w-full border p-2 rounded-md"
//               type="number"
//               placeholder="Enter latitude"
//               value={studentData.user.latitude || ""}
//               onChange={(e) => handleChange("latitude", parseFloat(e.target.value) || null)}
//             />
//           </div>
          
//           <div className="space-y-1">
//             <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
//               Longitude
//             </label>
//             <input
//               id="longitude"
//               className="w-full border p-2 rounded-md"
//               type="number"
//               placeholder="Enter longitude"
//               value={studentData.user.longitude || ""}
//               onChange={(e) => handleChange("longitude", parseFloat(e.target.value) || null)}
//             />
//           </div>
          
//           <div className="space-y-1">
//             <label htmlFor="location_address" className="block text-sm font-medium text-gray-700">
//               Address
//             </label>
//             <input
//               id="location_address"
//               className="w-full border p-2 rounded-md"
//               type="text"
//               placeholder="Enter location address"
//               value={studentData.user.location_address || ""}
//               onChange={(e) => handleChange("location_address", e.target.value || null)}
//             />
//           </div>
//         </div>
        
//         <button
//           type="button"
//           onClick={() => setShowMap(!showMap)}
//           className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
//         >
//           {showMap ? "Hide Map" : "Select Location on Map"}
//         </button>
        
//         {showMap && (
//           <div className="mt-4 h-96 w-full rounded-md overflow-hidden border">
//             <MapWithNoSSR 
//               onLocationSelect={handleLocationSelect}
//               initialLocation={
//                 studentData.user.latitude && studentData.user.longitude ? {
//                   lat: studentData.user.latitude,
//                   lng: studentData.user.longitude
//                 } : null
//               }
//             />
//           </div>
//         )}
//       </div>
//     );
//   };

//   if (loading) return (
//     <div className="flex justify-center items-center h-64">
//       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//     </div>
//   );

//   if (error) return (
//     <div className="p-4 text-red-500">
//       {error}
//       <button
//         onClick={fetchStudent}
//         className="ml-4 bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
//       >
//         Retry
//       </button>
//     </div>
//   );

//   if (!studentData) return (
//     <div className="p-4 text-gray-500">No student found.</div>
//   );

//   return (
//     <div className="p-4 max-w-6xl mx-auto">
//       <ToastContainer/>
//       <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Student</h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {STUDENT_FIELDS.filter(field => !['latitude', 'longitude', 'location_address'].includes(field.name))
//           .map(renderField)}
//         {renderLocationFields()}
//       </div>

//       <div className="mt-8 flex justify-end space-x-4">
//         <button
//           onClick={() => window.history.back()}
//           className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//         >
//           Cancel
//         </button>
//         <button
//           onClick={handleUpdate}
//           disabled={updating}
//           className={`px-6 py-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2
//             ${updating ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"}
//           `}
//         >
//           {updating ? "Updating..." : "Update Student"}
//         </button>
//       </div>
//     </div>
//   );
// }
import api from "./api"; 

export const fetchDashboardAccounts = async () => {
  try {
    const response = await api.get("/auth/getDashboard");
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard accounts:", error);
    throw error;
  }
};

export const deleteDashboardAccount = async (user_id) => {
  try {
    const response = await api.delete(`/auth/deleteDashboard/${user_id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting dashboard account:", error);
    throw error;
  }
};



export const submitRegistrationForm = async (formData) => {
  try {
    const response = await api.post("/students/save", {
      name: formData.name,
      dob: formData.dob,
      mobile_number: formData.mobile,
      frontliner_name: formData.frontlinerName,
      profession: formData.profession.toLowerCase().replace(" ", "_"),
      address: formData.address,
      class_mode: formData.classMode.toLowerCase(),
      payment_mode: formData.paymentMethod.toLowerCase(),
      payment_amount: formData.amount,
      payment_status:formData.payment_status,
      razorpay_payment_id: formData.razorpay_payment_id || null,
    });

    return response.data;
  } catch (error) {
    console.error("Error submitting registration form:", error);
    throw error;
  }
};


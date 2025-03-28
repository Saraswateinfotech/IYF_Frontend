import api from './api';

export const fetchDashboardAccounts = async () => {
  try {
    const response = await api.get('/auth/getDashboard');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard accounts:', error);
    throw error;
  }
};

export const deleteDashboardAccount = async (user_id) => {
  try {
    const response = await api.delete(`/auth/deleteDashboard/${user_id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting dashboard account:', error);
    throw error;
  }
};

export const submitRegistrationForm = async (formData) => {
  try {
    const response = await api.post('/students/save', {
      name: formData.name,
      dob: formData.dob,
      mobile_number: formData.mobile,
      frontliner_id: formData.frontlinerid,
      profession: formData.profession.toLowerCase().replace(' ', '_'),
      address: formData.address,
      class_mode: formData.classMode.toLowerCase(),
      payment_mode: formData.paymentMethod.toLowerCase(),
      payment_amount: formData.amount,
      payment_status: formData.payment_status,
      razorpay_payment_id: formData.razorpay_payment_id || null,
    });

    return response.data;
  } catch (error) {
    console.error('Error submitting registration form:', error);
    throw error;
  }
};

export const fetchAllStudents = async () => {
  try {
    const response = await api.get('/students/allStudents');
    return response.data;
  } catch (error) {
    console.error('Error fetching all students:', error);
    throw error;
  }
};

export const updateStudentById = async (user_id, data) => {
  try {
    const response = await api.put(`/students/allStudent/id/${user_id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating student:', error);
    throw error;
  }
};

export const frontlinerStudentById = async (frontlinerId) => {
  try {
    const response = await api.post('/students/frontliner/id', {
      frontlinerId,
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching students by frontliner ID:', error);
    throw error;
  }
};

export const updateCallingId = async (user_ids, calling_id) => {
  try {
    const response = await api.post(`/students/update-calling-id`, {
      user_ids: user_ids,
      calling_id: calling_id,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating calling_id:', error);
    throw error;
  }
};

export const getUserByCallingId = async () => {
  try {
    const calling_id = localStorage.getItem('frontlinerId');
    if (!calling_id) {
      throw new Error('No calling_id found in localStorage');
    }

    const response = await api.get(
      `/students/user-by-calling-id/${calling_id}`,
    );
    return response.data;
  } catch (error) {
    console.error(
      'Error fetching users by calling ID:',
      error?.response?.data || error.message,
    );
    throw error;
  }
};

export const getdashboardReport = async () => {
  try {
    const response = await api.get(`/dashboar/dashboard-report`);
    return response.data;
  } catch (error) {
    console.error('Error fetching getdashboardReport',
      error?.response?.data || error.message,
    );
    throw error;
  }
};

export const updateStudentStatus = async (useId, studentStatus) => {
  try {
    const response = await api.post(`/students/update-student-status`, {
      user_id: useId,
      student_status: studentStatus,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating Student Status:', error);
    throw error;
  }
};


export const getFrontlinerReport = async (calling_id) => {
  try {

    const response = await api.get(`/dashboar/frontliner-report/${calling_id}`);
    return response.data;
  } catch (error) {
    console.error(
      'Error fetching get frontliner Report',
      error?.response?.data || error.message,
    );
    throw error;
  }
};


export const updatePaymentStatus = async (user_id, payment_status) => {
  try {
    const response = await api.post('/students/update-payment-status', {
      user_id,
      payment_status,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
};
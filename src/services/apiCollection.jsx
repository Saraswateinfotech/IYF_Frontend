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
export const fetchAllFacilitatorOrFrontliner = async () => {
  try {
    const response = await api.get('/students/allFacilitatorOrFrontliner');
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
      calling_id: formData.frontlinerid,
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
    const response = await api.put(`/students/updateStudentById/id/${user_id}`, data);
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
export const frontlinerStudentByIdOfcallingId = async (frontliner_id) => {
  try {
    const response = await api.get(
      `/students/frontlinerStudentByIdOfcallingId/${frontliner_id}`,
    );
    return response.data;
  } catch (error) {
    console.error(
      'Error fetching users by calling assing user ID:',
      error?.response?.data || error.message,
    );
    throw error;
  }
};

export const getdashboardReport = async () => {
  try {
    const response = await api.get(`/dashboard/dashboard-report`);
    return response.data;
  } catch (error) {
    console.error(
      'Error fetching getdashboardReport',
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
    const response = await api.get(`/dashboard/frontliner-report/${calling_id}`);
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

export const batchCreateBatch = async (payload) => {
  try {
    const response = await api.post('/batch/createBatch', payload);
    return response.data;
  } catch (error) {
    console.error('Error Batch create!:', error);
    throw error;
  }
};

export const getAllBatches = async () => {
  try {
    const response = await api.get('/batch/allBatches');
    return response.data;
  } catch (error) {
    console.error('Error fetching batches:', error);
    throw error;
  }
};
export const getBatchesByfacilitatorId = async (facilitatorId) => {
  try {
    const response = await api.get(
      `/batch/getBatchesByfacilitatorId/${facilitatorId}`,
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching batches:', error);
    throw error;
  }
};

export const updateBatchStartStatus = async (batchId, isStart) => {
  try {
    const response = await api.put('/batch/update-batch-start', {
      batchId,
      isStart,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating batch is_start status:', error);
    throw error;
  }
};

export const markAttendance = async (AttendanceSession, StudentId) => {
  try {
    const response = await api.post('/attendance/markAttendance', {
      AttendanceSession,
      StudentId,
    });
    return response.data;
  } catch (error) {
    console.error('Error marking attendance:', error);
    throw error;
  }
};

export const getUsersByBatchId = async (batchId) => {
  try {
    const response = await api.get(`/students/batch/${batchId}`);
    return response.data.users;
  } catch (error) {
    console.error('Error fetching users by batchId:', error);
    throw error;
  }
};
export const getUsersByUserId = async (user_id) => {
  try {
    const response = await api.get(`/students/getStudent/${user_id}`);
    return response.data.users;
  } catch (error) {
    console.error('Error fetching users by user_id', error);
    throw error;
  }
};

// export const updateStudentGroupWiseName = async (user_id, newGroupName) => {
//   try {
//     const response = await api.post('/attendance/updateStudentGroupWise', {
//       user_id,
//       newGroupName,
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error updateStudentGroupWise :', error);
//     throw error;
//   }
// };


 export const updatestudentgroupwisename = async (devoteeId, priviousGroup, currentGroup) => {
   try {
     const response = await api.post('/groupMigration/migrate', {
      devoteeId,
      priviousGroup,
      currentGroup
     });
     return response.data;
   } catch (error) {
     console.error('error updatestudentgroupwise :', error);
     throw error;
   }
 };

// export const getFrontlinerdetailReport = async (facilitatorId, group_name) => {
//   try {
//     const response = await api.post('/attendance/getFrontlinerdetailReport', {
//       facilitatorId,
//       group_name,
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error getFrontlinerdetailReport :', error);
//     throw error;
//   }
// };


export const getFrontlinerdetailReport = async (
  facilitatorId,
  groupName,
  selectedMonth,
  selectedYear
) => {
  // normalize month/year: if undefined/null/"" ⇒ null
  const monthParam = selectedMonth != null && selectedMonth !== "" 
    ? selectedMonth 
    : null;
  const yearParam = selectedYear != null && selectedYear !== "" 
    ? selectedYear 
    : null;

  try {
    const response = await api.post('/attendance/getFrontlinerdetailReport', {
      facilitatorId,
      groupPrefix: groupName,
      sessionName: groupName,
      selectedMonth: monthParam,
      selectedYear: yearParam,
    });
    return response.data;
  } catch (error) {
    console.error('Error getFrontlinerdetailReport:', error);
    throw error;
  }
};

export const getGroupUserCount = async (facilitatorId) => {
  try {
    const response = await api.post('/students/getGroupUserCount', {
      facilitatorId,
    });
    return response.data;
  } catch (error) {
    console.error('Error getGroupUserCount :', error);
    throw error;
  }
};

export const getStudentClassReport = async (user_id) => {
  try {
    const res = await api.post('/attendance/getStudentClassReport', { user_id });
    return res.data;
  } catch (error) {
    console.error('Error fetching class report:', error);
    throw error;
  }
};
export const getStudentReport = async (groupName,month,year) => {
  try {
    const res = await api.post('/attendance/getStudentReport', { groupName,month,year });
    return res.data;
  } catch (error) {
    console.error('Error fetching class getStudentReport:', error);
    throw error;
  }
};




export const getStudentById = async (id) => {
  try {
    const response = await api.get(`/students/getStudent/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching student:", error);
    throw error;
  }
};



// Task Manager

export const getTasksByUserId = async (userId) => {
  try {
    const response = await api.get(`/task/tasks/user/${userId}`);
    return response.data.tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};


export const createTask = async (taskData) => {
  try {
    const response = await api.post('/task/tasks/', taskData);
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

export const updateTaskStatus = async (taskId, status) => {
  try {
    const response = await api.patch(`/task/tasks/${taskId}/toggle-status`);
    return response.data;
  } catch (error) {
    console.error("Error updating task status:", error);
    throw error;
  }
};

export const deleteTask = async (taskId) => {
  try {
    const response = await api.delete(`/task/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

export const updateTask = async (taskId, taskData) => {
  try {
    const response = await api.put(`/task/tasks/${taskId}`, taskData);
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

export const deleteCompletedTasks = async (userId) => {
  try {
    const response = await api.delete(`/task/tasks/${userId}/deleteCompletedTasks`);
    return response.data;
  } catch (error) {
    console.error("Error deleteCompleted Tasks:", error);
    throw error;
  }
};

export const getTop3Frontliners = async (month, year) => {
  try {
    const response = await api.get(`/dashboard/top-3-frontliners/${month}/${year}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching top 3 frontliners:", error);
    throw error;  // Re-throw the error after logging
  }
};

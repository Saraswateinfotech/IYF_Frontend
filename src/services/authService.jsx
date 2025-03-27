import api from "./api";

export const loginUser = async (user_id, password) => {
  try {
    const response = await api.post("/auth/login", { user_id, password });

    if (typeof window !== "undefined" && response.data.token) {
      localStorage.setItem("token", response.data.token);

      const user = response.data.user;

      if (user?.userId) {
        localStorage.setItem("frontlinerId", user.userId);
      }

      if (user?.role) {
        localStorage.setItem("role", user.role);
      }
      if (user?.name) {
        localStorage.setItem("name", user.name);
      }
    }

    return response.data;
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

export const createDashboardAccount = async (name, phone_number, email, password, role) => {
  try {
    const response = await api.post("/auth/signUp", {
      name, 
      phone_number, 
      email, 
      password, 
      role
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
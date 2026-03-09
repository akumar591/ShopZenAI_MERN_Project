import { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

const API = axios.create({
  baseURL: "https://shopzenai-mern-project.onrender.com/api",
});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    localStorage.getItem("token") || null
  );
  const [loading, setLoading] = useState(false);

  /* ================= USER LOGIN ================= */
  const login = async (email, password) => {
    try {
      setLoading(true);

      const res = await API.post(
        "/user/login",
        { email, password },
        {
          headers: {
            "x-admin-session":
              localStorage.getItem("adminSession") || "false",
          },
        }
      );

      if (!res.data.success) {
        return { success: false, message: res.data.message };
      }

      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);

      return { success: true, message: "Login successful" };
    } catch (err) {
      return {
        success: false,
        message:
          err.response?.data?.message || "Login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  /* ================= USER REGISTER ================= */
  const register = async (name, email, password) => {
    try {
      setLoading(true);

      const res = await API.post(
        "/user/register",
        { name, email, password },
        {
          headers: {
            "x-admin-session":
              localStorage.getItem("adminSession") || "false",
          },
        }
      );

      if (!res.data.success) {
        return { success: false, message: res.data.message };
      }

      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);

      return {
        success: true,
        message: "Account created successfully",
      };
    } catch (err) {
      return {
        success: false,
        message:
          err.response?.data?.message ||
          "Registration failed",
      };
    } finally {
      setLoading(false);
    }
  };

  /* ================= ADMIN LOGIN ================= */
  const adminLogin = async (email, password) => {
    try {
      setLoading(true);

      const res = await API.post("/user/admin", {
        email,
        password,
      });

      if (!res.data.success) {
        return {
          success: false,
          message: res.data.message,
        };
      }

      // 🔐 ADMIN SESSION LOCK
      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("adminSession", "true");

      return {
        success: true,
        message: "Admin login successful",
      };
    } catch (err) {
      return {
        success: false,
        message:
          err.response?.data?.message ||
          "Admin login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOGOUT ================= */
  const logout = () => {
    // user logout
    localStorage.removeItem("token");
    setToken(null);
  };

  /* ================= ADMIN LOGOUT ================= */
  const adminLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminSession"); // 🔓 release lock
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        register,
        adminLogin,
        adminLogout, // 👈 NEW
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

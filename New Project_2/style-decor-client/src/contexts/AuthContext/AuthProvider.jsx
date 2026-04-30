import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import api, { publicApi } from "../../utils/api";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Register user with email and password
  const registerUser = async (email, password, displayName, photoURL) => {
    setLoading(true);
    try {
      const response = await publicApi.post("/auth/register", {
        email,
        password,
        displayName,
        photoURL,
      });

      const { token, user: userData } = response.data;
      
      // Store token and user data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      
      setUser(userData);
      setLoading(false);
      
      return { user: userData };
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Sign in user with email and password
  const SignInUser = async (email, password) => {
    setLoading(true);
    try {
      const response = await publicApi.post("/auth/login", {
        email,
        password,
      });

      const { token, user: userData } = response.data;
      
      // Store token and user data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      
      setUser(userData);
      setLoading(false);
      
      return { user: userData };
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Google Sign In
  const signInGoogle = async (googleUser) => {
    setLoading(true);
    try {
      const response = await publicApi.post("/auth/google", {
        email: googleUser.email,
        displayName: googleUser.displayName,
        photoURL: googleUser.photoURL,
      });

      const { token, user: userData } = response.data;
      
      // Store token and user data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      
      setUser(userData);
      setLoading(false);
      
      return { user: userData };
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Log out user
  const logOut = async () => {
    setLoading(true);
    try {
      // Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      setUser(null);
      setLoading(false);
      
      return Promise.resolve();
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (profile) => {
    try {
      // Update local user data
      const updatedUser = { ...user, ...profile };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      return Promise.resolve();
    } catch (error) {
      throw error;
    }
  };

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        try {
          // Verify token is still valid by fetching current user
          const response = await api.get("/auth/me");
          setUser(response.data.user);
        } catch (error) {
          // Only clear session on explicit 401 (invalid/expired token)
          // Ignore network errors, server errors (5xx), etc.
          if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
          } else {
            // Network/server error — keep the user logged in using stored data
            setUser(JSON.parse(storedUser));
          }
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  const authInfo = {
    user,
    loading,
    registerUser,
    SignInUser,
    signInGoogle,
    logOut,
    updateUserProfile,
  };

  return <AuthContext value={authInfo}>{children}</AuthContext>;
};

export default AuthProvider;

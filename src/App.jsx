import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import AutoAuth from "./pages/auth/autoauth";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile, setUserFromLocalStorage } from "@/Redux/slices/User.Slice";
import { toast } from 'react-toastify';
import ProtectedRoute from "@/ProtectedRoute";
import "@/app.css";
import { getImageSettings } from "@/Redux/slices/secretIdSlice";

function App() {


  const dispatch = useDispatch();
  const { isAuthenticated, user, error } = useSelector((state) => state.user);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      dispatch(setUserFromLocalStorage());
    } else {
      if (!user) {
        dispatch(fetchUserProfile());
      }
    }
  }, [dispatch, user]);
  useEffect(() => {
    dispatch(getImageSettings());
  }, [dispatch]);
  if (error) {
    console.error("Error fetching user:", error);
  }

  return (
    <Routes>
      
      {/* Protected Dashboard Route */}
      <Route path="/dashboard/*" element={ 
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
   
      {/* Auth Routes */}
      <Route path="/auth/*" element={<Auth />} />
<Route path="/autoauth" element={<AutoAuth />} />
      {/* Password Reset Routes */}
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Catch-all for invalid routes */}
      <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
    </Routes>
  );
}

export default App;

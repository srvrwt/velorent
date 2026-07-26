import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ExploreBikes from "./pages/ExploreBikes";
import Pricing from "./pages/Pricing";
import Locations from "./pages/Locations";
import AboutUs from "./pages/AboutUs";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";

// Admin
import AdminLayout from "./layouts/AdminLayout";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Users from "./pages/admin/Users";
import Bikes from "./pages/admin/Bikes";
import Bookings from "./pages/admin/Bookings";
import Payments from "./pages/admin/Payments";

function App() {
  return (
    <Routes>
      {/* Routes with MainLayout */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="explore-bikes" element={<ExploreBikes />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="locations" element={<Locations />} />
        <Route path="about-us" element={<AboutUs />} />
        <Route path="dashboard" element={<Dashboard />} />

      </Route>

      {/* Routes without MainLayout */}
      <Route path="/login" element={<Login />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      > <Route index element={<AdminDashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="bikes" element={<Bikes />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="payments" element={<Payments />} />
      </Route>
    </Routes>
  );
}

export default App;
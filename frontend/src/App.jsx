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
      </Route>

      {/* Routes without MainLayout */}
      <Route path="/login" element={<Login />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../services/authService";
import { saveAuth } from "../utils/auth";

import InputField from "../components/InputField";
import FormButton from "../components/FormButton";

import Error from "../assets/icons/error.svg";
import Success from "../assets/icons/checkmark.svg";
import googleIcon from "../assets/images/icon-google.webp";
import Github from "../assets/images/github.svg";
import Logo from "../assets/images/logo-velorent.webp";

function ResetPassword() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!serverError && !successMessage) return;

    const timer = setTimeout(() => {
      setServerError("");
      setSuccessMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [serverError, successMessage]);

  function validateForm() {
    let newErrors = {};

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setServerError("");
    setSuccessMessage("");

    if (!validateForm()) return;

    if (!token) {
      setServerError("Invalid or missing reset token.");
      return;
    }

    try {
      setLoading(true);

      const data = await resetPassword({
        token,
        password: formData.password,
      });

      // Save Login Data
      saveAuth(data);

      // Success Message
      setSuccessMessage(
        data.message || "Password reset successfully!"
      );

      // Redirect after 1.5 sec
      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (error) {
      setServerError(
        error.response?.data?.message ||
          "Something went wrong. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form_container">

      {serverError && (
        <div className="toast toast_error flex gap_xsm align_center justify_center">
          <img src={Error} alt="Error" />
          {serverError}
        </div>
      )}

      {successMessage && (
        <div className="toast toast_success flex gap_xsm align_center justify_center">
          <img src={Success} alt="Success" />
          {successMessage}
        </div>
      )}

      <div className="form_wrap">

        <div className="logo">
          <img src={Logo} alt="Velo Rent" />
        </div>

        <h1>Reset Password</h1>

        <p className="mt_xsm">
          Please enter your new password.
        </p>

        <form onSubmit={handleSubmit}>

          <InputField
            label="New Password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />

          <InputField
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
          />

          <FormButton
            text={loading ? "Resetting..." : "Reset Password"}
            disabled={loading}
          />

        </form>

        <div className="divider">
          <span>Or continue with</span>
        </div>

        <div className="login_option flex gap_sm">

          <button
            type="button"
            className="with_google radius border bg_white"
          >
            <img src={googleIcon} alt="Google" />
            Google
          </button>

          <button
            type="button"
            className="with_google radius border bg_white"
          >
            <img src={Github} alt="Github" />
            Github
          </button>

        </div>

        <p className="form_small">
          Having trouble?{" "}
          <Link to="#">Contact Support</Link>
        </p>

        <Link
          to="/login"
          className="back_to_login flex gap_xsm align_center justify_center mt_lg color_green text_bold"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="currentColor"
          >
            <path d="M398.08-253.85 171.92-480l226.16-226.15 42.15 43.38L287.46-510h500.62v60H287.46l152.77 152.77-42.15 43.38Z" />
          </svg>

          Back to Login
        </Link>

      </div>
    </div>
  );
}

export default ResetPassword;
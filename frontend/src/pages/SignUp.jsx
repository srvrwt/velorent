import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import InputField from "../components/InputField";
import FormButton from "../components/FormButton";
import SocialLogin from "../components/SocialLogin";

import Logo from "../assets/images/logo-velorent.webp";

import { registerUser } from "../services/authService";
import { googleLogin } from "../services/googleAuthService";
import { saveAuth } from "../utils/auth";

import Error from "../assets/icons/error.svg";
import Success from "../assets/icons/checkmark.svg";

function SignUp() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Auto hide toast
    useEffect(() => {
        if (!serverError && !successMessage) return;

        const timer = setTimeout(() => {
            setServerError("");
            setSuccessMessage("");
        }, 5000);

        return () => clearTimeout(timer);
    }, [serverError, successMessage]);

    function validateForm() {
        let newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }

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

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setServerError("");
        setSuccessMessage("");

        if (!validateForm()) return;

        try {
            setLoading(true);

            const data = await registerUser(formData);

            saveAuth(data);

            setSuccessMessage(
                data.message || "Account created successfully!"
            );

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

  async function handleGoogleLogin(response) {
  try {
    const data = await googleLogin(response.credential);

    // console.log(":", data);

    saveAuth(data);

    navigate("/");
  } catch (error) {
    console.log(error);

    setServerError(
      error.response?.data?.message || "Google login failed."
    );
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

                <p className="text_center mt_sm">
                    Please enter your details to access your account.
                </p>

                <div className="form_header flex mt_sm">
                    <Link to="/login">
                        Login
                    </Link>

                    <Link
                        className="active"
                        to="/sign-up"
                    >
                        Sign Up
                    </Link>
                </div>

                <form onSubmit={handleSubmit}>

                    <InputField
                        label="Full Name"
                        type="text"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        error={errors.name}
                    />

                    <InputField
                        label="Email Address"
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                    />

                    <InputField
                        label="Password"
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
                        text={
                            loading
                                ? "Creating..."
                                : "Create Account"
                        }
                        disabled={loading}
                    />

                </form>

                <div className="divider">
                    <span>Or continue with</span>
                </div>

                <SocialLogin
                    onGoogleSuccess={handleGoogleLogin}
                />

                <p className="form_small">
                    Having trouble?{" "}
                    <Link to="#">
                        Contact Support
                    </Link>
                </p>

            </div>
        </div>
    );
}

export default SignUp;

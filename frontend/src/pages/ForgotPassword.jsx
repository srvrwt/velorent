import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/authService";
import InputField from "../components/InputField";
import FormButton from "../components/FormButton";
import googleIcon from "../assets/images/icon-google.webp";
import Github from "../assets/images/github.svg";
import Error from "../assets/icons/error.svg";
import Success from "../assets/icons/checkmark.svg";
import Logo from "../assets/images/logo-velorent.webp";

function ForgotPassword() {
    const [formData, setFormData] = useState({
        email: "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const [serverError, setServerError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

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

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Invalid email format";
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

            const data = await forgotPassword(formData);

            setSuccessMessage(
                data.message ||
                "Password reset link sent successfully. Please check your email."
            );

        } catch (error) {
            setServerError(
                error.response?.data?.message || "Something went wrong. Please try again later."
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

                <h1>Forgot Password?</h1>

                <p className="mt_xsm">
                    Enter your email address and we'll send you a secure link to reset your access.
                </p>

                <form onSubmit={handleSubmit}>
                    <InputField
                        label="Email Address"
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                    />

                    <FormButton
                        text={loading ? "Sending..." : "Send Reset Link"}
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

export default ForgotPassword;
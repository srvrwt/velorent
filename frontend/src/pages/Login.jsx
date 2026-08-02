import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import Error from "../assets/icons/error.svg";
import Logo from "../assets/images/logo-velorent.webp";
import InputField from "../components/InputField";
import FormButton from "../components/FormButton";
import { saveAuth } from "../utils/auth";
import SocialLogin from "../components/SocialLogin";
import { googleLogin } from "../services/googleAuthService";

function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false,
    });

    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (!serverError) return;

        const timer = setTimeout(() => {
            setServerError("");
        }, 3000);

        return () => clearTimeout(timer);
    }, [serverError]);

    function validateForm() {
        let newErrors = {};

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

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }

    function handleChange(e) {
        const { name, value, type, checked } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setServerError("");

        if (!validateForm()) return;

        try {
            setLoading(true);

            const data = await loginUser(formData);

            saveAuth(data);

            navigate("/");

            localStorage.setItem("token", data.token);

            navigate("/");

        } catch (error) {
            setServerError(
                error.response?.data?.message || "Something went wrong. Please try again later."
            );
        } finally {
            setLoading(false);
        }
    }
async function handleGoogleLogin(response) {
  try {
    const data = await googleLogin(response.credential);

    // console.log("Google API Response:", data);

    saveAuth(data);

    navigate("/");
  } catch (error) {
    console.log(error);
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

            <div className="form_wrap">

                <div className="logo">
                    <img src={Logo} alt="Velo Rent" />
                </div>

                <p className="text_center mt_sm">
                    Please enter your details to access your account.
                </p>

                <div className="form_header flex mt_sm">
                    <Link className="active" to="/login">
                        Login
                    </Link>

                    <Link to="/sign-up">
                        Sign Up
                    </Link>
                </div>

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

                    <InputField
                        label="Password"
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                    />

                    <div className="label_row">
                        <label className="remember_me">
                            <input
                                type="checkbox"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                            />
                            Remember Me
                        </label>

                        <Link to="/forgot-password">
                            Forgot Password?
                        </Link>
                    </div>

                    <FormButton
                        text={loading ? "Signing in..." : "Sign In"}
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
                    <Link to="#">Contact Support</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
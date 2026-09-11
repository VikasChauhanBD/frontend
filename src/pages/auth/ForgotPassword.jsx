import { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Image from "../../assets/images/login_image.webp";

import {
  forgotPassword,
  verifyOTP,
  resetPassword,
} from "../../services/authService";

function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ===================Step 1 - Send OTP ====================================

  const handleSendOTP = async (e) => {
    e.preventDefault();

    if (!formData.email) {
      return toast.error("Please enter your email");
    }

    try {
      setLoading(true);

      const res = await forgotPassword({
        email: formData.email,
      });

      toast.success(res.message || "OTP sent successfully");

      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // =================== Step 2 - Verify OTP =================================

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!formData.otp) {
      return toast.error("Please enter the OTP");
    }

    if (formData.otp.length !== 6) {
      return toast.error("OTP must be 6 digits");
    }

    try {
      setLoading(true);

      const res = await verifyOTP({
        email: formData.email,
        otp: formData.otp,
      });

      toast.success(res.message || "OTP verified successfully");

      setStep(3);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // ======================= Step 3 - Reset Password =============================

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!formData.password || !formData.confirmPassword) {
      return toast.error("Please fill all fields");
    }

    if (formData.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);

      const res = await resetPassword({
        email: formData.email,
        password: formData.password,
      });

      toast.success(res.message || "Password reset successfully");

      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-section">
      {/* Left Image */}
      <div className="login-image">
        <img src={Image} alt="" />
      </div>

      {/* Right Form */}
      <div className="login-form">
        <img
          src="https://cdn.dribbble.com/userupload/48551110/file/f730ea2ceb0ebb81692e526e355c1c90.png"
          alt=""
        />

        {/* =================STEP 1 ======================= */}

        {step === 1 && (
          <form onSubmit={handleSendOTP}>
            <h1>Forgot Password?</h1>

            <p className="auth-description">
              Enter your registered email address and we'll send you an OTP to
              reset your password.
            </p>

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />

            <br />
            <br />

            <button type="submit" disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>

            <p className="signup-text">
              Remember your password?{" "}
              <span onClick={() => navigate("/login")}>Login</span>
            </p>
          </form>
        )}

        {/* ===================== STEP 2 ========================= */}

        {step === 2 && (
          <form onSubmit={handleVerifyOTP}>
            <h1>Verify OTP</h1>

            <p className="auth-description">Enter the 6-digit OTP sent to</p>

            <p className="email-display">{formData.email}</p>

            <input
              type="text"
              name="otp"
              placeholder="Enter 6-digit OTP"
              value={formData.otp}
              onChange={handleChange}
              maxLength={6}
              inputMode="numeric"
              autoComplete="one-time-code"
            />

            <br />
            <br />

            <button type="submit" disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <p className="signup-text">
              Didn't receive the OTP?{" "}
              <span onClick={() => setStep(1)}>Try Again</span>
            </p>
          </form>
        )}

        {/* ===================== STEP 3 ======================== */}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <h1>Reset Password</h1>

            <p className="auth-description">
              Create a new password for your account.
            </p>

            <input
              type="password"
              name="password"
              placeholder="New Password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
            />

            <br />
            <br />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
            />

            <br />
            <br />

            <button type="submit" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>

            <p className="signup-text">
              Remember your password?{" "}
              <span onClick={() => navigate("/login")}>Login</span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;

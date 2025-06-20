import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8000/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Login successful. Redirecting...");
        // Optionally store user info in localStorage
        localStorage.setItem("user", JSON.stringify(data.user));
        // Navigate to dashboard or homepage
        navigate("/companyform");
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
      console.error(error);
    }
  };

  const goToSignup = () => {
    navigate("/signup");
  };

  return (
    <div
      className="auth-container"
      style={{
        backgroundImage: "url('/loginImg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="auth-box">
        <h2>Welcome! Please login to your account to continue</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="auth-options">
            <label className="checkbox-label">
              <input type="checkbox" className="checkbox-input" />
              <span>Remember me</span>
            </label>
            <a href="/about">Forgot Password</a>
          </div>
          <div className="auth-buttons">
            <button type="submit" className="login-btn">
              Login
            </button>
            <button type="button" className="signup-btn" onClick={goToSignup}>
              Signup
            </button>
          </div>
          {message && <p className="login-message">{message}</p>}
          <p className="terms">
            By signing up, you agree to our company’s{" "}
            <a href="/about">Terms and Conditions</a> and{" "}
            <a href="/about">Privacy Policy</a>
          </p>
        </form>
      </div>
      <div
        className="auth-image"
        style={{
          backgroundImage: "url('/illustration.png')",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          height: "400px",
          marginTop: "150px",
        }}
      />
    </div>
  );
};

export default LoginPage;

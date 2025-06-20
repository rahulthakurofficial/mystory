import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const SignupPage = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/signup.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: fullName,
          email: email,
          password: password,
        }),
      });

      // Log the raw response to see what PHP is actually returning
      const responseText = await response.text();
      console.log("Raw PHP response:", responseText);

      // Try to parse as JSON
      const data = JSON.parse(responseText);

      if (data.success) {
        setMessage("Signup successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/loginPage");
        }, 2000);
      } else {
        setMessage(data.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      console.error("Signup error:", error);
    }
  };

  const goToLogin = () => {
    navigate("/loginPage");
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
        <h2>Create your account</h2>
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
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
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <div className="auth-buttons">
            <button type="submit" className="signup-btn">
              Signup
            </button>
            <button type="button" className="login-btn" onClick={goToLogin}>
              Login
            </button>
          </div>
          {message && <p className="signup-message">{message}</p>}
          <p className="terms">
            By signing up, you agree to our company’s{" "}
            <a href="#">Terms and Conditions</a> and{" "}
            <a href="#">Privacy Policy</a>
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

export default SignupPage;

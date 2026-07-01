import React from "react";
import { useState } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
const Signup = () => {
  const [form, setForm] = useState({
    userName: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const handleUsername = (e) => {
    setForm({ ...form, userName: e.target.value });
  };
  const handlePasword = (e) => {
    setForm({ ...form, password: e.target.value });
  };
  const handleConfirmPassword = (e) => {
    setForm({ ...form, confirmPassword: e.target.value });
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("password mismatch");
      return;
    }
    alert("Redirecting to login...");
    localStorage.setItem("registeredUser", form.userName);

    navigate("/login");
  };

  return (
    <div id="login-page-wrapper">
      <button id="back" onClick={()=>navigate('/')}>back</button>
      <div className="login-container">
        <div className="wrap-login">
          <h1>Create account</h1>
          <p id="account">Join us to start exploring.</p>
          <form onSubmit={handleSignUp}>
            <input
              onChange={handleUsername}
              name="userName"
              value={form.userName}
              type="text"
              placeholder="username"
            />
            <input
              onChange={handlePasword}
              name="password"
              value={form.password}
              type="password"
              placeholder="password"
            />
            <input
              onChange={handleConfirmPassword}
              name="confirmPassword"
              value={form.confirmPassword}
              type="password"
              placeholder="Confirm password"
            />
            <button type="submit">Sign Up</button>
          </form>

          <p id="account">
            Already have an account?{" "}
            <Link id="login-link" to="/login">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

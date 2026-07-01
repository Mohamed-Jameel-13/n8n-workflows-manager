import React, { useState } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
const Login = () => {
  const [login, setLogin] = useState({ username: "", password: "" });
  const navigate = useNavigate();
  const storedUsernames = localStorage.getItem("registeredUser");

  const handleUsername = (e) => {
    setLogin({ ...login, username: e.target.value });
  };
  const handlePassword = (e) => {
    setLogin({ ...login, password: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (login.username === storedUsernames) {
      alert("Redirecting to dashboard");
      navigate("/dashboard");
    } else {
      alert("User not found!");
    }
  };
  return (
    <div id="login-page-wrapper">
      <button onClick={()=>navigate('/')} id="back">back</button>
      <div className="login-container">
        <div className="wrap-login">
          <h1>Welcome back</h1>
          <p id="account">Enter your details to continue.</p>
          <form onSubmit={handleLogin}>
            <input
              onChange={handleUsername}
              name="username"
              value={login.username}
              type="text"
              placeholder="username"
            />
            <input
              onChange={handlePassword}
              name="password"
              value={login.password}
              type="password"
              placeholder="password"
            />
            <button type="submit">Login</button>
          </form>
          <p id="account">
            don't have an account? <Link id="login-link" to="/signup">SignUp</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

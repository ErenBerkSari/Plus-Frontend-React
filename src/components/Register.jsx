import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Login.css";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../redux/slices/authSlice";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault(); // Sayfanın yenilenmesini engeller
    try {
      const result = await dispatch(
        register({
          username: registerUsername,
          email: registerEmail,
          password: registerPassword,
        })
      );

      if (register.fulfilled.match(result)) {
        navigate("/");
      } else {
        alert(result.payload || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Kayıt işlemi sırasında hata: ", error);
      alert(
        "An error occurred during the registration process. Please try again."
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <form onSubmit={handleRegister}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              className="login-input"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              className="login-input"
              value={registerUsername}
              onChange={(e) => setRegisterUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              className="login-input"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              required
            />
          </div>
          <button
            className="login-button"
            type="submit"
            onClick={handleRegister}
          >
            Register
          </button>
        </form>
        <p className="register-link">
          <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Login.css";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/slices/authSlice";
import Loader from "./Loader";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault(); // Sayfanın yenilenmesini engeller
    try {
      console.log("Login işlemi başlatılıyor..");
      const result = await dispatch(
        login({
          email: loginEmail,
          password: loginPassword,
        })
      );
      if (login.fulfilled.match(result)) {
        console.log("Giriş başarılı: ", result);
        navigate("/");
      } else {
        console.log("Giriş başarısız: ", result);
        alert(
          result.payload || "Bilinmeyen bir hata oluştu. Lütfen tekrar deneyin."
        );
      }
    } catch (error) {
      console.error("Login işlemi sırasında hata: ", error);
      alert("An error occurred during the login process. Please try again.");
    }
  };
  if (isLoading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "20px",
        }}
      >
        <Loader />
        <div>Loading, please wait...</div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Welcome BOSS!</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              className="login-input"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              className="login-input"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
          </div>
          <button className="login-button" type="submit">
            Login
          </button>
        </form>
        <p className="register-link">
          <Link to="/register">Kaydol</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../services/auth.api";
import "../styles/login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await loginApi(email, password);
      const token = res.data.data.token;

      localStorage.setItem("token", token);
      navigate("/budget");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleLogin}>
        <h2>Welcome back</h2>
        <p>Sign in to manage your wedding</p>

        <input
          type="email"
          placeholder="Email"
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

        {error && <div className="auth-error">{error}</div>}

        <button type="submit" className="primary-btn">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;

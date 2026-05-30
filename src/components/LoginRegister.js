import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://tq3dhx-8080.csb.app";

export default function LoginRegister({ onLogin }) {
  const [loginName, setLoginName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");
  const [registerData, setRegisterData] = useState({
    login_name: "",
    password: "",
    confirm_password: "",
    first_name: "",
    last_name: "",
    location: "",
    description: "",
    occupation: "",
  });
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoginError("");
    try {
      const response = await fetch(`${API_BASE}/admin/login`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login_name: loginName.trim(),
          password: loginPassword,
        }),
      });

      if (!response.ok) {
        const message = await response.text();
        setLoginError(message || "Login failed!");
        return;
      }

      const result = await response.json();
      onLogin && onLogin(result);
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setLoginError("Login failed!");
    }
  };

  const handleRegisterChange = (field) => (event) => {
    setRegisterData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleRegister = async () => {
    setRegisterError("");
    setRegisterSuccess("");

    if (registerData.password !== registerData.confirm_password) {
      setRegisterError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/user`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login_name: registerData.login_name.trim(),
          password: registerData.password,
          first_name: registerData.first_name.trim(),
          last_name: registerData.last_name.trim(),
          location: registerData.location,
          description: registerData.description,
          occupation: registerData.occupation,
        }),
      });

      if (!response.ok) {
        const message = await response.text();
        setRegisterError(message || "Registration failed");
        return;
      }

      setRegisterSuccess("Registration successful. You can login now.");
      setRegisterData({
        login_name: "",
        password: "",
        confirm_password: "",
        first_name: "",
        last_name: "",
        location: "",
        description: "",
        occupation: "",
      });
    } catch (err) {
      console.error("Register error:", err);
      setRegisterError("Registration failed");
    }
  };

  return (
    <div style={{ padding: 10 }}>
      <h3>Please Login</h3>
      <span>Login name:</span>
      <br />
      <input
        type="text"
        value={loginName}
        onChange={(e) => setLoginName(e.target.value)}
      />
      <br />
      <span>Password:</span>
      <br />
      <input
        type="password"
        value={loginPassword}
        onChange={(e) => setLoginPassword(e.target.value)}
      />
      <br />
      <br />
      <button onClick={handleLogin}>Login</button>
      <p>{loginError}</p>

      <hr />

      <h3>Register</h3>
      <div>
        <span>Login name:</span>
        <br />
        <input
          type="text"
          value={registerData.login_name}
          onChange={handleRegisterChange("login_name")}
        />
      </div>
      <div>
        <span>Password:</span>
        <br />
        <input
          type="password"
          value={registerData.password}
          onChange={handleRegisterChange("password")}
        />
      </div>
      <div>
        <span>Confirm password:</span>
        <br />
        <input
          type="password"
          value={registerData.confirm_password}
          onChange={handleRegisterChange("confirm_password")}
        />
      </div>
      <div>
        <span>First name:</span>
        <br />
        <input
          type="text"
          value={registerData.first_name}
          onChange={handleRegisterChange("first_name")}
        />
      </div>
      <div>
        <span>Last name:</span>
        <br />
        <input
          type="text"
          value={registerData.last_name}
          onChange={handleRegisterChange("last_name")}
        />
      </div>
      <div>
        <span>Location:</span>
        <br />
        <input
          type="text"
          value={registerData.location}
          onChange={handleRegisterChange("location")}
        />
      </div>
      <div>
        <span>Description:</span>
        <br />
        <input
          type="text"
          value={registerData.description}
          onChange={handleRegisterChange("description")}
        />
      </div>
      <div>
        <span>Occupation:</span>
        <br />
        <input
          type="text"
          value={registerData.occupation}
          onChange={handleRegisterChange("occupation")}
        />
      </div>
      <br />
      <button onClick={handleRegister}>Register Me</button>
      <p>{registerError}</p>
      {registerSuccess && <p>{registerSuccess}</p>}
    </div>
  );
}

import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

function LoginRegister({ setCurrentUser }) {
  const navigate = useNavigate();

  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showRegister, setShowRegister] = useState(false);

  const login = async () => {
    try {
      setError("");

      const res = await fetch("http://localhost:8080/admin/login", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",

        body: JSON.stringify({
          login_name: loginName,
          password,
        }),
      });

      if (!res.ok) {
        throw new Error("Invalid login");
      }

      const user = await res.json();

      setCurrentUser(user);

      // chuyển sang user detail
      navigate(`/users/${user._id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  const [registerData, setRegisterData] = useState({
    login_name: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
    location: "",
    description: "",
    occupation: "",
  });

  const register = async () => {
    if (registerData.password !== registerData.confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      const res = await fetch("http://localhost:8080/api/user", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(registerData),
      });

      const text = await res.text();

      if (!res.ok) {
        throw new Error(text);
      }

      alert("Register success");

      setRegisterData({
        login_name: "",
        password: "",
        confirmPassword: "",
        first_name: "",
        last_name: "",
        location: "",
        description: "",
        occupation: "",
      });
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      {!showRegister ? (
        <>
          <h2>Please Login</h2>

          <input
            type="text"
            placeholder="Login Name"
            value={loginName}
            onChange={(e) => setLoginName(e.target.value)}
          />

          <br />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <br />

          <button onClick={login}>Login</button>

          <p>
            Nếu chưa có tài khoản{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowRegister(true);
              }}
              style={{
                color: "blue",
                cursor: "pointer",
              }}
            >
              Register Me
            </a>
          </p>

          <p>{error}</p>
        </>
      ) : (
        <>
          <h2>Register</h2>

          <input
            placeholder="First Name"
            value={registerData.first_name}
            onChange={(e) =>
              setRegisterData((prev) => ({
                ...prev,
                first_name: e.target.value,
              }))
            }
          />
          <br />

          <input
            placeholder="Last Name"
            value={registerData.last_name}
            onChange={(e) =>
              setRegisterData((prev) => ({
                ...prev,
                last_name: e.target.value,
              }))
            }
          />
          <br />

          <input
            placeholder="Login Name"
            value={registerData.login_name}
            onChange={(e) =>
              setRegisterData((prev) => ({
                ...prev,
                login_name: e.target.value,
              }))
            }
          />
          <br />

          <input
            type="password"
            placeholder="Password"
            value={registerData.password}
            onChange={(e) =>
              setRegisterData((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
          />
          <br />

          <input
            type="password"
            placeholder="Confirm Password"
            value={registerData.confirmPassword}
            onChange={(e) =>
              setRegisterData((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
          />
          <br />

          <input
            placeholder="Location"
            value={registerData.location}
            onChange={(e) =>
              setRegisterData((prev) => ({
                ...prev,
                location: e.target.value,
              }))
            }
          />
          <br />

          <input
            placeholder="Occupation"
            value={registerData.occupation}
            onChange={(e) =>
              setRegisterData((prev) => ({
                ...prev,
                occupation: e.target.value,
              }))
            }
          />
          <br />

          <input
            placeholder="Description"
            value={registerData.description}
            onChange={(e) =>
              setRegisterData((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />
          <br />

          <button onClick={register}>Register Me</button>

          <p>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowRegister(false);
              }}
            >
              Back to Login
            </a>
          </p>
        </>
      )}
    </div>
  );
}

export default LoginRegister;

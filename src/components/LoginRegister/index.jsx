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

      const res = await fetch("https://trkp7s-8080.csb.app/admin/login", {
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

  // ĐĂNG KÝ
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
      const res = await fetch("https://trkp7s-8080.csb.app/api/user", {
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
        // LOGIN PAGE
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
        // REGISTER PAGE
        <>
          <h2>Register</h2>

          <input
            placeholder="First Name"
            onChange={(e) =>
              setRegisterData({
                ...registerData,
                first_name: e.target.value,
              })
            }
          />
          <br />

          <input
            placeholder="Last Name"
            onChange={(e) =>
              setRegisterData({
                ...registerData,
                last_name: e.target.value,
              })
            }
          />
          <br />

          <input
            placeholder="Login Name"
            onChange={(e) =>
              setRegisterData({
                ...registerData,
                login_name: e.target.value,
              })
            }
          />
          <br />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) =>
              setRegisterData({
                ...registerData,
                password: e.target.value,
              })
            }
          />
          <br />

          <input
            type="password"
            placeholder="Confirm Password"
            onChange={(e) =>
              setRegisterData({
                ...registerData,
                confirmPassword: e.target.value,
              })
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

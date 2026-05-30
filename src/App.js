import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  Navigate,
} from "react-router-dom";

import Home from "./components/Home";
import About from "./components/About";
import Posts from "./components/Posts";
import PostLists from "./components/PostLists";
import Post from "./components/Post";
import LoginRegister from "./components/LoginRegister";
import Stats from "./components/Stats";
import NoMatch from "./components/NoMatch";
import ProtectedRoute from "./components/ProtectedRoute";
import NewPost from "./components/NewPost";
import Photos from "./components/Photos";
import PhotoUpload from "./components/PhotoUpload";
import "./styles.css";

function AppLayout() {
  const [user, setUser] = useState(() => {
    const rawUser = localStorage.getItem("authUser");
    return rawUser ? JSON.parse(rawUser) : null;
  });
  const navigate = useNavigate();

  async function logOut() {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        await fetch("https://tq3dhx-8080.csb.app/admin/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error("Logout error:", error);
      }
    }

    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    setUser(null);
    navigate("/login");
  }

  function handleLogin(result) {
    if (!result || !result.user || !result.token) {
      return;
    }
    localStorage.setItem("authToken", result.token);
    localStorage.setItem("authUser", JSON.stringify(result.user));
    setUser(result.user);
  }

  return (
    <>
      <nav style={{ margin: 10 }}>
        <Link to="/" style={{ padding: 5 }}>
          {" "}
          Home{" "}
        </Link>
        <Link to="/posts" style={{ padding: 5 }}>
          {" "}
          Posts{" "}
        </Link>
        <Link to="/about" style={{ padding: 5 }}>
          {" "}
          About{" "}
        </Link>
        <span> | </span>
        {user && (
          <Link to="/stats" style={{ padding: 5 }}>
            {" "}
            Stats
          </Link>
        )}
        {user && (
          <Link to="/newpost" style={{ padding: 5 }}>
            {" "}
            New Post
          </Link>
        )}
        {user && (
          <Link to="/photos" style={{ padding: 5 }}>
            {" "}
            Photos
          </Link>
        )}
        {user && (
          <Link to="/photos/new" style={{ padding: 5 }}>
            {" "}
            Add Photo
          </Link>
        )}
        {!user && <span style={{ padding: 5 }}>Please Login</span>}
        {user && <span style={{ padding: 5 }}>Hi {user.login_name}</span>}
        {!user && (
          <Link to="/login" style={{ padding: 5 }}>
            {" "}
            Login
          </Link>
        )}
        {user && (
          <span onClick={logOut} style={{ padding: 5, cursor: "pointer" }}>
            {" "}
            Logout{" "}
          </span>
        )}
      </nav>

      <Routes>
        <Route
          path="/login"
          element={<LoginRegister onLogin={handleLogin} />}
        />
        <Route
          path="/"
          element={user ? <Home /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/posts"
          element={user ? <Posts /> : <Navigate to="/login" replace />}
        >
          <Route index element={<PostLists />} />
          <Route path=":slug" element={<Post />} />
        </Route>
        <Route
          path="/about"
          element={user ? <About /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/stats"
          element={
            <ProtectedRoute user={user}>
              <Stats />
            </ProtectedRoute>
          }
        />
        <Route
          path="/newpost"
          element={
            <ProtectedRoute user={user}>
              <NewPost />
            </ProtectedRoute>
          }
        />
        <Route
          path="/photos"
          element={
            <ProtectedRoute user={user}>
              <Photos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/photos/new"
          element={
            <ProtectedRoute user={user}>
              <PhotoUpload />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={user ? <NoMatch /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

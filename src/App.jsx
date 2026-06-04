import "./App.css";
import React, { useState } from "react";
import { Grid, Paper } from "@mui/material";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import LoginRegister from "./components/LoginRegister";

const App = () => {
  const [advanced, setAdvanced] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <Router>
      <div className="app">
        <TopBar
          advanced={advanced}
          setAdvanced={setAdvanced}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
        />

        <Grid container spacing={2} className="main-grid">
          {/* Sidebar */}
          <Grid item sm={3}>
            <Paper className="main-grid-item">
              {currentUser && <UserList />}
            </Paper>
          </Grid>

          {/* Content */}
          <Grid item sm={9} className="content">
            <Paper className="main-grid-item">
              <Routes>
                {!currentUser ? (
                  // chưa login
                  <Route
                    path="*"
                    element={<LoginRegister setCurrentUser={setCurrentUser} />}
                  />
                ) : (
                  // đã login
                  <>
                    <Route
                      path="/"
                      element={<Navigate to={`/users/${currentUser._id}`} />}
                    />

                    <Route path="/users/:userId" element={<UserDetail />} />

                    <Route
                      path="/photos/:userId"
                      element={<UserPhotos advanced={advanced} />}
                    />

                    {/* fallback */}
                    <Route
                      path="*"
                      element={<Navigate to={`/users/${currentUser._id}`} />}
                    />
                  </>
                )}
              </Routes>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </Router>
  );
};

export default App;

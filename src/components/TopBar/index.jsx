import React from "react";
import { Typography, Checkbox, Button } from "@mui/material";

import "./styles.css";

function TopBar({ advanced, setAdvanced, currentUser, setCurrentUser }) {
  // logout
  const logout = async () => {
    await fetch("http://localhost:8080/admin/logout", {
      method: "POST",

      credentials: "include",
    });

    setCurrentUser(null);
  };

  const uploadPhoto = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("photo", file);

    try {
      const res = await fetch("http://localhost:8080/photos/new", {
        method: "POST",

        credentials: "include",

        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      alert("Photo uploaded!");

      window.dispatchEvent(new CustomEvent("photo-uploaded"));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="topbar">
      {/* tên sinh viên */}
      <Typography variant="h6">Nguyễn Tiến Thắng</Typography>

      {/* advanced */}
      <div>
        <Checkbox
          checked={advanced}
          onChange={(e) => setAdvanced(e.target.checked)}
          sx={{
            color: "white",

            "&.Mui-checked": {
              color: "white",
            },
          }}
        />

        <span
          style={{
            color: "white",
          }}
        >
          Advanced
        </span>
      </div>

      {/* right side */}
      <div
        style={{
          display: "flex",

          alignItems: "center",

          gap: "10px",
        }}
      >
        <Typography
          style={{
            color: "white",
          }}
        >
          {currentUser ? `Hi ${currentUser.first_name}` : "Please Login"}
        </Typography>

        {/* chỉ hiện khi login */}
        {currentUser && (
          <>
            <input
              type="file"
              id="photo-upload"
              hidden
              onChange={uploadPhoto}
            />

            <Button
              variant="contained"
              component="label"
              htmlFor="photo-upload"
              size="small"
            >
              Add Photo
            </Button>

            <Button variant="contained" size="small" onClick={logout}>
              Logout
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default TopBar;

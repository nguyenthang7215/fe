import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Paper, Typography, Divider } from "@mui/material";

function UserComments() {
  const { userId } = useParams();
  const [comments, setComments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`http://localhost:8080/api/user/comments/${userId}`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Cannot fetch comments");
        }
        return res.json();
      })
      .then((data) => setComments(data))
      .catch((err) => setError(err.message));
  }, [userId]);

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h5" gutterBottom>
        User's Comments
      </Typography>

      {comments.length === 0 ? (
        <Typography>No comments found.</Typography>
      ) : (
        comments.map((item) => (
          <Paper key={item._id} style={{ padding: "10px", marginBottom: "15px", display: "flex", alignItems: "center", gap: "15px" }}>
            <Link to={`/photos/${item.photo.user_id}`}>
              <img
                src={`http://localhost:8080/images/${item.photo.file_name}`}
                alt="thumbnail"
                style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px" }}
              />
            </Link>
            <div>
              <Typography variant="body1">
                <Link to={`/photos/${item.photo.user_id}`} style={{ textDecoration: 'none', color: '#1976d2' }}>
                  "{item.comment}"
                </Link>
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Posted on: {new Date(item.date_time).toLocaleString()}
              </Typography>
            </div>
          </Paper>
        ))
      )}
    </div>
  );
}

export default UserComments;

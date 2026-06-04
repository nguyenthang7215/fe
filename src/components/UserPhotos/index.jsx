import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./styles.css";

function UserPhotos({ advanced }) {
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [index, setIndex] = useState(0);
  // state comment riêng cho từng ảnh: { [photoId]: "text" }
  const [commentTexts, setCommentTexts] = useState({});

  const handleCommentChange = (photoId, value) => {
    setCommentTexts((prev) => ({ ...prev, [photoId]: value }));
  };

  const addComment = async (photoId) => {
    const text = commentTexts[photoId] || "";
    if (!text.trim()) {
      return alert("Comment cannot be empty");
    }
    try {
      const res = await fetch(
        `http://localhost:8080/api/photo/commentsOfPhoto/${photoId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ comment: text }),
        }
      );

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
      }

      // reload photos của user
      const updated = await fetch(
        `http://localhost:8080/api/photo/photosOfUser/${userId}`,
        { credentials: "include" }
      );
      const data = await updated.json();
      setPhotos(data);

      // xóa ô input của ảnh đó
      setCommentTexts((prev) => ({ ...prev, [photoId]: "" }));
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    const fetchPhotos = () =>
      fetch(`http://localhost:8080/api/photo/photosOfUser/${userId}`, {
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok) throw new Error(`Status ${res.status}`);
          return res.json();
        })
        .then((data) => setPhotos(data))
        .catch((err) => console.log(err));

    fetchPhotos();
    window.addEventListener("photo-uploaded", fetchPhotos);
    return () => window.removeEventListener("photo-uploaded", fetchPhotos);
  }, [userId]);

  if (photos.length === 0) {
    return <div>No photos</div>;
  }

  const renderPhoto = (photo) => (
    <div key={photo._id}>
      <img
        src={`http://localhost:8080/images/${photo.file_name}`}
        alt={photo.file_name}
        style={{ width: "100%", maxWidth: "400px", height: "auto", borderRadius: "8px", border: "1px solid #ccc" }}
      />

      <p>{new Date(photo.date_time).toLocaleString()}</p>

      {(photo.comments || []).map((c) => (
        <div key={c._id}>
          <Link to={`/users/${c.user._id}`}>
            {c.user.first_name} {c.user.last_name}
          </Link>
          : {c.comment}
        </div>
      ))}

      {/* add comment — input riêng cho mỗi ảnh */}
      <div className="comment-box">
        <input
          type="text"
          placeholder="Write a comment..."
          value={commentTexts[photo._id] || ""}
          onChange={(e) => handleCommentChange(photo._id, e.target.value)}
        />
        <button onClick={() => addComment(photo._id)}>Add</button>
      </div>
    </div>
  );

  return advanced ? (
    <div>
      {renderPhoto(photos[index])}

      <button disabled={index === 0} onClick={() => setIndex(index - 1)}>
        Prev
      </button>

      <button
        disabled={index === photos.length - 1}
        onClick={() => setIndex(index + 1)}
      >
        Next
      </button>
    </div>
  ) : (
    <div className="standard-view">{photos.map(renderPhoto)}</div>
  );
}

export default UserPhotos;

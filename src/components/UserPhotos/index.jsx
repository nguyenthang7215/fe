import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./styles.css";

function UserPhotos({ advanced }) {
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [index, setIndex] = useState(0);
  const [newComment, setNewComment] = useState("");
  // thêm comment
  const addComment = async (photoId) => {
    try {
      const res = await fetch(
        `https://trkp7s-8080.csb.app/api/photo/commentsOfPhoto/${photoId}`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            comment: newComment,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Comment cannot be empty");
      }

      // reload photos
      const updated = await fetch(
        `https://trkp7s-8080.csb.app/api/photo/photosOfUser/${userId}`,
        {
          credentials: "include",
        }
      );

      const data = await updated.json();

      setPhotos(data);

      setNewComment("");
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetch(`https://trkp7s-8080.csb.app/api/photo/photosOfUser/${userId}`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Status ${res.status}`);
        }

        return res.json();
      })
      .then((data) => {
        console.log("photos:", data);

        setPhotos(data);
      })
      .catch((err) => console.log(err));
  }, [userId]);

  if (photos.length === 0) {
    return <div>No photos</div>;
  }

  const renderPhoto = (photo) => (
    <div key={photo._id}>
      <img
        src={`https://trkp7s-8080.csb.app/images/${photo.file_name}`}
        alt={photo.file_name}
        style={{
          maxWidth: "100%",
        }}
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

      {/* add comment */}
      <div className="comment-box">
        <input
          type="text"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
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

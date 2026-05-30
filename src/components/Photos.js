import { useEffect, useState } from "react";

const API_BASE = "https://tq3dhx-8080.csb.app";

export default function Photos() {
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${API_BASE}/photos`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!response.ok) {
          const text = await response.text();
          setError(text || "Failed to load photos");
          return;
        }

        const result = await response.json();
        setPhotos(result);
      } catch (err) {
        console.error("Load photos error:", err);
        setError("Failed to load photos");
      }
    };

    fetchPhotos();
  }, []);

  if (error) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Your Photos</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Your Photos</h2>
      {photos.length === 0 ? (
        <p>No photos yet.</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {photos.map((photo) => (
            <div key={photo._id}>
              <img
                src={`${API_BASE}/images/${photo.file_name}`}
                alt="User upload"
                style={{ width: 200, height: 200, objectFit: "cover" }}
              />
              <div style={{ fontSize: 12, color: "#666" }}>
                {new Date(photo.date_time).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

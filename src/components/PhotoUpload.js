import { useState } from "react";

const API_BASE = "https://tq3dhx-8080.csb.app";

export default function PhotoUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [uploadedPhoto, setUploadedPhoto] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!file) {
      setMessage("Please choose a file");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const formData = new FormData();
      formData.append("photo", file);

      const response = await fetch(`${API_BASE}/photos/new`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        setMessage(text || "Upload failed");
        return;
      }

      const result = await response.json();
      setUploadedPhoto(result);
      setMessage("Upload success");
      setFile(null);
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("Upload failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Add Photo</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => setFile(event.target.files?.[0] || null)}
        />
        <button type="submit" style={{ marginLeft: 8 }}>
          Upload
        </button>
      </form>
      {message && <p>{message}</p>}
      {uploadedPhoto && (
        <div>
          <p>Uploaded:</p>
          <img
            src={`${API_BASE}/images/${uploadedPhoto.file_name}`}
            alt="Uploaded"
            style={{ maxWidth: 320 }}
          />
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

const API_BASE = "https://tq3dhx-8080.csb.app";

export default function Post() {
  const { slug } = useParams();
  const [post, setPost] = useState({});
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${API_BASE}/api/post/${slug}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const result = await response.json();
        setPost(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [slug]);

  const onSubmitComment = async (data) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${API_BASE}/api/commentsOfPhoto/${post._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ comment: data.newComment }),
        }
      );

      if (response.ok) {
        const result = await response.json();

        // Cập nhật lại state để hiển thị comment mới ngay lập tức
        setPost((prevPost) => ({
          ...prevPost,
          comment: [...(prevPost.comment || []), result],
        }));

        reset(); // Xoá trắng ô input sau khi gửi
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // Trích xuất dữ liệu, để mặc định mảng comment rỗng nếu bài viết chưa có comment nào
  const { title, description, comment = [] } = post;

  return (
    <div style={{ padding: 20 }}>
      <h3>{title}</h3>
      <p>{description}</p>

      <hr />

      <h4>Bình luận ({comment.length})</h4>
      <ul>
        {comment.map((cmt, index) => (
          <li key={index}>
            {typeof cmt === "string" ? cmt : cmt.comment}
            {typeof cmt === "string" ? null : (
              <small style={{ marginLeft: 8, color: "#666" }}>
                {new Date(cmt.date_time).toLocaleString()}
              </small>
            )}
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit(onSubmitComment)}>
        <input
          type="text"
          placeholder="Viết bình luận..."
          {...register("newComment", { required: true })}
        />
        <button type="submit">Gửi</button>
      </form>
    </div>
  );
}

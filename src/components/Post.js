import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

export default function Post() {
  const { slug } = useParams();
  const [post, setPost] = useState({});
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://tq3dhx-8080.csb.app/api/post/" + slug
        );
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
      const response = await fetch(
        `https://tq3dhx-8080.csb.app/api/post/${slug}/comment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        const result = await response.json();

        // Cập nhật lại state để hiển thị comment mới ngay lập tức
        setPost((prevPost) => ({
          ...prevPost,
          comment: [...(prevPost.comment || []), result.comment],
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
          <li key={index}>{cmt}</li>
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

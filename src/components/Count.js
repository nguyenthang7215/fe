import { useEffect, useState } from "react";

const BACKEND_URL = "https://tq3dhx-8080.csb.app";

export default function CountBlogPost() {
  const [count, setCount] = useState([]);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/count`)
      .then((res) => res.json())
      .then((data) => setCount(data))
      .catch((err) => console.error("Error fetching posts:", err));
  }, []);

  return (
    <div>
      <h1>The number of blog post: {count}</h1>
    </div>
  );
}

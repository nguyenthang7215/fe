import { Outlet, Link } from "react-router-dom";

export default function Posts() {
  return (
    <div style={{ padding: 20 }}>
      <Link to={"/newpost"}>
        <button>Add New Post</button>
      </Link>
      <h2>Blog</h2>
      <Outlet />
    </div>
  );
}

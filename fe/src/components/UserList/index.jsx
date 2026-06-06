import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./styles.css";

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = () => {
      fetch("http://localhost:8080/api/user/list", {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          setUsers(data);
        });
    };

    fetchUsers();

    window.addEventListener("photo-uploaded", fetchUsers);
    window.addEventListener("comment-added", fetchUsers);

    return () => {
      window.removeEventListener("photo-uploaded", fetchUsers);
      window.removeEventListener("comment-added", fetchUsers);
    };
  }, []);

  return (
    <div className="user-list">
      <h3>Users</h3>
      <ul>
        {users.map((user) => (
          <li key={user._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <Link to={`/users/${user._id}`} style={{ textDecoration: 'none', color: '#333' }}>
              {user.first_name} {user.last_name}
            </Link>
            
            <div style={{ display: 'flex', gap: '5px' }}>
              {user.photo_count !== undefined && (
                <Link to={`/photos/${user._id}`} style={{ textDecoration: 'none' }}>
                  <span style={{ backgroundColor: 'green', color: 'white', borderRadius: '10px', padding: '2px 6px', fontSize: '12px', cursor: 'pointer' }}>
                    {user.photo_count}
                  </span>
                </Link>
              )}
              {user.comment_count !== undefined && (
                <Link to={`/comments/${user._id}`} style={{ textDecoration: 'none' }}>
                  <span style={{ backgroundColor: 'red', color: 'white', borderRadius: '10px', padding: '2px 6px', fontSize: '12px', cursor: 'pointer' }}>
                    {user.comment_count}
                  </span>
                </Link>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;

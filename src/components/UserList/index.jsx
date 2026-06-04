import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./styles.css";

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/user/list", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Dữ liệu từ API:", data);
        setUsers(data);
      });
  }, []);

  return (
    <div className="user-list">
      <h3>Users</h3>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            <Link to={`/users/${user._id}`}>
              {user.first_name} {user.last_name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;

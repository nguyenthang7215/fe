import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./styles.css";

function UserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/user/${userId}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, [userId]);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h2>
        {user.first_name} {user.last_name}
      </h2>
      <p>Location: {user.location}</p>
      <p>Occupation: {user.occupation}</p>
      <p>Description: {user.description}</p>

      <Link to={`/photos/${user._id}`}>View Photos</Link>
    </div>
  );
}

export default UserDetail;

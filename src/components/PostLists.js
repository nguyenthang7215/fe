import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE = "https://tq3dhx-8080.csb.app";

export default function PostLists() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${API_BASE}/api/posts`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("An error occurred while fetching the data.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <ul>
      {data.map((d) => (
        <li key={d.slug}>
          <Link to={`/posts/${d.slug}`}>
            <h3>{d.title}</h3>
          </Link>
        </li>
      ))}
    </ul>
  );
}

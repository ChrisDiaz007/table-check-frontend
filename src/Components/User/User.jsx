import "./User.css";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import TokenStore from "../../Auth/TokenStore";

const User = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        const token = TokenStore.getAccessToken(); // use method from default export
        const res = await axios.get(
          `http://localhost:3000/api/v1/users/${id}`,
          {
            withCredentials: true, // send refresh cookie
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );

        if (ignore) return;

        const item = res.data.data;
        const flatUser = { id: Number(item.id), ...item.attributes };
        setUser(flatUser);
      } catch (err) {
        if (ignore) return;
        setLoadError(err);
        console.error("Error fetching User", err);

        if (err.response?.status === 401) {
          navigate("/login");
        }
      }
    })();

    return () => {
      ignore = true;
    };
  }, [id, navigate]);

  if (loadError && !user) return <div>Failed to load user.</div>;
  if (!user) return <div>Loading...</div>;

  return (
    <div className="User-Detail">
      <p>test</p>
      <div className="Account-Page">
        <div className="Wrapper">
          <div className="Sidebar">
            <div className="Login-Wrapper">
              <div className="icon">🐤</div>
              <div className="details">
                <p>
                  {user.first_name} {user.last_name}
                </p>
                <p>{user.email}</p>
              </div>
            </div>
            <div>
              <Link to={"/restaurants/new"}>
                <p>New Restaurant</p>
              </Link>
            </div>
          </div>
          <div className="Content">
            <h1>Account</h1>
            <button onClick={() => navigate("/Restaurants/new")}>
              <p>New Restaurants</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;

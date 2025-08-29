import "./User.css";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import TokenStore from "../../Auth/TokenStore";
import UserRestaurants from "./UserRestaurants";
import UpdateProfile from "./UpdateProfile";

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
      <div className="Account-Page">
        <div className="Wrapper">
          <section className="Sidebar">
            <div className="Login-Wrapper">
              <div className="icon">🐤</div>
              <div className="details">
                <p className="font-bold">
                  {user.first_name} {user.last_name}
                </p>
                <p className="font-light">{user.email}</p>
              </div>
            </div>
            <div>
              <Link to={"/restaurants/new"}>
                <p>New Restaurant</p>
              </Link>
            </div>
          </section>
          <section className="User-Content">
            <h1>Profile</h1>

            <div>
              <p>My restaurants</p>
              <div>
                <UserRestaurants />
              </div>
            </div>
            <UpdateProfile />
            <div></div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default User;

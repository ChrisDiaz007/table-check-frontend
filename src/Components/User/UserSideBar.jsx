import "./UserProfile.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import TokenStore from "../../Auth/TokenStore";
import axios from "axios";

const UserSideBar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({});

  // prettier-ignore
  useEffect(() => {
    const token = TokenStore.getAccessToken();
    axios
      .get(`http://localhost:3000/api/v1/users/${id}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} },
      )
      .then((res) => {
        const item = res.data.data;
        setUser( { id: item.id, ...item.attributes } );
      })
      .catch((err) => { console.error("Error Fetching User", err); 
        if (err.response?.status === 401) navigate("/login");
       });
  }, [id, navigate])

  return (
    <section className="User-SideBar">
      <div className="User-Info-Wrapper">
        <div className="User-Info-icon">🐤</div>
        <div className="User-Info-details">
          <p className="font-bold">
            {user.first_name} {user.last_name}
          </p>
          <p className="font-light">{user.email}</p>
        </div>
      </div>
      <div>
        <Link to={`/users/${id}`} className="User-SideBar-Links">
          Profile
        </Link>
      </div>
    </section>
  );
};

export default UserSideBar;

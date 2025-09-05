import "./UserProfile.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import TokenStore from "../../Auth/TokenStore";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faChair,
  faCircleUser,
  faClock,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";

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
    <section className="User-SideBar flex flex-col gap-4">
      <div className="User-Info-Wrapper">
        <div className="User-Info-icon">🐤</div>
        <div className="User-Info-details">
          <p className="font-bold">
            {user.first_name} {user.last_name}
          </p>
          <p className="font-light">{user.email}</p>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <Link to={`/users/${id}`} className="User-SideBar-Links">
          <FontAwesomeIcon icon={faCircleUser} className="fa-xl" /> Profile
        </Link>
        <Link to={`/users/${id}/bookings`} className="User-SideBar-Links">
          <FontAwesomeIcon icon={faBook} className="fa-xl" /> Bookings
        </Link>
        <Link to={`/users/${id}/restaurants`} className="User-SideBar-Links">
          <FontAwesomeIcon icon={faUtensils} className="fa-xl" /> Restaurants
        </Link>
        <Link to={`/users/${id}/tables`} className="User-SideBar-Links">
          <FontAwesomeIcon icon={faChair} className="fa-xl" /> Manage Tables
        </Link>
        <Link to={`/users/${id}/hours`} className="User-SideBar-Links">
          <FontAwesomeIcon icon={faClock} className="fa-xl" /> Manage Hours
        </Link>
      </div>
    </section>
  );
};

export default UserSideBar;

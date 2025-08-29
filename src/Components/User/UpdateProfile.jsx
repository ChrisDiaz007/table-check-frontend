import "./User.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import TokenStore from "../../Auth/TokenStore";

const UpdateProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = TokenStore.getAccessToken(); // if you're using JWTs
    axios
      .get(`http://localhost:3000/api/v1/users/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then((res) => {
        const item = res.data.data;
        setUser({ id: item.id, ...item.attributes });
      })
      .catch((err) => {
        console.error("Error fetching user", err);
      });
  }, [id, navigate]);
  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <p>test profile</p>
      <p>{user.first_name}</p>
      <p>{user.last_name}</p>
      <p>test</p>
    </div>
  );
};

export default UpdateProfile;

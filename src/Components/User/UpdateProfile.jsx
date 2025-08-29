import "./User.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import TokenStore from "../../Auth/TokenStore";

const UpdateProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
  });

  // Load User
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

  // Update User
  const handleInput = (event) => {
    const { name, value } = event.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    const token = TokenStore.getAccessToken();
    event.preventDefault();
    axios
      .patch(
        `http://localhost:3000/api/v1/users/${id}`,
        { user: profile },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => console.log("Form Submitted Successfully", response))
      .catch((error) => console.log("Error submitting form", error));
  };

  return (
    // prettier-ignore
    <div>
      <p>Update profile</p>
      
      <form onSubmit={handleSubmit} className="flex flex-col">
        First Name : <input type="text" onChange={handleInput} name="first_name" />
        Last Name : <input type="text" onChange={handleInput} name="last_name" />
        <button type="Submit">Update Account</button>
      </form>
    </div>
  );
};

export default UpdateProfile;

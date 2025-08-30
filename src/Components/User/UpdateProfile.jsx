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
    phone_number: "",
  });

  // Load User
  useEffect(() => {
    const token = TokenStore.getAccessToken();
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
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => response, window.location.reload())
      .catch((error) => console.log("Error submitting form", error));
  };

  return (
    // prettier-ignore
    <section className="User-Update-Profile">
      <div>
        <p className="font-[600] text-3xl pb-5">Profile</p>
      </div>
      <div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex gap-6">
            <div className="flex flex-col">
              <p>First Name</p>
              <input type="text" onChange={handleInput} name="first_name" placeholder={user.first_name} className="border p-1.5"/>
            </div>
            <div className="flex flex-col">
              <p>Last Name</p>
              <input type="text" onChange={handleInput} name="last_name" placeholder={user.last_name} className="border p-1.5" />
            </div>
          </div>
          <div>
              <p>Email</p>
              <p className="border p-1.5 bg-gray-200 text-gray-400">{user.email}</p>
          </div>
          <div>
              <p>Phone Number</p>
              <input type="text" onChange={handleInput} name="phone_number" 
              placeholder={user.phone_number ? user.phone_number : "🇯🇵 Phone Number"} 
              className="border p-1.5"/>
          </div>
        <button type="Submit">Save Profile</button>
        </form>
      </div>
    </section>
  );
};

export default UpdateProfile;

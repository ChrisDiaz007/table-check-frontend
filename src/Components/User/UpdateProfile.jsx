import "./UserProfile.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import TokenStore from "../../Auth/TokenStore";

const UpdateProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
  });

  // Load User
  useEffect(() => {
    const token = TokenStore.getAccessToken();
    axios
      .get(`http://localhost:3000/api/v1/users/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const item = res.data.data;
        setUser({ id: item.id, ...item.attributes });
      })
      .catch((err) => {
        console.error("Error fetching user", err);
      });
  }, [id]);
  if (!user) return <div>Loading...</div>;
  console.log(user);

  // Update User
  const handleInput = (event) => {
    const { name, value } = event.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    // event.preventDefault();
    const token = TokenStore.getAccessToken();

    axios
      .patch(
        `http://localhost:3000/api/v1/users/${id}`,
        {
          user: {
            first_name: user.first_name,
            last_name: user.last_name,
            phone_number: user.phone_number,
          },
        },
        {
          withCredentials: true,
          headers: token
            ? {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`,
              }
            : {},
        }
      )
      .catch((error) => console.log("Error submitting form", error));
  };

  return (
    // prettier-ignore
    <section className="User-Update-Profile">
      <div>
        <p className="font-[600] text-3xl pb-5">Account</p>
      </div>
      <div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex gap-6">
            <div className="flex flex-col">
              <p>First Name</p>
              <input type="text" onChange={handleInput} name="first_name" value={user.first_name} className="border p-1.5"/>
            </div>
            <div className="flex flex-col">
              <p>Last Name</p>
              <input type="text" onChange={handleInput} name="last_name" value={user.last_name} className="border p-1.5" />
            </div>
          </div>
          <div>
              <p>Email</p>
              <p className="border p-1.5 bg-gray-200 text-gray-400">{user.email}</p>
          </div>
          <div>
              <p>Phone Number</p>
              <input type="text" onChange={handleInput} name="phone_number" value={user.phone_number ?? ""} className="border p-1.5"/>
          </div>
        <button  className="cursor-pointer bg-black text-white p-2 rounded-md" type="Submit">Save Profile</button>
        </form>
      </div>
    </section>
  );
};

export default UpdateProfile;

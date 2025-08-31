import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TokenStore from "../../../Auth/TokenStore";
import { useAuth } from "../../../Auth/UseAuth";

const RestaurantNew = () => {
  const navigate = useNavigate();
  const token = TokenStore.getAccessToken();
  const { user: User } = useAuth();

  const [restaurant, setRestaurant] = useState({
    name: "",
    address: "",
    prefecture: "",
    district: "",
    description: "",
    phone_number: "",
    website: "",
    total_tables: "",
    about: "",
    lunch_price: "",
    dinner_price: "",
    photo: null,
    // cuisine_ids: "",
  });

  const handleInput = (event) => {
    const { name, value } = event.target;
    setRestaurant((prev) => ({ ...prev, [name]: value }));
  };

  //new
  const handleFileInput = (event) => {
    const { name, files } = event.target;
    setRestaurant((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    Object.keys(restaurant).forEach((key) => {
      if (restaurant[key] !== null) {
        formData.append(`restaurant[${key}]`, restaurant[key]);
      }
    });

    axios
      .post("http://localhost:3000/api/v1/restaurants", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(
        (response) => console.log("Form Submitted Successfully", response),
        navigate(`/users/${User.id}/restaurants`)
      )
      .catch((error) => console.log("Error submitting form", error));
  };

  // prettier-ignore
  return (
    <div className="">
      <div>
        <form onSubmit={handleSubmit} className="flex flex-col">
          Name : <input type="text" onChange={handleInput} name="name" />
          Address : <input type="text" onChange={handleInput} name="address" />
          Prefecture : <input type="text" onChange={handleInput} name="prefecture" />
          District : <input type="text" onChange={handleInput} name="district" />
          About : <input type="text" onChange={handleInput} name="about" />
          Description : <input type="text" onChange={handleInput} name="description" />
          Phone Number : <input type="text" onChange={handleInput} name="phone_number" />
          Website : <input type="text" onChange={handleInput} name="website" />
          Total Tables : <input type="text" onChange={handleInput} name="total_tables" />
          Lunch Price : <input type="text" onChange={handleInput} name="lunch_price" />
          Dinner Price : <input type="text" onChange={handleInput} name="dinner_price" />
          Photo : <input type="file" onChange={handleFileInput} name="photo" accept="image/*" required />
          <button type="submit">
            Create Restaurant
          </button>
        </form>
      </div>
    </div>
  );
};

export default RestaurantNew;

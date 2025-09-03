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
    // total_tables: "",
    about: "",
    lunch_price: "",
    dinner_price: "",
    photo: null,
    // cuisine_ids: [],
  });

  const handleInput = (event) => {
    const { name, value } = event.target;
    setRestaurant((prev) => ({ ...prev, [name]: value }));
  };

  //Photo
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
        navigate(`/users/${User.id}/restaurants`),
        window.location.reload()
      )
      .catch((error) => console.log("Error submitting form", error));
  };

  // prettier-ignore
  return (
    <section className="Restaurant-New flex justify-center">
      <div className="w-150 flex flex-col pt-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-1">
          <p className="font-semibold text-3xl">New Restaurant Form</p>
          Name : <input type="text" onChange={handleInput} name="name" className="border rounded-md p-2"/>
          Address : <input type="text" onChange={handleInput} name="address" className="border rounded-md p-2"/>
          Prefecture : <input type="text" onChange={handleInput} name="prefecture" className="border rounded-md p-2"/>
          District : <input type="text" onChange={handleInput} name="district" className="border rounded-md p-2"/>
          About : <input type="text" onChange={handleInput} name="about" className="border rounded-md p-2"/>
          Description : <textarea
                          onChange={handleInput}
                          name="description"
                          rows={4}
                          className="border rounded-md w-full h-34 p-2 resize-y align-top"
                        />
          Phone Number : <input type="text" onChange={handleInput} name="phone_number" className="border rounded-md p-2"/>
          Website : <input type="text" onChange={handleInput} name="website" className="border rounded-md p-2"/>
          Lunch Price : <input type="text" onChange={handleInput} name="lunch_price" className="border rounded-md p-2"/>
          Dinner Price : <input type="text" onChange={handleInput} name="dinner_price" className="border rounded-md p-2"/>
          {/* Cuisine: <input type="text" onChange={handleInput} name="cuisine_ids" className="border rounded-md p-2"/> */}
          Photo : <input type="file" onChange={handleFileInput} name="photo" accept="image/*" required className="border rounded w-55 p-2"/>
          
          <span className="flex justify-center pt-5">
            <button type="submit" className="bg-purple-300 p-3 rounded-md">
            Create New Restaurant
          </button>
          </span>
        </form>
      </div>
    </section>
  );
};

export default RestaurantNew;

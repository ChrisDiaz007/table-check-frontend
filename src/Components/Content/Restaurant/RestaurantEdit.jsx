import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TokenStore from "../../../Auth/TokenStore";

const RestaurantEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();

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
    // cuisine_ids: [],
  });

  // Load Restaurant
  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/v1/restaurants/${id}`, {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        const item = res.data.data;
        setRestaurant({ id: item.id, ...item.attributes });
      })
      .catch((error) => {
        console.error("Error fetching restaurant", error);
      });
  }, [id]);
  // console.log(restaurant);

  // Update Restaurant
  const handleInput = (event) => {
    const { name, value } = event.target;
    setRestaurant((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileInput = (event) => {
    const { name, files } = event.target;
    setRestaurant((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = TokenStore.getAccessToken();
    const formData = new FormData();
    Object.keys(restaurant).forEach((key) => {
      if (restaurant[key] !== null) {
        formData.append(`restaurant[${key}]`, restaurant[key]);
      }
    });
    axios
      .patch(`http://localhost:3000/api/v1/restaurants/${id}`, formData, {
        withCredentials: true,
        "Content-Type": "multipart/form-data",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then(
        (response) => response,
        navigate(`/restaurants/${id}`),
        window.location.reload()
      )
      .catch((error) => console.log("Error Updating Restaurant", error));
  };

  return (
    // prettier-ignore
    <section className="Restaurant-New flex justify-center">
      <div className="w-175 flex flex-col pt-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-1">
          <p className="font-semibold text-3xl">Update Restaurant</p>
          Name : <input type="text" onChange={handleInput} name="name" value={restaurant.name} className="border rounded-md p-2"/>
          Address : <input type="text" onChange={handleInput} name="address" value={restaurant.address} className="border rounded-md p-2"/>
          Prefecture : <input type="text" onChange={handleInput} name="prefecture" value={restaurant.prefecture} className="border rounded-md p-2"/>
          District : <input type="text" onChange={handleInput} name="district" value={restaurant.district} className="border rounded-md p-2"/>
          About : <input type="text" onChange={handleInput} name="about" value={restaurant.about} className="border rounded-md p-2"/>
          Description : <textarea
                          onChange={handleInput}
                          name="description"
                          rows={6}
                          value={restaurant.description}
                          className="border rounded-md w-full h-36 p-2 resize-y align-top"
                        />
          Phone Number : <input type="text" onChange={handleInput} name="phone_number" value={restaurant.phone_number} className="border rounded-md p-2"/>
          Website : <input type="text" onChange={handleInput} name="website" value={restaurant.website} className="border rounded-md p-2"/>
          Lunch Price : <input type="text" onChange={handleInput} name="lunch_price" value={restaurant.lunch_price} className="border rounded-md p-2"/>
          Dinner Price : <input type="text" onChange={handleInput} name="dinner_price" value={restaurant.dinner_price} className="border rounded-md p-2"/>
          Photo : <input type="file" onChange={handleFileInput} name="photo" className="border rounded w-55 p-2"/>

          <span className="flex justify-center">
            <button type="Submit" className="bg-green-400 p-2 rounded-md">Save Restaurant</button>
          </span>
        </form>
      </div>
    </section>
  );
};

export default RestaurantEdit;

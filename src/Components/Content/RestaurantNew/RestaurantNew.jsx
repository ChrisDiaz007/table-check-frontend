import axios from "axios";
import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import TokenStore from "../../../Auth/TokenStore";

const RestaurantNew = () => {
  // const navigate = useNavigate();

  const token = TokenStore.getAccessToken();

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
    // photo: "",
    // cuisine_ids: "",
  });

  const handleInput = (event) => {
    const { name, value } = event.target;
    setRestaurant((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    axios
      .post(
        "http://localhost:3000/api/v1/restaurants",
        { restaurant },
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

  // prettier-ignore
  return (
    <div className="">
      <div>
        <form onSubmit={handleSubmit} className="flex flex-col">
          Name : <input type="text" onChange={handleInput} name="name" />
          Address : <input type="text" onChange={handleInput} name="address" />
          Prefecture : <input type="text" onChange={handleInput} name="prefecture" />
          District : <input type="text" onChange={handleInput} name="district" />
          Description : <input type="text" onChange={handleInput} name="description" />
          Phone Number : <input type="text" onChange={handleInput} name="phone_number" />
          Website : <input type="text" onChange={handleInput} name="website" />
          Total Tables : <input type="text" onChange={handleInput} name="total_tables" />
          About : <input type="text" onChange={handleInput} name="about" />
          Lunch Price : <input type="text" onChange={handleInput} name="lunch_price" />
          Dinner Price : <input type="text" onChange={handleInput} name="dinner_price" />
          {/* Photo : <input type="text" onChange={handleInput} name="photo" /> */}
          {/* Photo : <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={(e) => setForm((prev) => ({ ...prev, photo: e.target.files[0] }))}
                  /> */}
          {/* Cuisine : <input type="text" onChange={handleInput} name="cuisine_ids"/> */}

          <button type="submit">
            Create Restaurant
          </button>
        </form>
      </div>
    </div>
  );
};

export default RestaurantNew;

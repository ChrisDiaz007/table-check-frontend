import TokenStore from "@/Auth/TokenStore";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const RestaurantHoursEdit = () => {
  const { id } = useParams();
  const token = TokenStore.getAccessToken();
  const [restaurant_hours, setRestaurant_hours] = useState([]);

  const HOURS = [];
  for (let i = 0; i < 24; i++) {
    HOURS.push(`${String(i).padStart(2, "0")}:00`);
  }

  const DAY_NAMES = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/v1/restaurants/${id}/restaurant_hours`, {
        headers: { "Content-type": "application/json" },
      })
      .then((res) => {
        const flatRestaurant_hours = res.data.data.map((item) => ({
          id: Number(item.id),
          ...item.attributes,
        }));
        setRestaurant_hours(flatRestaurant_hours);
        console.log("Hours Successfully Fetched");
      })
      .catch((err) => {
        console.log("Error", err);
      });
  }, [id]);

  const handleInput = (event, restaurant_hourIndex) => {
    const { name, value } = event.target;
    setRestaurant_hours((previousRestaurant_hours) =>
      previousRestaurant_hours.map((restaurant_hour, currentIndex) =>
        currentIndex === restaurant_hourIndex
          ? { ...restaurant_hour, [name]: value }
          : restaurant_hour
      )
    );
  };

  console.log(restaurant_hours);

  const handleSubmit = async (event) => {
    event.preventDefault();
    Promise.all(
      restaurant_hours.map((restaurant_hour) =>
        axios.patch(
          `http://localhost:3000/api/v1/restaurants/${id}/restaurant_hours/${restaurant_hour.id}`,
          {
            restaurant_hour: {
              day_of_week: Number(restaurant_hour.day_of_week),
              opens_at: restaurant_hour.opens_at,
              closes_at: restaurant_hour.closes_at,
            },
          },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )
      )
    )
      .then((response) => {
        console.log("Updated Restaurant Hours", response);
        const msg = "Hours Successfully Updated";
        alert(msg);
      })
      .catch((error) => console.log("Error Updating Restaurant Hours", error));
  };

  return (
    // prettier-ignore
    <section className="Restaurant-Hours-Edit">
      <div className="pt-20">
        <form onSubmit={handleSubmit} className=" flex flex-col gap-10">
          <div className="flex flex-wrap gap-5">
            {restaurant_hours.map((restaurant_hour, index) => (
              <div key={restaurant_hour.id} className="border rounded-md flex flex-col justify-center items-center p-10 w-75 gap-5">
                <p>Day of Week: {DAY_NAMES[restaurant_hour.day_of_week]}</p>
                <p>Open Hours:
                  <select name="opens_at" onChange={(event) => handleInput (event, index)} value={restaurant_hour.opens_at} className="border p-2 rounded-md">
                    {HOURS.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </p>
                <p>Closing Hours: 
                  <select name="opens_at" onChange={(event) => handleInput (event, index)} value={restaurant_hour.closes_at} className="border p-2 rounded-md">
                    {HOURS.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </p>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center">
            <button type="submit" className="bg-green-400 p-3 cursor-pointer rounded-md hover:bg-green-500">Save Hours</button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default RestaurantHoursEdit;

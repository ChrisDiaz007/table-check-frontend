import TokenStore from "@/Auth/TokenStore";
import axios from "axios";
import { useState } from "react";
import { useParams } from "react-router-dom";

const RestaurantHoursNew = () => {
  const { id } = useParams();
  const token = TokenStore.getAccessToken();
  const [restaurant_hour, setRestaurant_hours] = useState({
    day_of_week: "",
    opens_at: "",
    closes_at: "",
  });
  console.log(restaurant_hour);

  const HOURS = [];
  for (let i = 0; i < 24; i++) {
    HOURS.push(`${String(i).padStart(2, "0")}:00`);
  }

  const handleInput = (event) => {
    const { name, value } = event.target;
    setRestaurant_hours((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    axios
      .post(
        `http://localhost:3000/api/v1/restaurants/${id}/restaurant_hours`,
        { restaurant_hour },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log("Hours Successfully Submitted", response);
      })
      .catch((error) => {
        console.error("Error Submitting Hours", error);
      });
  };

  return (
    // prettier-ignore
    <section className="Restaurant-Hours-New">
      <div className="pt-50">
        <form onSubmit={handleSubmit} className="p-15 flex flex-col items-center border rounded-md gap-5">
          <div>
            <p className="font-semibold text-3xl">Select Open Hours</p>
          </div>
          <div className="flex items-center justify-center gap-5">
            <div>
              <select
              name="day_of_week"
              onChange={handleInput}
              value={restaurant_hour.day_of_week}
              className="border rounded-md p-2 content-center"
              >
                <option value="">Select Date</option>
                <option value={1}>Monday</option>
                <option value={2}>Tuesday</option>
                <option value={3}>Wednesday</option>
                <option value={4}>Thursday</option>
                <option value={5}>Friday</option>
                <option value={6}>Saturday</option>
                <option value={0}>Sunday</option>
              </select>
            </div>
            <div className="flex gap-4">
              <select name="opens_at" onChange={handleInput} value={restaurant_hour.opens_at} className="border p-2 rounded-md">
                <option value="">Opening Time</option>
                {HOURS.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
                <select name="closes_at" onChange={handleInput} value={restaurant_hour.closes_at} className="border p-2 rounded-md">
                  <option value="">Closing Time</option>
                  {HOURS.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
            </div>
          </div>
          <div className="pt-5">
            <button type="submit" className="bg-green-400 p-2 rounded-md cursor-pointer hover:bg-green-500">Create Open Hours</button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default RestaurantHoursNew;

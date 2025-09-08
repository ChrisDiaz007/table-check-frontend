import TokenStore from "@/Auth/TokenStore";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const RestaurantHoursEdit = () => {
  const { id } = useParams();
  const token = TokenStore.getAccessToken();
  const [restaurant_hours, setRestaurant_hours] = useState([]);
  const [changedHours, setChangedHours] = useState(new Set()); // WHAT IS CHANGED: Added to track which hours were modified

  // WHAT IS FINE: Hour generation logic is good
  const HOURS = [];
  for (let i = 0; i < 24; i++) {
    HOURS.push(`${String(i).padStart(2, "0")}:00`);
  }

  // WHAT IS FINE: Day names array is good
  const DAY_NAMES = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  console.log(restaurant_hours);

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

  const handleInput = (event, restaurant_hourIndex, restaurant_hourId) => {
    const { name, value } = event.target;

    // WHAT IS CHANGED: Track which hours were modified
    setChangedHours((prev) => new Set(prev).add(restaurant_hourId));

    // WHAT IS FINE: Local state update logic is good
    setRestaurant_hours((previousRestaurant_hours) =>
      previousRestaurant_hours.map((restaurant_hour, currentIndex) =>
        currentIndex === restaurant_hourIndex
          ? { ...restaurant_hour, [name]: value }
          : restaurant_hour
      )
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // WHAT IS CHANGED: Only update hours that were actually changed
    const hoursToUpdate = restaurant_hours.filter((hour) =>
      changedHours.has(hour.id)
    );

    if (hoursToUpdate.length === 0) {
      alert("No changes to save!");
      return;
    }

    Promise.all(
      // WHAT IS CHANGED: Only map over changed hours instead of all hours
      hoursToUpdate.map((restaurant_hour) =>
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
        const msg = `Updated ${hoursToUpdate.length} hour(s) successfully`;
        alert(msg);
        setChangedHours(new Set()); // WHAT IS CHANGED: Clear the changed hours after successful update
      })
      .catch((error) => {
        console.log("Error Updating Restaurant Hours", error);
        alert("Error updating hours. Please try again.");
      });
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
                  <select name="opens_at" onChange={(event) => handleInput(event, index, restaurant_hour.id)} value={restaurant_hour.opens_at} className="border p-2 rounded-md">
                    {HOURS.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </p>
                <p>Closing Hours: 
                  <select name="closes_at" onChange={(event) => handleInput(event, index, restaurant_hour.id)} value={restaurant_hour.closes_at} className="border p-2 rounded-md">
                    {HOURS.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </p>
                {changedHours.has(restaurant_hour.id) && (
                  <span className="text-sm text-blue-500">Modified</span>
                )}
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center">
            <button type="submit" className="bg-green-400 p-3 cursor-pointer rounded-md hover:bg-green-500">
              Save {changedHours.size} Change{changedHours.size !== 1 ? 's' : ''}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default RestaurantHoursEdit;

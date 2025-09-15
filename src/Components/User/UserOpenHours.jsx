import axios from "axios";
import UserSideBar from "./UserSideBar";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const UserOpenHours = () => {
  const { id } = useParams();
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/v1/users/${id}/restaurants`, {
        header: { "Content-Type": "application/json" },
      })
      .then((res) => {
        const flatRestaurants = res.data.data.map((item) => ({
          id: item.id,
          ...item.attributes,
        }));
        setRestaurants(flatRestaurants);
        console.log(flatRestaurants);
      })
      .catch((err) => {
        console.log("Error fetching restaurants", err);
      });
  }, [id]);

  return (
    <section className="User-Open-Hours">
      <div className="Wrapper flex flex-wrap">
        <section className="Sidebar">
          <div>
            <UserSideBar />
          </div>
        </section>
        <section>
          <div className="flex flex-col gap-5">
            <div>
              <p className="font-semibold text-3xl">Open Hours</p>
            </div>
            <div>
              {restaurants.length === 0 ? (
                "No Restaurants Created"
              ) : (
                <section className="Restaurants flex flex-col gap-6">
                  {restaurants.map((restaurant) => (
                    <div key={restaurant.id}>
                      <div className="flex gap-5">
                        <div>
                          <img
                            className="ImageWrapped"
                            src={restaurant.photo_url}
                            alt={`${restaurant.name} photo`}
                            style={{
                              width: "200px",
                              height: "125px",
                              objectFit: "cover",
                              borderRadius: "8px",
                            }}
                          />
                          <p className="font-bold">{restaurant.name}</p>
                        </div>
                        <div className="flex flex-col gap-5">
                          <Link
                            to={`/restaurants/${restaurant.id}/hours/new`}
                            className="bg-green-400 p-2 rounded-md cursor-pointer hover:bg-green-500 text-center"
                          >
                            Create Date/Hours
                          </Link>
                          <Link
                            to={`/restaurants/${restaurant.id}/hours/edit`}
                            className="bg-yellow-300 p-2 rounded-md cursor-pointer hover:bg-amber-500 text-center"
                          >
                            Edit Date/Hours
                          </Link>
                        </div>
                      </div>
                      <div>
                        {restaurant.restaurant_hours.length === 0 ? (
                          "No Date/Hours Created"
                        ) : (
                          <div>
                            {restaurant.restaurant_hours.map((hour) => (
                              <div key={hour.id} className="flex gap-3">
                                <p className="w-23 font-semibold">
                                  {hour.day_of_week}
                                </p>
                                <p>
                                  {hour.opens_at} - {hour.closes_at}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </section>
              )}
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default UserOpenHours;

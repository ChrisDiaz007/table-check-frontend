import axios from "axios";
import UserSideBar from "./UserSideBar";
import { useEffect, useState } from "react";
import TokenStore from "../../Auth/TokenStore";
import { useParams, Link } from "react-router-dom";

const UserTables = () => {
  const { id } = useParams();
  const token = TokenStore.getAccessToken();

  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/v1/users/${id}/restaurants`, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        const flatRestaurants = response.data.data.map((item) => ({
          id: Number(item.id),
          ...item.attributes,
        }));
        setRestaurants(flatRestaurants);
        console.log(flatRestaurants);
      })
      .catch((error) => {
        console.error("Error fetching restaurants", error);
      });
  }, [id]);

  return (
    <section className="User-Tables">
      <div className="Wrapper flex flex-wrap">
        <section className="Sidebar">
          <div>
            <UserSideBar />
          </div>
        </section>
        <section className="flex-1">
          <div className="flex flex-col gap-5">
            <div>
              <p className="font-semibold text-3xl">Table List</p>
            </div>
            <div>
              {restaurants.length === 0 ? (
                "No Restaurants Created"
              ) : (
                <div className="flex flex-col flex-wrap gap-6">
                  {restaurants.map((restaurant) => (
                    <div key={restaurant.id} className="w-100">
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
                            to={`/restaurants/${restaurant.id}/Tables/new`}
                            className="bg-green-400 p-2 rounded-md hover:bg-green-500 text-center"
                          >
                            Create Table
                          </Link>
                          <Link
                            to={`/restaurants/${restaurant.id}/Tables/edit`}
                            className="rounded-md p-2 bg-yellow-400 text-center hover:bg-yellow-500"
                          >
                            Edit Tables
                          </Link>
                        </div>
                      </div>
                      <div>
                        {restaurant.tables.length === 0 ? (
                          "No tables Registered"
                        ) : (
                          <div>
                            {restaurant.tables.map((table) => (
                              <div key={table.id}>
                                <div className="flex border p-1 rounded-md w-85">
                                  <div className="flex gap-2 w-40">
                                    <p>Table Number:</p>
                                    <p>{table.number}</p>
                                  </div>
                                  <div className="flex gap-2">
                                    <p>Number of Seats:</p>
                                    <p>{table.seats}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default UserTables;

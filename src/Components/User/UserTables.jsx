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
          // ...item.attributes,
          id: Number(item.attributes.id),
          name: item.attributes.name,
          photo: item.attributes.photo_url,
          tables: item.attributes.tables,
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
        <section className="flex-1 flex flex-col gap-5">
          <div>
            <p className="font-semibold text-3xl">Table List</p>
          </div>
          <div>
            {restaurants.length === 0 ? (
              <p>Restaurants Avaliable {restaurants.length}</p>
            ) : (
              <div className="flex flex-wrap gap-10">
                {restaurants.map((restaurant) => (
                  <div
                    key={restaurant.id}
                    className="bg-purple-200 w-75 rounded-md flex flex-col gap-4"
                  >
                    <div>
                      <p className="font-bold ps-6 pt-5 text-purple-900">
                        {restaurant.name}
                      </p>
                    </div>
                    <div className="ImageWrapper flex justify-center">
                      {restaurant.photo ? (
                        <img
                          className="ImageWrapped"
                          src={restaurant.photo}
                          alt={`${restaurant.name} photo`}
                          style={{
                            width: "85%",
                            height: "175px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                      ) : (
                        <div>No Image</div>
                      )}
                    </div>
                    <div className="ps-5 pb-5 pt-5 flex gap-5">
                      <Link
                        to={`/restaurants/${restaurant.id}/Tables/new`}
                        className="bg-green-400 p-3 rounded-md cursor-pointer hover:bg-green-500 text-center text-purple-600 font-bold"
                      >
                        Create Table
                      </Link>
                      <Link
                        to={`/restaurants/${restaurant.id}/Tables/edit`}
                        className="bg-yellow-400 p-3 rounded-md cursor-pointer hover:bg-yellow-500 text-center text-gray-700 font-bold"
                      >
                        Edit Tables
                      </Link>
                    </div>
                    <div className="flex flex-wrap gap-5 ps-5 pb-6 pt-6 border-t border-t-purple-500">
                      {restaurant.tables.length === 0 ? (
                        <p>Tables Registered: {restaurant.tables.length}</p>
                      ) : (
                        <div>
                          {restaurant.tables.map((table) => (
                            <div key={table.id}>
                              <div className="flex p-1 rounded-md w-85">
                                <div className="flex gap-2 w-35">
                                  <p>Table Number:</p>
                                  <p>{table.number}</p>
                                </div>
                                <div className="flex gap-2">
                                  <p>Seats:</p>
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
        </section>
      </div>
    </section>
  );
};

export default UserTables;

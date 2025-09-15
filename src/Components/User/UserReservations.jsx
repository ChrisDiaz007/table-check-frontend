import { useParams, Link } from "react-router-dom";
import UserSideBar from "./UserSideBar";
import axios from "axios";
import { useEffect, useState } from "react";
import TokenStore from "@/Auth/TokenStore";

const UserReservations = () => {
  const { id } = useParams();
  const token = TokenStore.getAccessToken();
  const [restaurants, setRestaurants] = useState([]);
  console.log(restaurants);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/v1/users/${id}/restaurants`, {
        headers: {
          "Content-Type": "applications/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const flatRestaurants = response.data.data.map((item) => ({
          id: Number(item.id),
          ...item.attributes,
        }));
        setRestaurants(flatRestaurants);
      })
      .catch((err) => {
        console.error("Error Fetching Restaurants", err);
      });
  }, [id]);

  useEffect(() => {
    axios.get(``);
  });

  return (
    <section className="User-Reservations">
      <div className="Wrapper flex flex-wrap">
        <section className="Sidebar">
          <div>
            <UserSideBar />
          </div>
        </section>
        <section>
          <div className="flex flex-col gap-5">
            <div>
              <p className="font-semibold text-3xl">Reservations</p>
            </div>
            <div>
              {restaurants.length === 0 ? (
                "No Restaurants Avaliable"
              ) : (
                <section className="Reservations flex flex-col gap-6">
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
                          {restaurant.reservations.length === 0 ? (
                            ""
                          ) : (
                            <>
                              <Link
                                to={`/restaurants/${restaurant.id}/reservations`}
                                className="bg-green-400 p-2 rounded-md cursor-pointer hover:bg-green-500 text-center"
                              >
                                View Reservations
                              </Link>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="CardInfo">
                        {restaurant.reservations.length === 0 ? (
                          <p>0 Reservations Found</p>
                        ) : (
                          <>
                            <p>
                              Total Reservations:{" "}
                              {restaurant.reservations.length}
                            </p>
                            <p>
                              Pending Reservations:{" "}
                              {
                                restaurant.reservations.filter(
                                  (reservations) =>
                                    reservations.status === "pending"
                                ).length
                              }
                            </p>
                            <p>
                              Accepted Reservations:{" "}
                              {
                                restaurant.reservations.filter(
                                  (reservations) =>
                                    reservations.status === "accepted"
                                ).length
                              }
                            </p>
                          </>
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

export default UserReservations;

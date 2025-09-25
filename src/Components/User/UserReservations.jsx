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
          // ...item.attributes,
          id: Number(item.attributes.id),
          name: item.attributes.name,
          photo: item.attributes.photo_url,
          reservations: item.attributes.reservations,
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
        <section className="flex-1 flex flex-col gap-5">
          <div>
            <p className="font-semibold text-3xl">Reservations</p>
          </div>
          <section>
            {restaurants.length === 0 ? (
              <p>Restaurants Avaliable {restaurants.length}</p>
            ) : (
              <section className="flex flex-wrap gap-10">
                {restaurants.map((restaurant) => (
                  <div
                    key={restaurant.id}
                    className="border border-purple-400 bg-purple-200 w-75 rounded-md flex flex-col gap-4"
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
                    <div className="ps-5 pb-5 pt-5">
                      <Link
                        to={`/restaurants/${restaurant.id}/reservations`}
                        className="bg-green-400 p-3 rounded-md cursor-pointer hover:bg-green-500 text-center text-purple-600 font-bold"
                      >
                        View Reservations
                      </Link>
                    </div>
                    <div className="flex flex-wrap gap-5 ps-5 pb-6 pt-6 border border-t-purple-500">
                      {restaurant.reservations.length === 0 ? (
                        <p className="bg-white rounded-md p-2 text-purple-900 font-bold">
                          Reservations Found: {restaurant.reservations.length}
                        </p>
                      ) : (
                        <>
                          <p className="bg-white rounded-md p-2 text-purple-900 font-bold">
                            Pending Reservations:{" "}
                            {
                              restaurant.reservations.filter(
                                (reservations) =>
                                  reservations.status === "pending"
                              ).length
                            }
                          </p>
                          <p className="bg-white rounded-md p-2 text-purple-900 font-bold">
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
          </section>
        </section>
      </div>
    </section>
  );
};

export default UserReservations;

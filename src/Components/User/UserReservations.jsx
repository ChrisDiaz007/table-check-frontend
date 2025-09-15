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
          <div>
            {restaurants.length === 0 ? (
              <p>No Restaurants Avaliable</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {restaurants.map((restaurant) => (
                  <div className="swiper-slider" key={restaurant.id}>
                    <Link to={`/restaurants/${restaurant.id}/reservations`}>
                      <div className="ImageWrapper">
                        {restaurant.photo_url ? (
                          <img
                            className="ImageWrapped"
                            src={restaurant.photo_url}
                            alt={`${restaurant.name} photo`}
                            style={{
                              width: "100%",
                              height: "175px",
                              objectFit: "cover",
                              borderRadius: "8px",
                            }}
                          />
                        ) : (
                          <div>No Image</div>
                        )}
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
                          </>
                        )}
                      </div>
                    </Link>
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

export default UserReservations;

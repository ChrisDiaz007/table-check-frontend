import "./UserProfile.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import UserSideBar from "./UserSideBar";

const UserRestaurant = () => {
  const [restaurants, setRestaurants] = useState([]);
  const { id } = useParams();

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
      })
      .catch((error) => {
        console.error("Error fetching restaurants", error);
      });
  }, [id]);

  return (
    <section className="User-Restaurants">
      <div className="Wrapper flex flex-wrap">
        <section className="Sidebar">
          <div>
            <UserSideBar />
          </div>
        </section>
        <section className="User-Display-Resturants flex-1 flex flex-col gap-5">
          <div className="flex flex-wrap justify-between items-end gap-4">
            <div>
              <h1 className="font-bold text-3xl">Restaurants</h1>
            </div>
            <div>
              <Link
                to={"/Restaurants/new"}
                className="p-3 rounded-md bg-purple-300"
              >
                New Restaurant
              </Link>
            </div>
          </div>
          <div>
            <div className="swiper-wrapper">
              {restaurants.length === 0 ? (
                <p>No Restaurants Created</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {restaurants.map((restaurant) => (
                    <div className="swiper-slider" key={restaurant.id}>
                      <Link to={`/restaurants/${restaurant.id}`}>
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
                          <div className="Name_h3">
                            <h3>{restaurant.name}</h3>
                          </div>
                          <div className="Cuisine_p">
                            <span className="Cuisine_box">
                              {restaurant.cuisines &&
                              restaurant.cuisines.length > 0 ? (
                                restaurant.cuisines
                              ) : (
                                <span>none</span>
                              )}
                            </span>
                          </div>
                          <div className="About_p">
                            <p>{restaurant.about}</p>
                          </div>
                          <div className="PriceInfo">
                            <div>
                              <span className="Price_a">
                                ¥{restaurant.lunch_price.toLocaleString()}
                              </span>
                              <span> Lunch</span>
                            </div>
                            <div>
                              <span className="Price_a">
                                ¥{restaurant.dinner_price.toLocaleString()}
                              </span>
                              <span> Dinner</span>
                            </div>
                          </div>
                          <div>
                            <p>
                              Number of Tables Created:{" "}
                              {restaurant.tables?.length || 0}
                            </p>
                          </div>
                        </div>
                      </Link>
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

export default UserRestaurant;

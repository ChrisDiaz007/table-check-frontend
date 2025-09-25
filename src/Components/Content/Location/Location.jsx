import "./Location.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const Location = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/restaurants", {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        const flatRestaurants = response.data.data.map((item) => ({
          // ...item.attributes,
          id: Number(item.attributes.id),
          name: item.attributes.name,
          photo: item.attributes.photo,
          about: item.attributes.about,
          lunch_price: item.attributes.lunch_price,
          dinner_price: item.attributes.dinner_price,
          prefecture: item.attributes.prefecture,
          cuisines: item.attributes.cuisines,
        }));

        // Filter only Tokyo prefecture
        const tokyoRestaurants = flatRestaurants.filter(
          (restaurant) => restaurant.prefecture === "Tokyo"
        );

        setRestaurants(tokyoRestaurants);
        console.log("Restaurants Fetch Successfully", tokyoRestaurants);
      })
      .catch((error) => console.error("Error fetching restaurants", error));
  }, []);

  return (
    <section className="Restaurant-Locations py-10">
      <div className="Header_h1 pb-3">Available in Tokyo</div>
      <Swiper
        modules={[Navigation]}
        navigation
        slidesPerView={4}
        spaceBetween={16}
        breakpoints={{
          0: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
        }}
        className=""
      >
        {restaurants.map((restaurant) => (
          <SwiperSlide className="swiper-slide" key={restaurant.id}>
            <Link to={`/restaurants/${restaurant.id}`}>
              <div className="ImageWrapper">
                {restaurant.photo ? (
                  <img
                    className="ImageWrapped"
                    src={restaurant.photo}
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
                  <span className="flex flex-wrap gap-2">
                    {restaurant.cuisines && restaurant.cuisines.length > 0 ? (
                      restaurant.cuisines.map((cuisine) => (
                        <div key={cuisine.id}>
                          <span className="Cuisine_box">{cuisine}</span>
                        </div>
                      ))
                    ) : (
                      <span className="Cuisine_box">none</span>
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
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Location;

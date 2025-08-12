import './Location.css'
import { useEffect, useState } from "react"
import axios from 'axios';
import { Link } from "react-router-dom"

const Location = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/v1/restaurants', {
      headers: { "Content-Type": "application/json" },
    })
    .then (response => {
      const flatRestaurants = response.data.data.map((item) => ({
        id: Number(item.id),
        ...item.attributes,
      }));

        // Filter only Tokyo prefecture
        const tokyoRestaurants = flatRestaurants.filter(
          (restaurant) => restaurant.prefecture === "Tokyo"
        );

      setRestaurants(tokyoRestaurants)
    })
    .catch(error => console.error('Error fetching restaurants', error));
  }, [])

    return (
<div className="swiper">
      <div className="Header_h1">Available in Tokyo</div>
      <div className="swiper-wrapper">
        {restaurants.map((restaurant) => (
          <div className="swiper-slide" key={restaurant.id}>
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
                    {restaurant.cuisines && restaurant.cuisines.length > 0 ? (
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
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Location

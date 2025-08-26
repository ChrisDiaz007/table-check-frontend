import "./Restaurant.css";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import MapView from "./MapView";

const Restaurant = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/v1/restaurants/${id}`, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        const item = response.data.data;
        const flatRestaurant = {
          id: Number(item.id),
          ...item.attributes,
        };

        setRestaurant(flatRestaurant);
      })
      .catch((error) => {
        console.error("Error fetching restaurant", error);
      });
  }, [id]);

  if (!restaurant) return <div>Loading...</div>;

  return (
    <div className="Content_res">
      <div className="MosaicWrapper">
        <div className="Wrapper_w1">
          <div className="Mosaic_mp">
            <img
              className="ImageWrapped"
              src={restaurant.photo_url}
              alt={`${restaurant.name} photo`}
              style={{
                width: "100%",
                height: "382px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          </div>
        </div>
      </div>
      <div className="VenueContent_v1">
        <div className="AboutWrapper">
          <section className="OverviewSelection">
            <div className="VenueDetails">
              <span className="FontRestaurant">{restaurant.name}</span>
              <div className="Details_d1">
                <span>{restaurant.cuisines}</span>
              </div>
              <div className="Details_d2">
                <span>{restaurant.address}</span>
                <a
                  className="map-link"
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    restaurant.address
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Map📍
                </a>
              </div>
              <div className="Details-d3">
                <div className="Price_Info">
                  <span className="Price_a">
                    ¥{restaurant.lunch_price.toLocaleString()}
                  </span>
                  <span>Lunch</span>
                </div>
                <div className="Price_Info">
                  <span className="Price_a">
                    ¥{restaurant.dinner_price.toLocaleString()}
                  </span>
                  <span>Dinner</span>
                </div>
              </div>
            </div>
            <div className="Wrapper_wq">
              <div className="Box_w1">Follow</div>
              <div className="Box_w1">Save</div>
              <div className="Box_w1">Share</div>
              <div className="Box_w1">Directions</div>
              <div className="Box_w1">
                <FontAwesomeIcon icon={faPhone} />
                {restaurant.phone_number}
              </div>
            </div>
          </section>
          <section className="Details-Wrapper">
            <h3 className="Details-About">{restaurant.about}</h3>
            <p className="Details-Description">{restaurant.description}</p>
          </section>

          <div style={{ width: "100%" }}>
            {restaurant.latitude && restaurant.longitude ? (
              <MapView
                markers={[
                  {
                    latitude: Number(restaurant.latitude),
                    longitude: Number(restaurant.longitude),
                    photo_url: restaurant.photo_url,
                  },
                ]}
                height={342}
              />
            ) : (
              <p>No map location available.</p>
            )}
          </div>
        </div>
        <div className="SideBarWrapper">SideBr</div>
      </div>
    </div>
  );
};

export default Restaurant;

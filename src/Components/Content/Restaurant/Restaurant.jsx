import "./Restaurant.css";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faLocationDot,
  faUtensils,
  faThumbTack,
} from "@fortawesome/free-solid-svg-icons";
import MapView from "./MapView";
import TokenStore from "../../../Auth/TokenStore";
import { useAuth } from "../../../Auth/UseAuth";
import BookingWidget from "./BookingWidget";

const Restaurant = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const { user: User } = useAuth();
  const navigate = useNavigate();

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
        console.log(flatRestaurant);
      })
      .catch((error) => {
        console.error("Error fetching restaurant", error);
      });
  }, [id]);

  if (!restaurant) return <div>Loading...</div>;

  const handleDelete = async (id) => {
    const token = TokenStore.getAccessToken();

    axios.delete(`http://localhost:3000/api/v1/restaurants/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    alert("Restaurant Delete!");
    navigate(`/users/${User.id}/restaurants`);
    window.location.reload();
  };

  console.log(User);

  return (
    <div className="Content_res pb-5">
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

          <section className="Restaurant-MapBox flex flex-col gap-5">
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
            <div className="flex gap-2">
              <div>
                <FontAwesomeIcon icon={faLocationDot} />
              </div>
              <div>
                <div>
                  <p className="font-bold">Address</p>
                </div>
                <div>
                  <p className="font-light">{restaurant.address}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <div>
                <FontAwesomeIcon icon={faUtensils} />
              </div>
              <div>
                <div>
                  <p className="font-bold">Cuisine</p>
                </div>
                <div>
                  <p className="font-light">{restaurant.cuisines}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <div>
                <FontAwesomeIcon icon={faThumbTack} />
              </div>
              <div>
                <div>
                  <p className="font-bold">Website</p>
                </div>
                <div>
                  <p className="font-light text-purple-500 underline">
                    <a href={restaurant.website}>{restaurant.website}</a>
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <div>
                <FontAwesomeIcon icon={faPhone} />
              </div>
              <div>
                <div>
                  <p className="font-bold">Phone</p>
                </div>
                <div>
                  <p className="font-light">{restaurant.phone_number}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div className="SideBarWrapper">
          <BookingWidget />
        </div>
      </div>
      <div className="flex gap-5 flex-col">
        <div>
          {User && (User.admin || User.id === restaurant.user_id) && (
            <Link
              to={`/restaurants/${id}/edit`}
              className="bg-green-400 p-3 rounded"
            >
              Edit Restaurant
            </Link>
          )}
        </div>
        <div>
          {User && (User.admin || User.id === restaurant.user_id) && (
            <button
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to delete this restaurant?"
                  )
                ) {
                  handleDelete(restaurant.id);
                }
              }}
              className="p-2 bg-red-400 text-white rounded cursor-pointer"
            >
              Delete Restaurant
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Restaurant;

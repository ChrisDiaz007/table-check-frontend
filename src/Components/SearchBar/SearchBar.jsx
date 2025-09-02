import "./Searchbar.css";
import bannerImg from "../../assets/Searchbar-img.png";
import axios from "axios";
import { useState, useEffect } from "react";

const Searchbar = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/restaurants", {
        "Content-Type": "application/json",
      })
      .then((res) => {
        const restaurants = res.data.data.map((item) => ({
          id: item.id,
          ...item.attributes,
        }));
        setRestaurants(restaurants);
        console.log("Restaurants Successfully Fetched");
      })
      .catch((err) => console.error("Error fethcing Restaurants", err));
  }, []);

  console.log(restaurants);

  return (
    <div
      className="Hero-Banner"
      style={{ backgroundImage: `url(${bannerImg})` }}
    >
      <div className="Overlay">
        <h1 className="">
          Find & book your <br />
          perfect table.
        </h1>
        <div className="">Search Engine</div>
      </div>
    </div>
  );
};

export default Searchbar;

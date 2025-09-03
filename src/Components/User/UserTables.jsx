import axios from "axios";
import UserSideBar from "./UserSideBar";
import { useEffect, useState } from "react";
import TokenStore from "../../Auth/TokenStore";
import { useParams } from "react-router-dom";

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
          id: Number(item.id),
          ...item.attributes,
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
        <section>
          <div>
            {restaurants.map((restaurant) => (
              <div key={restaurant.id}>
                {restaurant.tables.map((table) => (
                  <div key={table.id}>
                    <p>
                      Table Number: {table.number}, seats: {table.seats}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
};

export default UserTables;

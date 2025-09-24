import axios from "axios";
import UserSideBar from "./UserSideBar";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import TokenStore from "@/Auth/TokenStore";

const UserCuisines = () => {
  const { id } = useParams();
  const [restaurants, setRestaurants] = useState([]);
  const token = TokenStore.getAccessToken();

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/v1/users/${id}/restaurants`, {
        headers: {
          "Content-Type": "applications/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const flatRestaurants = res.data.data.map((item) => ({
          // ...item.attributes,
          id: Number(item.id),
          name: item.attributes.name,
          photo: item.attributes.photo_url,
          cuisines: item.attributes.cuisines,
        }));
        setRestaurants(flatRestaurants);
        console.log("Restaurants Fetches Successfully", flatRestaurants);
      })

      .catch((err) => {
        console.error("Error Fetching Restaurant", err);
      });
  }, [id]);

  return (
    <section>
      <div className="Wrapper flex flex-wrap">
        <section className="Sidebar">
          <div>
            <UserSideBar />
          </div>
        </section>
        <section className="flex-1 flex flex-col gap-5">
          <div>
            <p className="font-semibold text-3xl">Cuisines</p>
          </div>
          <div>
            <section>
              {restaurants.length === 0 ? (
                <p>Restaurants Avaliable {restaurants.length}</p>
              ) : (
                <section className="flex-wrap flex gap-5">
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
                      <div className="ps-5 pb-5 pt-3">
                        <Link
                          to={`/restaurants/${restaurant.id}/cuisines/edit`}
                          className="bg-green-400 p-3 rounded-md cursor-pointer hover:bg-green-500 text-center text-purple-600 font-bold"
                        >
                          Configure Cuisines
                        </Link>
                      </div>
                      <div className="flex flex-wrap gap-5 ps-5 pb-6">
                        {restaurant.cuisines.map((cuisine) => (
                          <div
                            key={cuisine}
                            className="bg-white rounded-md p-2 text-purple-900 font-bold"
                          >
                            {cuisine}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </section>
              )}
            </section>
          </div>
        </section>
      </div>
    </section>
  );
};

export default UserCuisines;

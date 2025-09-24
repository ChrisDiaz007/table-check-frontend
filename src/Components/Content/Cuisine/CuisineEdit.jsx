import TokenStore from "@/Auth/TokenStore";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CuisineEdit = () => {
  const { id } = useParams();
  const token = TokenStore.getAccessToken();

  const [cuisines, setCuisines] = useState([]);
  const [restaurantCuisines, setRestaurantCuisines] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/v1/cuisines`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        const flatCuisines = res.data.data.map((item) => ({
          id: Number(item.id),
          ...item.attributes,
        }));
        setCuisines(flatCuisines);
        console.log("Successfully Fetches Cuisines Categories", flatCuisines);
      })
      .catch((err) => {
        console.error("Error Fetching Cuisines", err);
      });

    axios
      .get(`http://localhost:3000/api/v1/restaurants/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        const item = res.data.data;
        const flatRestaurant = item.attributes.cuisines;
        setRestaurantCuisines(flatRestaurant);
        console.log("Successfully Fetched Restaurant Cuisines", flatRestaurant);
      })
      .catch((err) => {
        console.error("Error Fetching Restaurant", err);
      });
  }, []);

  const handleToggleCuisine = (cuisineName) => {
    setRestaurantCuisines((prev) =>
      prev.includes(cuisineName)
        ? prev.filter((name) => name !== cuisineName)
        : [...prev, cuisineName]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios
        .patch(
          `http://localhost:3000/api/v1/cuisines_restaurants/${id}`,
          { cuisines: restaurantCuisines },
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        )
        .then((res) => {
          console.log("Cuisines Updated Successfully", res);
          const msg = "Cuisines Updated";
          alert(msg);
          window.location.reload();
        });
    } catch (err) {
      console.error("Error updating cuisines", err);
    }
  };

  return (
    <section className="Cuisine-Edit">
      <form onSubmit={handleSubmit}>
        <h2>Edit Cuisines</h2>
        {cuisines.map((c) => (
          <label key={c.id} style={{ display: "block", marginBottom: "8px" }}>
            <input
              type="checkbox"
              value={c.name}
              checked={restaurantCuisines.includes(c.name)}
              onChange={() => handleToggleCuisine(c.name)}
            />
            {c.name}
          </label>
        ))}
        <button type="submit">Save Changes</button>
      </form>
    </section>
  );
};

export default CuisineEdit;

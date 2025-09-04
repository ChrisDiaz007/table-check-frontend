import axios from "axios";
import UserSideBar from "./UserSideBar";
import { useEffect, useState } from "react";
import TokenStore from "../../Auth/TokenStore";
import { Link, useParams } from "react-router-dom";

const UserBookings = () => {
  const { id } = useParams();
  const [user, setUser] = useState({ reservations: [] });

  // Load User
  useEffect(() => {
    const token = TokenStore.getAccessToken();
    axios
      .get(`http://localhost:3000/api/v1/users/${id}`, {
        "Content-Type": "application/json",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then((res) => {
        const item = res.data.data;
        setUser({ id: item.id, ...item.attributes });
      })
      .catch((err) => {
        console.error("Error fetching user", err);
      });
  }, [id]);
  if (!user) return <div>Loading...</div>;
  console.log(user);

  return (
    <section className="User-Bookings">
      <div className="Wrapper flex flex-wrap">
        <section className="Sidebar">
          <div>
            <UserSideBar />
          </div>
        </section>
        <section className="flex-1 flex flex-col gap-5">
          <div>
            <p className="font-semibold text-3xl">Bookings</p>
          </div>
          <div className="flex flex-wrap gap-5">
            {user.reservations.map((reservation) => (
              <div key={reservation.id} className="w-80">
                {reservation.restaurant_photo ? (
                  <Link to={`/restaurants/${reservation.restaurant_id}`}>
                    <img
                      className="ImageWrapped"
                      src={reservation.restaurant_photo}
                      alt={`${reservation.restaurant_name} photo`}
                      style={{
                        width: "100%",
                        height: "175px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  </Link>
                ) : (
                  <div>No Image</div>
                )}
                <p>Restaurant: {reservation.restaurant_name}</p>
                <p>Date: {reservation.reservation_date}</p>
                <p>Time: {reservation.reservation_time}</p>
                <div className="flex gap-2">
                  <p>Status:</p>
                  <p
                    className={
                      reservation.status === "pending"
                        ? "text-yellow-500 font-semibold"
                        : reservation.status === "accepted"
                        ? "text-green-600 font-semibold"
                        : reservation.status === "rejected"
                        ? "text-red-600 font-semibold"
                        : reservation.status === "cancelled"
                        ? "text-gray-500 font-semibold"
                        : ""
                    }
                  >
                    {reservation.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
};

export default UserBookings;

import axios from "axios";
import UserSideBar from "./UserSideBar";
import { useEffect, useState } from "react";
import TokenStore from "../../Auth/TokenStore";
import { Link, useParams } from "react-router-dom";

const UserBookings = () => {
  const { id } = useParams();
  const [user, setUser] = useState();
  console.log(user);

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
          <div>
            {user.bookings.length === 0 ? (
              "No Bookings"
            ) : (
              <div className="flex flex-wrap gap-5">
                {user.bookings.map((booking) => (
                  <div key={booking.id} className="w-80">
                    {booking.restaurant_photo ? (
                      <Link to={`/restaurants/${booking.restaurant_id}`}>
                        <img
                          className="ImageWrapped"
                          src={booking.restaurant_photo}
                          alt={`${booking.restaurant_name} photo`}
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
                    <p>Restaurant: {booking.restaurant_name}</p>
                    <p>Date: {booking.reservation_date}</p>
                    <p>Time: {booking.reservation_time}</p>
                    <div className="flex gap-2">
                      <p>Status:</p>
                      <p
                        className={
                          booking.status === "pending"
                            ? "text-yellow-500 font-semibold"
                            : booking.status === "accepted"
                            ? "text-green-600 font-semibold"
                            : booking.status === "rejected"
                            ? "text-red-600 font-semibold"
                            : booking.status === "cancelled"
                            ? "text-gray-500 font-semibold"
                            : ""
                        }
                      >
                        {booking.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </section>
  );
};

export default UserBookings;

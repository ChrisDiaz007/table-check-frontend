import TokenStore from "@/Auth/TokenStore";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Reservations = () => {
  const { id } = useParams();
  const token = TokenStore.getAccessToken();
  const [reservations, setReservations] = useState([]);
  console.log(reservations);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/v1/restaurants/${id}/reservations`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const flatReservation = res.data.data.map((item) => ({
          id: Number(item.id),
          ...item.attributes,
        }));
        setReservations(flatReservation);
        console.log("Reservations Successfully Fetched");
      })
      .catch((err) => {
        console.error("Error Fetching Reservations", err);
      });
  }, [id]);

  // Patching over Array with buttons
  const updateReservationStatus = async (reservationId, newStatus) => {
    try {
      await axios.patch(
        `http://localhost:3000/api/v1/restaurants/${id}/reservations/${reservationId}`,
        { reservation: { status: newStatus } },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state to reflect the change
      setReservations((prevReservations) =>
        prevReservations.map((reservation) =>
          reservation.id === reservationId
            ? { ...reservation, status: newStatus }
            : reservation
        )
      );

      console.log(`Reservation ${newStatus} successfully`);
    } catch (err) {
      console.error(`Error ${newStatus} reservation`, err);
    }
  };

  const handleAccept = (reservationId, firstName, lastName) => {
    const confirmAccept = window.confirm(
      `Are you sure you want to accept the reservation for ${firstName} ${lastName}?`
    );
    if (confirmAccept) {
      updateReservationStatus(reservationId, "accepted");
    }
  };

  const handleReject = (reservationId, firstName, lastName) => {
    const confirmReject = window.confirm(
      `Are you sure you want to reject the reservation for ${firstName} ${lastName}?`
    );
    if (confirmReject) {
      updateReservationStatus(reservationId, "rejected");
    }
  };

  const handleCancel = (reservationId, firstName, lastName) => {
    const confirmCancel = window.confirm(
      `Are you sure you want to cancel the reservation for ${firstName} ${lastName}`
    );
    if (confirmCancel) {
      updateReservationStatus(reservationId, "cancelled");
    }
  };

  return (
    // prettier-ignore
    <section className="Reservations">
      <div className="flex gap-5">
        <div className="flex-1">
          <div className="flex flex-col gap-3 ">
            <p className="font-semibold text-2xl">Pending Reservations</p>
          {reservations
            .filter(reservation => reservation.status === "pending")
            .map((reservation) => (
              <div key={reservation.id} className="border p-4 mb-3 rounded">
                <p><strong>Name:</strong> {reservation.user.first_name} {reservation.user.last_name}</p>
                <p><strong>Email:</strong> {reservation.user.email}</p>
                <p><strong>Phone Number:</strong> {reservation.user.phone_number}</p>
                <p><strong>Date:</strong> {reservation.reservation_date}</p>
                <p><strong>Time:</strong> {reservation.reservation_time}</p>
                <div className="flex gap-2 mt-2">
                  <button
                    className="bg-green-400 px-3 py-1 rounded hover:bg-green-500 cursor-pointer"
                    onClick={() => handleAccept(
                      reservation.id, 
                      reservation.user.first_name, 
                      reservation.user.last_name
                    )}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-red-400 px-3 py-1 rounded hover:bg-red-500 cursor-pointer"
                    onClick={() => handleReject(
                      reservation.id, 
                      reservation.user.first_name, 
                      reservation.user.last_name
                    )}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <p className="font-semibold text-2xl">Accepted</p>
          {reservations
          .filter(reservation => reservation.status === "accepted")
          .map((reservation) => (
            <div key={reservation.id} className="border p-4 mb-3 rounded">
              <div>
                <p><strong>Name:</strong> {reservation.user.first_name} {reservation.user.last_name}</p>
                <p><strong>Name:</strong> {reservation.user.first_name} {reservation.user.last_name}</p>
                <p><strong>Email:</strong> {reservation.user.email}</p>
                <p><strong>Phone Number:</strong> {reservation.user.phone_number}</p>
                <p><strong>Date:</strong> {reservation.reservation_date}</p>
                <p><strong>Time:</strong> {reservation.reservation_time}</p>
                <div>
                  <button
                  className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500 cursor-pointer"
                  onClick={() => handleCancel(
                    reservation.id,
                    reservation.user.first_name,
                    reservation.user.last_name
                  )}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
};

export default Reservations;

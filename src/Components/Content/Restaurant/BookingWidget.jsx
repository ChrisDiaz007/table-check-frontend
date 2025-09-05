import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import TokenStore from "../../../Auth/TokenStore";
import axios from "axios";
import { Calendar } from "@/Components/ui/calendar";

const BookingWidget = () => {
  const { id } = useParams();
  const token = TokenStore.getAccessToken();
  const [reservation, setReservation] = useState({
    reservation_time: "",
    party_size: "",
  });
  const [date, setDate] = useState(new Date());
  console.log(reservation);
  const [hours, setHours] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/v1/restaurants/${id}/restaurant_hours`, {
        "Content-Type": "application/json",
      })
      .then((res) => {
        const hours = res.data.data.map((item) => ({
          id: Number(item.id),
          ...item.attributes,
        }));
        setHours(hours);
        console.log("Hours successfully fetched", hours);
      })
      .catch((err) => console.error("Error fetching hours", err));
  }, [id]);

  // Generate time slots based on restaurant hours for the selected date
  const timeSlots = useMemo(() => {
    if (!date || hours.length === 0) return [];

    const dayOfWeek = date.getDay(); // 0 (Sunday) to 6 (Saturday)
    const dayHours = hours.find((h) => h.day_of_week === dayOfWeek);

    if (!dayHours) return [];

    const openTime = new Date(`1970-01-01T${dayHours.opens_at}`);
    const closeTime = new Date(`1970-01-01T${dayHours.closes_at}`);

    const slots = [];
    let currentTime = new Date(openTime);

    // Generate 30-minute intervals
    while (currentTime < closeTime) {
      const hours = currentTime.getHours();
      const minutes = currentTime.getMinutes();
      const timeString = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
      const displayTime = `${hours % 12 || 12}:${minutes
        .toString()
        .padStart(2, "0")} ${hours >= 12 ? "PM" : "AM"}`;

      slots.push({
        value: timeString,
        display: displayTime,
      });

      currentTime.setMinutes(currentTime.getMinutes() + 30);
    }

    return slots;
  }, [date, hours]);

  // Check if a date should be disabled (when restaurant is closed)
  const isDateDisabled = (date) => {
    const dayOfWeek = date.getDay();
    return !hours.some((h) => h.day_of_week === dayOfWeek);
  };

  const handleInput = (event) => {
    const { name, value } = event.target;
    setReservation((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    axios
      .post(
        `http://localhost:3000/api/v1/restaurants/${id}/reservations`,
        { reservation },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log("Reservation Submitted Successfully", response);
        const msg = "Reservation successfully created";
        alert(msg, response);
      })
      .catch((error) => {
        console.error("Reservation failed", error);
        const msg = "That time is already booked. Please choose another slot.";
        alert(msg, error);
      });
  };

  return (
    <section className="Booking-Widget">
      <div className="flex justify-center pt-20">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="rounded-xl border shadow-sm p-3 w-[316px] flex flex-col gap-3">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => {
                setDate(newDate);
                if (!newDate) return;
                const day = newDate.toISOString().split("T")[0];
                const existingTime =
                  reservation.reservation_time.split(" ")[1] || "";
                setReservation((prev) => ({
                  ...prev,
                  reservation_time: existingTime
                    ? `${day} ${existingTime}`
                    : day,
                }));
              }}
              disabled={(date) => date < new Date() || isDateDisabled(date)}
              className="rounded-lg w-[290px] h-[275px]"
            />
            <div className="flex">
              <div className="pt-9 ps-2">
                <select
                  name="party_size"
                  onChange={handleInput}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-33 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={reservation.party_size}
                >
                  <option value="">Select Guests</option>
                  <option value={1}>1 guest</option>
                  <option value={2}>2 guests</option>
                  <option value={3}>3 guests</option>
                  <option value={4}>4 guests</option>
                  <option value={5}>5 guests</option>
                  <option value={6}>6 guests</option>
                </select>
              </div>
              <div className="pt-9 ps-2">
                <select
                  name="reservation_time"
                  onChange={(e) => {
                    const time = e.target.value;
                    const day = date?.toISOString().split("T")[0] || "";
                    setReservation((prev) => ({
                      ...prev,
                      reservation_time: day ? `${day} ${time}` : time,
                    }));
                  }}
                  className="border p-2.5 rounded-md"
                  disabled={timeSlots.length === 0}
                >
                  <option value="">Select a time</option>
                  {timeSlots.map((slot) => (
                    <option key={slot.value} value={slot.value}>
                      {slot.display}
                    </option>
                  ))}
                </select>
                {timeSlots.length === 0 && date && (
                  <p className="text-red-500 text-sm mt-1">
                    Restaurant is closed on this day
                  </p>
                )}
              </div>
            </div>
            <div className="p-2 border rounded-md text-center hover:bg-gray-300">
              <Link to={`/restaurants/${id}/reservations`} className="">
                Find More Avaliable
              </Link>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default BookingWidget;

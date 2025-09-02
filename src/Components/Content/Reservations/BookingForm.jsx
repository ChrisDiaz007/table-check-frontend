import { useMemo, useState } from "react";
import { useNavigation, useParams } from "react-router-dom";
import TokenStore from "../../../Auth/TokenStore";
import axios from "axios";

const BookingForm = () => {
  const { id } = useParams();
  // const navigate = useNavigation();
  const token = TokenStore.getAccessToken();
  const [reservation, setReservation] = useState({
    reservation_time: "",
    party_size: "",
  });

  // const times = useMemo(() => {
  //   const out = [];
  //   for (let h = 17; h <= 22; h++) {
  //     const hh = String(h).padStart(2, "0");
  //     out.push(`${hh}:00`, `${hh}:30`);
  //   }
  //   return out;
  // }, []);

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
      .then((response) =>
        console.log("Reservation Submitted Successfully", response)
      )
      .catch((error) => console.log("Error submitting form", error));
  };

  return (
    // prettier-ignore
    <section className="Booking-Form">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        Reservation Time: <input type="text" onChange={handleInput} name="reservation_time" className="border"/>
        Party Size: <input type="text" onChange={handleInput} name="party_size" className="border" />
        <button type="submit" className="bg-black text-white p-2">Submit</button>
      </form>
    </section>
  );
};

export default BookingForm;

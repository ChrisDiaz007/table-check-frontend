import { useParams } from "react-router-dom";
import UserSideBar from "./UserSideBar";
import axios from "axios";
import { useEffect, useState } from "react";

const UserReservations = () => {
  const { id } = useParams();
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    axios.get(``);
  });

  return (
    <section className="User-Reservations">
      <div className="Wrapper flex flex-wrap">
        <section className="Sidebar">
          <div>
            <UserSideBar />
          </div>
        </section>
        <section>
          <p>test</p>
        </section>
      </div>
    </section>
  );
};

export default UserReservations;

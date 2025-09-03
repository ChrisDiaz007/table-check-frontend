import axios from "axios";
import TokenStore from "../../../Auth/TokenStore";
import { useParams } from "react-router-dom";
import { useState } from "react";

const TableNew = () => {
  const { id } = useParams();
  const token = TokenStore.getAccessToken();
  const [table, setTable] = useState({
    number: "",
    seats: "",
  });

  const handleInput = (event) => {
    const { name, value } = event.target;
    setTable((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    axios
      .post(
        `http://localhost:3000/api/v1/restaurants/${id}/tables`,
        { table },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        const msg = "Table Created";
        alert(msg);
        console.log(msg, response);
      })
      .catch((error) => {
        const msg = "Table number already exists";
        alert(msg);
        console.error(msg, error);
      });
  };

  return (
    // prettier-ignore
    <section className="Table-New">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <p>Add new Table</p>
        Talbe Number <input type="text" onChange={handleInput} name="number" className="border"/>
        Seats: <input type="text" onChange={handleInput} name="seats" className="border" />
        
        <button className="bg-black text-white p-2">Create Table</button>
      </form>
    </section>
  );
};

export default TableNew;

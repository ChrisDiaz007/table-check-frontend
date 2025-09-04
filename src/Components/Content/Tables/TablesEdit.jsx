import TokenStore from "@/Auth/TokenStore";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const TablesEdit = () => {
  const { id } = useParams();
  const token = TokenStore.getAccessToken();
  const [tables, setTables] = useState([]);
  console.log(tables);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/v1/restaurants/${id}/tables`, {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        const tables = res.data.data.map((item) => ({
          id: item.id,
          ...item.attributes,
        }));
        setTables(tables);
        console.log("Tables succesfully fetched");
      })
      .catch((err) => console.error("Error fetching tables", err));
  }, [id]);

  const handleInput = (event, tableIndex) => {
    const { name, value } = event.target;
    setTables((previousTables) =>
      previousTables.map((table, currentIndex) =>
        currentIndex === tableIndex ? { ...table, [name]: value } : table
      )
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    Promise.all(
      tables.map((table) =>
        axios.patch(
          `http://localhost:3000/api/v1/restaurants/${id}/tables/${table.id}`,
          { table },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )
      )
    )
      .then((response) => {
        console.log("Updated Tables", response);
        window.location.reload();
        const msg = "Tables Updated";
        alert(msg, response);
      })
      .catch((error) => console.log("Error Updating Restaurant", error));
  };

  return (
    // prettier-ignore
    <section className="TablesEdit">
      <div className="pt-10">
        <Link to={`/users/${tables[0]?.user_id}/tables`} className="rounded-md bg-purple-400 p-3 hover:bg-purple-500">
        Go Back
        </Link>
      </div>
      <div className="flex justify-center py-15">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 border rounded-md p-12">
          <div className="text-center">
            <p className="font-semibold text-3xl pb-5">Edit Tables</p>
          </div>
          {tables.map((table, index) => (
            <div key={table.id} className="flex gap-5">
              <div >
                Table Number: <input type="text" name="number" value={table.number} onChange={(event) => handleInput(event, index)} className="border rounded-md w-15 p-2" />
              </div>
              <div>
                Seats: <input type="text" name="seats" value={table.seats} onChange={(event) => handleInput(event, index)} className="border rounded-md w-15 p-2" />
              </div>
            </div>
          ))}
          <div className="flex justify-center flex-col">
            <button type="submit" className="bg-green-400 p-2 rounded-md hover:cursor-pointer hover:bg-green-500">Save Tables</button>
          </div>
        </form>
      </div>
</section>
  );
};

export default TablesEdit;

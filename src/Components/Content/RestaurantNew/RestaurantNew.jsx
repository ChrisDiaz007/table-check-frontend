import axios from "axios";
import { useState } from "react";
// import TokenStore from "../../../Auth/TokenStore"

const RestaurantNew = () => {
  const [post, setPost] = useState({
    name: "",
    address: "",
    prefecture: "",
    district: "",
    description: "",
    phone_number: "",
    website: "",
    total_tables: "",
    about: "",
    photo: null,
    cuisine_ids: [],
  });

  const handleInput = (event) => {
    setPost({ ...post, [event.target.name]: event.target.event });
  };

  function handleSubmit(event) {
    event
      .preventDefault()
      // axios.post('http://localhost:3000/api/v1/restaurants', {post}. {
      //   withCredentials: true,
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': 'Bearer token',
      //   }
      // })
      .then((response) => console.log("Form Submitted Successfully", response))
      .catch((error) => console.log("Error submitting form", error));
  }

  return (
    <div className="">
      <div>
        <form onSubmit={handleSubmit}>
          Name : <input type="text" onChange={handleInput} name="name"></input>
          Address: <input type="text" onChange={handleInput} name="address" />
          Prefecture:{" "}
          <input type="text" onChange={handleInput} name="prefecture" />
        </form>
      </div>
    </div>
  );
};

export default RestaurantNew;

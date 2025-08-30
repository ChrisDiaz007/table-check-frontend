import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const handleChange = (e) => {
    const value = e.target.value;
    setData({
      ...data,
      [e.target.name]: value,
    });
  };

  // prettier-ignore
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(
        "http://localhost:3000/signup",
        { user: data },
        { headers: { "Content-Type": "application/json", Accept: "application/json" }, }
      )
      .then((response) => response, navigate("/login"))
      .catch((error) => console.log("Error submitting form", error));
  };

  // prettier-ignore
  return (
    <div>
      <div>Sign-up</div>
      <div>
        <form onSubmit={handleSubmit} className="flex flex-col">
          First Name : <input type="text" onChange={handleChange} name="first_name" />
          Last Name: <input type="text" onChange={handleChange} name='last_name' />
          Email: <input type="text" onChange={handleChange} name="email" />
          Password: <input type="text" onChange={handleChange} name="password" />
          Confirm Password: <input type="text" onChange={handleChange} name="password_confirmation" />
          <button type="submit" >Sign UP</button>
        </form>
      </div>
    </div>
  )
};

export default Signup;

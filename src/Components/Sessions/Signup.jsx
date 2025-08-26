import axios from "axios"
import { useState } from "react"

const Signup = () => {
  const [data, setData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    email: '',
    password: '',
    password_confirmation: '',
  })

  const handleChange = (e) => {
    const value = e.target.value;
    setData({
      ...data,
      [e.target.name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3000/signup', {user: data},
      {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      }
    })
        .then(response => console.log('Form Submitted Successfully' ,response))
        .catch(error => console.log('Error submitting form', error))
  }

  return (
    <div>
      <div>Sign-up</div>
      <div>
        <form onSubmit={handleSubmit}>
          First Name : <input type="text" onChange={handleChange} name="first_name" />
          Last Name: <input type="text" onChange={handleChange} name='last_name' />
          Phone Number: <input type="text" onChange={handleChange} name="phone_number" />
          Email: <input type="text" onChange={handleChange} name="email" />
          Password: <input type="text" onChange={handleChange} name="password" />
          Confirm Password: <input type="text" onChange={handleChange} name="password_confirmation" />
          <button type="submit">Sign UP</button>
        </form>
      </div>

    </div>
  )
}

export default Signup

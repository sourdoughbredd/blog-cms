import { useState, useContext } from "react";
import { signup } from "../api";
import { AuthContext } from "../context/authContext";

const Signup = () => {
  const { authenticated, setAuthenticated } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  console.log("Signup page authenticated status: " + authenticated);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await signup(
        formData.email,
        formData.username,
        formData.password
      );
      if (response.error) {
        alert("Error signing up. Check console for details.");
        console.log("Error signing up with response...");
        console.error(response);
      } else {
        alert("Successful signup! Press ok to go to login.");
        window.location.href = "/users/login";
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (authenticated) {
    return (
      <>
        <h1>Sign Up</h1>
        <h3>You are already logged in.</h3>
      </>
    );
  }

  return (
    <>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </>
  );
};

export default Signup;

import { useState } from "react";
import { register } from "../services/authService.jsx";
import "../styles/RegisterPage.css";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "adopter",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      setMessage("Registration successful! You can now log in.");
    } catch (error) {
      setMessage("Error registering. Please try again.");
    }
  };

  return (
    <div className="register-page">
      <form onSubmit={handleSubmit} className="register-form">
        <h1>Register</h1>
        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <select name="role" onChange={handleChange} required>
            <option value="adopter">Adopter</option>
            <option value="shelter">Shelter</option>
          </select>
        </div>
        <button type="submit" className="submit-btn">
          Register
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default RegisterPage;

import React, { useState, useEffect } from "react";
import axios from "axios";

function Airlines() {
  const [airlines, setAirlines] = useState([]);
  const [formData, setFormData] = useState({ company_name: "" });

  useEffect(() => {
    fetchAirlines();
  }, []);

  const fetchAirlines = async () => {
    const response = await axios.get("http://localhost:5000/airlines");
    setAirlines(response.data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/airlines", formData);
    fetchAirlines();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/airlines/${id}`);
    fetchAirlines();
  };

  return (
    <div>
      <h3>Airlines</h3>
      <form onSubmit={handleSubmit}>
        <input type="text" name="company_name" placeholder="Company Name" onChange={handleChange} required />
        <button type="submit">Add Airline</button>
      </form>
      <ul>
        {airlines.map((airline) => (
          <li key={airline.id}>
            {airline.company_name}
            <button onClick={() => handleDelete(airline.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Airlines;

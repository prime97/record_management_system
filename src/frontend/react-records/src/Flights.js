import React, { useState, useEffect } from "react";
import axios from "axios";

function Flights() {
  const [flights, setFlights] = useState([]);
  const [formData, setFormData] = useState({
    client_id: "",
    airline_id: "",
    date: "",
    start_city: "",
    end_city: ""
  });

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    const response = await axios.get("http://localhost:5000/flights");
    setFlights(response.data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/flights", formData);
    fetchFlights();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/flights/${id}`);
    fetchFlights();
  };

  return (
    <div>
      <h3>Flights</h3>
      <form onSubmit={handleSubmit}>
        <input type="number" name="client_id" placeholder="Client ID" onChange={handleChange} required />
        <input type="number" name="airline_id" placeholder="Airline ID" onChange={handleChange} required />
        <input type="date" name="date" onChange={handleChange} required />
        <input type="text" name="start_city" placeholder="Start City" onChange={handleChange} required />
        <input type="text" name="end_city" placeholder="End City" onChange={handleChange} required />
        <button type="submit">Add Flight</button>
      </form>
      <ul>
        {flights.map((flight) => (
          <li key={flight.id}>
            Client {flight.client_id} → Airline {flight.airline_id}
            <button onClick={() => handleDelete(flight.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Flights;

import React, { useState, useEffect } from "react";
import axios from "axios";
import {Button,TextField} from "@mui/material";
import "./App.css"

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
    <div id='input-field'>
      <h3>Flights</h3>
      <form onSubmit={handleSubmit} style={{
                    width: '80%',
                    maxWidth: '400px', // Good for responsiveness
                    display: 'flex',        // Make the form a flex container
                    flexDirection: 'column', // Stack items vertically
                    alignItems: 'center',   // Center items horizontally
                    margin: '0 auto', 
                    gap:'7px'
                }}>
        <TextField  variant="standard" type="number" name="client_id" placeholder="Client ID" onChange={handleChange} required />
        <TextField  variant="standard" type="number" name="airline_id" placeholder="Airline ID" onChange={handleChange} required />
        <TextField  variant="standard" type="date" name="date" onChange={handleChange} required />
        <TextField  variant="standard" type="text" name="start_city" placeholder="Start City" onChange={handleChange} required />
        <TextField  variant="standard" type="text" name="end_city" placeholder="End City" onChange={handleChange} required />
        <Button variant="text" type="submit">Add Flight</Button>
      </form>
      <ul>
        {flights.map((flight) => (
          <li key={flight.id}>
            Client {flight.client_id} → Airline {flight.airline_id}
            <Button color="error" onClick={() => handleDelete(flight.id)}>Delete</Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Flights;

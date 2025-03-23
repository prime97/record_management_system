import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, TextField } from "@mui/material";
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
  const [successMessage, setSuccessMessage] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchFlights();
  }, []);

  useEffect(() => {
    console.log("editingId changed to:", editingId);
  }, [editingId]);

  const handleEdit = (flight) => {
    setEditingId(flight.id);
    setFormData({
      client_id: flight.client_id,
      airline_id: flight.airline_id, date: flight.date,
      start_city: flight.start_city, end_city: flight.end_city
    });
    console.log(flight.id, flight.client_id, flight.airline_id, flight.date, flight.start_city, flight.end_city)
  };


  const fetchFlights = async () => {
    const response = await axios.get("http://localhost:5000/flights");
    setFlights(response.data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { start_city, end_city, date } = formData;
      if (editingId) {
        await axios.put(`http://localhost:5000/flights/${editingId}`, formData);
        setSuccessMessage(`flights updated`);
        setEditingId(null); // Reset editing ID
      }
      else {
        await axios.post("http://localhost:5000/flights", formData);
        fetchFlights();
        setFormData({
          client_id: "",
          airline_id: "",
          date: "",
          start_city: "",
          end_city: "",
        });
        setSuccessMessage(`Flight from ${start_city} to ${end_city} on ${date} added`);
      }
      fetchFlights();
      setFormData({ client_id: "" , airline_id:"",date:"",start_city:"",end_city:""})
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);


    } catch (error) {
      console.error(editingId ? "Error updating airline:" : "Error adding airline:", error);
      setSuccessMessage(editingId ? "Error updating airline" : "Error adding airline");
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    }

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
        gap: '7px'
      }}>
        <TextField value={formData.client_id} variant="standard" type="number" name="client_id" placeholder="Client ID" onChange={handleChange} required />
        <TextField value={formData.airline_id} variant="standard" type="number" name="airline_id" placeholder="Airline ID" onChange={handleChange} required />
        <TextField value={formData.date} variant="standard" type="date" name="date" onChange={handleChange} required />
        <TextField value={formData.start_city} variant="standard" type="text" name="start_city" placeholder="Start City" onChange={handleChange} required />
        <TextField value={formData.end_city} variant="standard" type="text" name="end_city" placeholder="End City" onChange={handleChange} required />
      <Button variant="text" type="submit">
        {editingId ? "Update" : "Add Airline"}
      </Button>
      {editingId && (
        <Button onClick={() => { setEditingId(null); setFormData({ client_id: "" , airline_id:"",date:"",start_city:"",end_city:""}); }}>
          Cancel
        </Button>
      )}
            </form>

      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      <ul>
        {flights.map((flight) => (
          <li key={flight.id}>
            Client {flight.client_id} → Airline {flight.airline_id}
            <Button color="error" onClick={() => handleDelete(flight.id)}>Delete</Button>
            <Button color="success" onClick={() => handleEdit(flight)}>Edit</Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Flights;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, TextField,Select, MenuItem, FormControl, InputLabel, Paper, Box, Typography } from "@mui/material";
import "./App.css"

function Flights() {
  const [flights, setFlights] = useState([]);
  const [clients, setClients] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    client_id: "",
    airline_id: "",
    date: "",
    start_city: "",
    end_city: ""
  });
  const [selectedFlightId, setSelectedFlightId] = useState(null);

  useEffect(() => {
    fetchFlights();
    fetchClients();
    fetchAirlines();
  }, []);

  const fetchFlights = async () => {
    const response = await axios.get("http://localhost:5000/flights");
    setFlights(response.data);
  };

  const fetchClients = async () => {
    const response = await axios.get("http://localhost:5000/clients");
    setClients(response.data);
  };

  const fetchAirlines = async () => {
    const response = await axios.get("http://localhost:5000/airlines");
    setAirlines(response.data);
  };


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSelectFlight = (flight) => {
    setSelectedFlightId(flight.id);
    setFormData({
      client_id: flight.client_id,
      airline_id: flight.airline_id,
      date: flight.date,
      start_city: flight.start_city,
      end_city: flight.end_city
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedFlightId) {
      await axios.put(`http://localhost:5000/flights/${selectedFlightId}`, formData);
    } else {
      await axios.post("http://localhost:5000/flights", formData);
    }
    fetchFlights();
    resetForm();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/flights/${id}`);
    fetchFlights();
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      client_id: "",
      airline_id: "",
      date: "",
      start_city: "",
      end_city: ""
    });
    setSelectedFlightId(null);
  };

  const filteredFlights = flights.filter((flight) =>
    flight.client_id.toString().includes(searchQuery) ||
    flight.airline_id.toString().includes(searchQuery)
  );

  return (
    <div id='input-field'>
      <h3>Flights</h3>

      {/* Search */}
      <TextField
        type="text"
        placeholder="Search by Client ID or Airline ID"
        value={searchQuery}
        onChange={handleSearchChange}
      />

      {/* Search Results */}
      {searchQuery && (
        filteredFlights.length > 0 ? (
          <ul>
            {filteredFlights.map((flight) => (
              <li key={flight.id}>
                Client {flight.client_id} → Airline {flight.airline_id} on {flight.date}
                <Button onClick={() => handleSelectFlight(flight)}>Edit</Button>
                <Button onClick={() => handleDelete(flight.id)}>Delete</Button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Flight not found!</p>
        )
      )}

      {/* Add or Update Form */}
      <form onSubmit={handleSubmit}>
        <h4>{selectedFlightId ? "Update Flight" : "Add Flight"}</h4>

        {/* Client Dropdown */}
        <FormControl fullWidth style={{ marginBottom: 10 }}>
          <InputLabel id="client-label">Select Client</InputLabel>
            <Select
              labelId="client-label"
              name="client_id"
              value={formData.client_id}
              label="Select Client"
              onChange={handleChange}
              required>
              {clients.map((client) => (
              <MenuItem
                key={client.id}
                value={client.id}
                sx={{
                  backgroundColor: 'grey',
                  color: 'white',
                  '&:hover': {
                  backgroundColor: '#0692e0'
                  }
                }}>
                {client.name} ({client.id})
              </MenuItem>
              ))}
            </Select>
        </FormControl>

        {/* Airline Dropdown */}
        <FormControl fullWidth style={{ marginBottom: 10 }}>
          <InputLabel id="airline-label">Select Airline</InputLabel>
          <Select
            labelId="airline-label"
            name="airline_id"
            value={formData.airline_id}
            label="Select Airline"
            onChange={handleChange}
            required
          >
            {airlines.map((airline) => (
              <MenuItem
                  key={airline.id}
                  value={airline.id}
                  sx={{
                    backgroundColor: 'grey',
                    color: 'white',
                    '&:hover': {
                    backgroundColor: '#0692e0'
                  }
                  }}>

                {airline.company_name} ({airline.id})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField name="date" type="date" value={formData.date} onChange={handleChange} required />
        <TextField name="start_city" placeholder="Start City" value={formData.start_city} onChange={handleChange} required />
        <TextField name="end_city" placeholder="End City" value={formData.end_city} onChange={handleChange} required />
        <Button type="submit">{selectedFlightId ? "Update" : "Add"}</Button>
        {selectedFlightId && <Button type="button" onClick={resetForm}>Cancel</Button>}
      </form>

{/* Show all clients */}
<h4>Client List</h4>
<Paper elevation={2} sx={{ p: 2, mt: 4 }}>
  <Typography variant="h6">Client List</Typography>
  <ul>
    {clients.map((client) => (
      <li key={client.id}>{client.id} – {client.name}</li>
    ))}
  </ul>
</Paper>

{/* Show all airlines */}
<h4>Airline List</h4>
<Paper elevation={2} sx={{ p: 2, mt: 2 }}>
  <Typography variant="h6">Airline List</Typography>
  <ul>
    {airlines.map((airline) => (
      <li key={airline.id}>{airline.id} – {airline.company_name}</li>
    ))}
  </ul>
</Paper>
    </div>
  );
}

export default Flights;

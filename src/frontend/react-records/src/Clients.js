import React, { useState, useEffect } from "react";
import axios from "axios";
import {Button,TextField,Box} from "@mui/material";
import "./App.css";
// import './Client.css';

function Clients() {
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    address_line_1: "",
    address_line_2: "",
    address_line_3: "",
    city: "",
    state: "",
    zip_code: "",
    country: "",
    phone_number: ""
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    const response = await axios.get("http://localhost:5000/clients");
    setClients(response.data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/clients", formData);
    fetchClients();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/clients/${id}`);
    fetchClients();
  };

  return (

    <div id="input-field">
      <h3>Clients</h3>
     
      <form onSubmit={handleSubmit}   style={{
                    width: '80%',
                    maxWidth: '400px', // Good for responsiveness
                    display: 'flex',        // Make the form a flex container
                    flexDirection: 'column', // Stack items vertically
                    alignItems: 'center',   // Center items horizontally
                    margin: '0 auto', 
                    gap:'7px'
                }}>
        <TextField variant="standard" type="text" name="name" placeholder="Name"  onChange={handleChange} required />
        <TextField variant="standard" type="text" name="address_line_1" placeholder="Address Line 1" onChange={handleChange} required />
        <TextField variant="standard" type="text" name="address_line_2" placeholder="Address Line 2" onChange={handleChange} />
        <TextField variant="standard" type="text" name="address_line_3" placeholder="Address Line 3" onChange={handleChange} />
        <TextField variant="standard" type="text" name="city" placeholder="City" onChange={handleChange} required />
        <TextField variant="standard" type="text" name="state" placeholder="State" onChange={handleChange} required />
        <TextField variant="standard" type="text" name="zip_code" placeholder="Zip Code" onChange={handleChange} required />
        <TextField variant="standard" type="text" name="country" placeholder="Country" onChange={handleChange} required />
        <TextField variant="standard" type="text" name="phone_number" placeholder="Phone Number" onChange={handleChange} required />
        <Button variant="text" type="submit">Add Client</Button>
      </form>
      <ul>
        {clients.map((client) => (
          <li key={client.id}>
            {client.name} - {client.city}
            <Button color="error" variant="contained" onClick={() => handleDelete(client.id)}>Delete</Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Clients;

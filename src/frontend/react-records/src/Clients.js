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
  const [successMessage, setSuccessMessage] = useState("");

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

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   await axios.post("http://localhost:5000/clients", formData);
  //   fetchClients();
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { name } = formData;
      await axios.post("http://localhost:5000/clients", formData);
      fetchClients();
      setFormData({
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
      setSuccessMessage(`${name} added`);
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error adding client:", error);
      setSuccessMessage("Error adding client");
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    }
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
        <TextField value={formData.name} variant="standard" type="text" name="name" placeholder="Name"  onChange={handleChange} required />
        <TextField value={formData.address_line_1} variant="standard" type="text" name="address_line_1" placeholder="Address Line 1" onChange={handleChange} required />
        <TextField value={formData.address_line_2} variant="standard" type="text" name="address_line_2" placeholder="Address Line 2" onChange={handleChange} />
        <TextField value={formData.address_line_3} variant="standard" type="text" name="address_line_3" placeholder="Address Line 3" onChange={handleChange} />
        <TextField value={formData.city} variant="standard" type="text" name="city" placeholder="City" onChange={handleChange} required />
        <TextField value={formData.state} variant="standard" type="text" name="state" placeholder="State" onChange={handleChange} required />
        <TextField value={formData.zip_code} variant="standard" type="text" name="zip_code" placeholder="Zip Code" onChange={handleChange} required />
        <TextField value={formData.country} variant="standard" type="text" name="country" placeholder="Country" onChange={handleChange} required />
        <TextField value={formData.phone_number} variant="standard" type="text" name="phone_number" placeholder="Phone Number" onChange={handleChange} required />
        <Button variant="text" type="submit">Add Client</Button>
      </form>
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      <ul>
        {clients.map((client) => (
          <li key={client.id}>
            {client.name} - {client.city}
            <Button color="error" onClick={() => handleDelete(client.id)}>Delete</Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Clients;

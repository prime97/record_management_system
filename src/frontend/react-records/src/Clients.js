import React, { useState, useEffect } from "react";
import axios from "axios";
import {Button, TextField, Box, colors} from "@mui/material";
import "./App.css";

function Clients() {
  const [clients, setClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
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
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSelectClient = (client) => {
    setSelectedClientId(client.id);
    setFormData(client);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedClientId) {
      await axios.put(`http://localhost:5000/clients/${selectedClientId}`, formData);
    } else {
      await axios.post("http://localhost:5000/clients", formData);
    }
    fetchClients();
    resetForm();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/clients/${id}`);
    fetchClients();
    resetForm();
  };

  const resetForm = () => {
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
    setSelectedClientId(null);
    setSearchQuery("");
    setHasSearched(false);
  };

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );



  return (

    <div id="input-field">
      <h3>Clients</h3>

      {/* Search Input */}
      <TextField
        type="text"
        placeholder="Search by Client name"
        value={searchQuery}
        onChange={handleSearchChange}
      />

      {/* Search Results */}
      {searchQuery && (
        filteredClients.length > 0 ? (
          <ul>
            {filteredClients.map((client) => (
              <li key={client.id}>
                {client.name} - {client.phone_number}
                  <Button onClick={() => handleSelectClient(client)}>Edit</Button>
                  <Button onClick={() => handleDelete(client.id)}>Delete</Button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Client not found!</p>
        )
      )}
     
      <form onSubmit={handleSubmit}   style={{
                    width: '80%',
                    maxWidth: '400px', // Good for responsiveness
                    display: 'flex',        // Make the form a flex container
                    flexDirection: 'column', // Stack items vertically
                    alignItems: 'center',   // Center items horizontally
                    margin: '0 auto', 
                    gap:'7px',
                    button: colors
                }}>
        <h4>{selectedClientId ? "Update Client" : "Add Client"}</h4>
        <TextField value={formData.name} variant="standard" type="text" name="name" placeholder="Name"  onChange={handleChange} required />
        <TextField value={formData.address_line_1} variant="standard" type="text" name="address_line_1" placeholder="Address Line 1" onChange={handleChange} required />
        <TextField value={formData.address_line_2} variant="standard" type="text" name="address_line_2" placeholder="Address Line 2" onChange={handleChange} />
        <TextField value={formData.address_line_3} variant="standard" type="text" name="address_line_3" placeholder="Address Line 3" onChange={handleChange} />
        <TextField value={formData.city} variant="standard" type="text" name="city" placeholder="City" onChange={handleChange} required />
        <TextField value={formData.state} variant="standard" type="text" name="state" placeholder="State" onChange={handleChange} required />
        <TextField value={formData.zip_code} variant="standard" type="text" name="zip_code" placeholder="Zip Code" onChange={handleChange} required />
        <TextField value={formData.country} variant="standard" type="text" name="country" placeholder="Country" onChange={handleChange} required />
        <TextField value={formData.phone_number} variant="standard" type="text" name="phone_number" placeholder="Phone Number" onChange={handleChange} required />
        <Button type="submit">{selectedClientId ? "Update" : "Add"}</Button>
        {selectedClientId && <Button type="button" onClick={resetForm}>Cancel</Button>}
      </form>
    </div>
  );
}

export default Clients;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, TextField } from "@mui/material";
import "./App.css";

function Airlines() {
  const [airlines, setAirlines] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({ company_name: "" });
  const [selectedAirlineId, setSelectedAirlineId] = useState(null);


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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSelectAirline = (airline) => {
    setSelectedAirlineId(airline.id);
    setFormData({ company_name: airline.company_name });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedAirlineId) {
      await axios.put(`http://localhost:5000/airlines/${selectedAirlineId}`, formData);
    } else {
      await axios.post("http://localhost:5000/airlines", formData);
    }
    fetchAirlines();
    resetForm();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/airlines/${id}`);
    fetchAirlines();
    resetForm();
  };

  const resetForm = () => {
    setFormData({ company_name: "" });
    setSelectedAirlineId(null);
  };

  const filteredAirlines = airlines.filter((airline) =>
    airline.company_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id='input-field'>
      <h3>Airlines</h3>

      {/* Search */}
      <TextField
        type="text"
        placeholder="Search by company name"
        value={searchQuery}
        onChange={handleSearchChange}
      />

      {/* Search Results */}
      {searchQuery && (
        filteredAirlines.length > 0 ? (
          <ul>
            {filteredAirlines.map((airline) => (
              <li key={airline.id}>
                {airline.company_name}
                <Button onClick={() => handleSelectAirline(airline)}>Edit</Button>
                <Button onClick={() => handleDelete(airline.id)}>Delete</Button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Airline not found!</p>
        )
      )}

      {/* Add or Update Form */}
      <form onSubmit={handleSubmit}>
        <h4>{selectedAirlineId ? "Update Airline" : "Add Airline"}</h4>
        <TextField
          name="company_name"
          placeholder="Company Name"
          value={formData.company_name}
          onChange={handleChange}
          required
        />
        <Button type="submit">{selectedAirlineId ? "Update" : "Add"}</Button>
        {selectedAirlineId && <Button type="button" onClick={resetForm}>Cancel</Button>}
      </form>
    </div>
  );
}

export default Airlines;

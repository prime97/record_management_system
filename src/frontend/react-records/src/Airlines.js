import React, { useState, useEffect } from "react";
import axios from "axios";
import {Button,TextField} from "@mui/material";
import "./App.css";

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
    <div id='input-field'>
      <h3>Airlines</h3>
      <form onSubmit={handleSubmit}>
        <TextField variant="standard" type="text" name="company_name" placeholder="Company Name" onChange={handleChange} required />
        <Button variant="text" type="submit">Add Airline</Button>
      </form>
      <ul>
        {airlines.map((airline) => (
          <li key={airline.id}>
            {airline.company_name}
            <Button color="error" onClick={() => handleDelete(airline.id)}>Delete</Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Airlines;

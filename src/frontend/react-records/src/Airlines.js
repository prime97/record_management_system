import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, TextField } from "@mui/material";
import "./App.css";

function Airlines() {
  const [airlines, setAirlines] = useState([]);
  const [formData, setFormData] = useState({ company_name: "" });
  const [successMessage, setSuccessMessage] = useState("");
  const [editingId, setEditingId] = useState(null);


  useEffect(() => {
    fetchAirlines();
  }, []);

  useEffect(() => {
    console.log("editingId changed to:", editingId);
  }, [editingId]);

  const fetchAirlines = async () => {
    const response = await axios.get("http://localhost:5000/airlines");
    setAirlines(response.data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (airline) => {
    setEditingId(airline.id);
    setFormData({ company_name: airline.company_name });
    console.log(airline.id,airline.company_name)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { company_name } = formData;
      if (editingId) {
        // Update existing airline
        await axios.put(`http://localhost:5000/airlines/${editingId}`, formData);
        setSuccessMessage(`${company_name} updated`);
        setEditingId(null); // Reset editing ID
      } else {
        // Add new airline
        await axios.post("http://localhost:5000/airlines", formData);
        setSuccessMessage(`${company_name} added`);
      }
      // await axios.post("http://localhost:5000/airlines", formData);
      fetchAirlines();
      setFormData({ company_name: "" });
      // setSuccessMessage(`${company_name} added`);
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000); // Adjust the delay to erase the success 
    } catch (error) {
      console.error(editingId ? "Error updating airline:" : "Error adding airline:", error);
      setSuccessMessage(editingId ? "Error updating airline" : "Error adding airline");
        setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    }
  };


  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/airlines/${id}`);
    fetchAirlines();
  };

  return (
    <div id='input-field'>
      <h3>Airlines</h3>
      <form onSubmit={handleSubmit}>
        <TextField variant="standard" type="text" name="company_name" placeholder="Company Name" onChange={handleChange} value={formData.company_name}
          required />
        {/* <Button variant="text" type="submit">Add Airline</Button> */}
        <Button variant="text" type="submit">
  {editingId ? "Update" : "Add Airline"}
</Button>
{editingId && (
          <Button onClick={() => { setEditingId(null); setFormData({ company_name: "" }); }}>
            Cancel
          </Button>
        )}
      </form>
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      <ul>
        {airlines.map((airline) => (
          <li key={airline.id}>
            {airline.company_name}
            <Button color="error" onClick={() => handleDelete(airline.id)}>Delete</Button>
            <Button color="success" onClick={() => handleEdit(airline)}>Edit</Button>

          </li>
        ))}
      </ul>
    </div>
  );
}

export default Airlines;

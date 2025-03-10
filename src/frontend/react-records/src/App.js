import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [records, setRecords] = useState({ clients: [], airlines: [], flights: [] });
  const [recordType, setRecordType] = useState("Client");
  const [formData, setFormData] = useState({});
  const [searchId, setSearchId] = useState("");

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    const response = await axios.get("http://127.0.0.1:5000/records");
    setRecords(response.data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://127.0.0.1:5000/add", { ...formData, Type: recordType });
    fetchRecords();
  };

  const handleSearch = async () => {
    if (searchId) {
      const response = await axios.get(`http://127.0.0.1:5000/search/${recordType.toLowerCase()}s/${searchId}`);
      alert(JSON.stringify(response.data, null, 2));
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://127.0.0.1:5000/delete/${recordType.toLowerCase()}s/${id}`);
    fetchRecords();
  };

  return (
    <div>
      <h2>Record Management System</h2>

      <label>Select Record Type:</label>
      <select value={recordType} onChange={(e) => setRecordType(e.target.value)}>
        <option>Client</option>
        <option>Airline</option>
        <option>Flight</option>
      </select>

      <form onSubmit={handleSubmit}>
        {recordType === "Client" && (
          <>
            <input type="text" name="Name" placeholder="Name" onChange={handleChange} required />
            <input type="text" name="City" placeholder="City" onChange={handleChange} required />
            <input type="text" name="Phone Number" placeholder="Phone" onChange={handleChange} required />
          </>
        )}

        {recordType === "Airline" && (
          <input type="text" name="Company Name" placeholder="Company Name" onChange={handleChange} required />
        )}

        {recordType === "Flight" && (
          <>
            <input type="number" name="Client_ID" placeholder="Client ID" onChange={handleChange} required />
            <input type="number" name="Airline_ID" placeholder="Airline ID" onChange={handleChange} required />
            <input type="text" name="Start City" placeholder="Start City" onChange={handleChange} required />
            <input type="text" name="End City" placeholder="End City" onChange={handleChange} required />
            <input type="date" name="Date" onChange={handleChange} required />
          </>
        )}

        <button type="submit">Add Record</button>
      </form>

      <h3>Search Record by ID</h3>
      <input type="number" placeholder="Enter ID" onChange={(e) => setSearchId(e.target.value)} />
      <button onClick={handleSearch}>Search</button>

      <h3>Records</h3>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Details</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records[`${recordType.toLowerCase()}s`]?.map((record) => (
            <tr key={record.ID}>
              <td>{record.ID}</td>
              <td>{JSON.stringify(record)}</td>
              <td>
                <button onClick={() => handleDelete(record.ID)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

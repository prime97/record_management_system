import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [recordType, setRecordType] = useState("Client");
  const [formData, setFormData] = useState({});
  const [clients, setClients] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [flights, setFlights] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({ clients: [], airlines: [], flights: [] });

  // Fetch all data on mount
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [clientsRes, airlinesRes, flightsRes] = await Promise.all([
        axios.get("http://127.0.0.1:5000/clients"),
        axios.get("http://127.0.0.1:5000/airlines"),
        axios.get("http://127.0.0.1:5000/flights")
      ]);

      setClients(clientsRes.data);
      setAirlines(airlinesRes.data);
      setFlights(flightsRes.data);
    } catch (err) {
      console.error("Failed to load data:", err);
    }
  }

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    // Based on record type, post to the correct endpoint
    let url = "";
    if (recordType === "Client") url = "http://127.0.0.1:5000/clients";
    if (recordType === "Airline") url = "http://127.0.0.1:5000/airlines";
    if (recordType === "Flight") url = "http://127.0.0.1:5000/flights";

    try {
      await axios.post(url, formData);
      alert(recordType + " created successfully!");
      setFormData({});
      loadData();
    } catch (err) {
      console.error(err);
      alert("Error creating " + recordType);
    }
  }

  async function handleSearch() {
    if (!searchQuery) return;
    try {
      const res = await axios.get("http://127.0.0.1:5000/search?q=" + searchQuery);
      setSearchResults(res.data);
    } catch (err) {
      console.error("Search failed:", err);
    }
  }

  return (
    <div>
      <h1>Record Management System</h1>

      <label>Select Record Type: </label>
      <select value={recordType} onChange={(e) => setRecordType(e.target.value)}>
        <option value="Client">Client</option>
        <option value="Airline">Airline</option>
        <option value="Flight">Flight</option>
      </select>

      <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
        {recordType === "Client" && (
          <>
            <input name="Name" placeholder="Name" onChange={handleChange} required />
            <input name="Address Line 1" placeholder="Address Line 1" onChange={handleChange} required />
            <input name="Address Line 2" placeholder="Address Line 2" onChange={handleChange} />
            <input name="Address Line 3" placeholder="Address Line 3" onChange={handleChange} />
            <input name="City" placeholder="City" onChange={handleChange} required />
            <input name="State" placeholder="State" onChange={handleChange} required />
            <input name="Zip Code" placeholder="Zip Code" onChange={handleChange} required />
            <input name="Country" placeholder="Country" onChange={handleChange} required />
            <input name="Phone Number" placeholder="Phone Number" onChange={handleChange} required />
          </>
        )}

        {recordType === "Airline" && (
          <>
            <input name="Company Name" placeholder="Company Name" onChange={handleChange} required />
          </>
        )}

        {recordType === "Flight" && (
          <>
            <input name="Client_ID" placeholder="Client_ID (int)" type="number" onChange={handleChange} required />
            <input name="Airline_ID" placeholder="Airline_ID (int)" type="number" onChange={handleChange} required />
            <input name="Date" placeholder="YYYY-MM-DD" type="date" onChange={handleChange} required />
            <input name="Start City" placeholder="Start City" onChange={handleChange} required />
            <input name="End City" placeholder="End City" onChange={handleChange} required />
          </>
        )}
        <button type="submit">Add {recordType}</button>
      </form>

      <hr />

      <div>
        <h2>Search</h2>
        <input
          type="text"
          placeholder="Enter search text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>

        {searchResults.clients.length > 0 ||
        searchResults.airlines.length > 0 ||
        searchResults.flights.length > 0 ? (
          <div>
            <h4>Clients Found</h4>
            <ul>
              {searchResults.clients.map((c) => (
                <li key={c.ID}>{c.Name}</li>
              ))}
            </ul>
            <h4>Airlines Found</h4>
            <ul>
              {searchResults.airlines.map((a) => (
                <li key={a.ID}>{a["Company Name"]}</li>
              ))}
            </ul>
            <h4>Flights Found</h4>
            <ul>
              {searchResults.flights.map((f, idx) => (
                <li key={idx}>
                  {f.Client_ID} → {f.Airline_ID}, {f["Start City"]} to {f["End City"]}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No search results.</p>
        )}
      </div>

      <hr />

      <h2>All Clients</h2>
      <ul>
        {clients.map((c) => (
          <li key={c.ID}>{c.ID} - {c.Name}</li>
        ))}
      </ul>

      <h2>All Airlines</h2>
      <ul>
        {airlines.map((a) => (
          <li key={a.ID}>{a.ID} - {a["Company Name"]}</li>
        ))}
      </ul>

      <h2>All Flights</h2>
      <ul>
        {flights.map((f, idx) => (
          <li key={idx}>
            Client {f.Client_ID}, Airline {f.Airline_ID}, Date: {f.Date},
            Route: {f["Start City"]} → {f["End City"]}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

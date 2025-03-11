import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Clients from "./Clients";
import Airlines from "./Airlines";
import Flights from "./Flights";
import './App.css';

function App() {
  return (
    <Router>
      <div id='main'>
        <h2>Record Management System</h2>
        <nav>
          <ul>
            <li><Link to="/clients">Clients</Link></li>
            <li><Link to="/airlines">Airlines</Link></li>
            <li><Link to="/flights">Flights</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/clients" element={<Clients />} />
          <Route path="/airlines" element={<Airlines />} />
          <Route path="/flights" element={<Flights />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


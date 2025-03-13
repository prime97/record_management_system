import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import React from "react";
import Button from '@mui/material/Button';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Clients from "./Clients";
import Airlines from "./Airlines";
import Flights from "./Flights";
import './App.css';
import { ButtonGroup } from "@mui/material";

function App() {
  return (
    <Router>
      <div id='main'>
        <h2>Record Management System</h2>
        <nav>
          <ul>
            <ButtonGroup id='btn_group' variant="contained" aria-label="Basic button group">
              <Button><Link to="/clients">Clients</Link></Button>
              <Button><Link to="/airlines">Airlines</Link></Button>
              <Button><Link to="/flights">Flights</Link></Button>
            </ButtonGroup>
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


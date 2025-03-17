import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import {React,useState} from "react";
import Button from '@mui/material/Button';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Clients from "./Clients";
import Airlines from "./Airlines";
import Flights from "./Flights";
import './App.css';
import { TextField,Paper ,Stack} from "@mui/material";

function App() {
  const [searchQuery, setSearchQuery] = useState(""); // State for the search query

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <Router>
      {/* Wrap the main content in a Paper component */}
      <Paper elevation={20} sx={{ padding: '20px', maxWidth: '500px',  margin: '20px auto' ,marginTop:'50px'}}>
        <div id='main'>
          <h1>Record Management System</h1>
          <TextField
            variant="outlined"
            label="Search"
            size="small"
            placeholder="Search Records..."
            value={searchQuery}
            fullWidth
            onChange={handleSearchChange}
            margin="normal" // Add some spacing around the TextField
          />

          <nav>
            {/* <ul> */}
              {/* <ButtonGroup id='btn_group' variant="contained" aria-label="Basic button group"> */}
                {/* Use Link components *inside* the Buttons */}
                <Stack direction="row" spacing={2}>
                <Button variant='contained'component={Link} to="/clients">Clients</Button>
                <Button variant='contained'component={Link} to="/airlines">Airlines</Button>
                <Button variant='contained'component={Link} to="/flights">Flights</Button>
              {/* </ButtonGroup> */}
              </Stack>
            {/* </ul> */}
          </nav>
          <Routes>
            <Route path="/clients" element={<Clients />} />
            <Route path="/airlines" element={<Airlines />} />
            <Route path="/flights" element={<Flights />} />
          </Routes>
        </div>
      </Paper>
    </Router>
  );
}

export default App;


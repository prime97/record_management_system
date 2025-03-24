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

          <nav id="buttons">
            {/* <ul> */}
              {/* <ButtonGroup id='btn_group' variant="contained" aria-label="Basic button group"> */}
                {/* Use Link components *inside* the Buttons */}
                <Stack direction="row" spacing={2}>
                <Button size="small" variant ='contained'component={Link} to="/clients">Clients</Button>
                <Button size="small" variant='contained'component={Link} to="/airlines">Airlines</Button>
                <Button size="small" variant='contained'component={Link} to="/flights">Flights</Button>
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


import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import LandingPage from "./components/LandingPage";
import FilmsPage from "./components/FilmsPage";
import CustomersPage from "./components/CustomersPage"; // Import new CustomersPage

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/" element={<LandingPage />} /> {/* Landing Page */}
            <Route path="/films" element={<FilmsPage />} /> {/* Films Page */}
            <Route path="/customers" element={<CustomersPage />} /> {/* Customers Page */}
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;

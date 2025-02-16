import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import LandingPage from "./components/LandingPage";
import FilmsPage from "./components/FilmsPage";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/" element={<LandingPage />} /> {/* Landing Page Route */}
            <Route path="/films" element={<FilmsPage />} /> {/* Films Page Route */}
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;

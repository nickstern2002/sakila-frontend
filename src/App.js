import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import LandingPage from "./components/LandingPage";
import FilmsPage from "./components/FilmsPage";
import AdminLogin from "./components/AdminLogin";
import UserLogin from "./components/UserLogin";
import AdminDashboard from "./components/AdminDashboard";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/" element={<LandingPage />} /> { }
            <Route path="/films" element={<FilmsPage />} /> { }
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/user-login" element={<UserLogin />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} /> { }
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;

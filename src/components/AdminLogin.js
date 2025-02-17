import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminLogin.css";

const AdminLogin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Check if already logged in (for example, stored in localStorage)
    useEffect(() => {
        //const loggedIn = localStorage.getItem("adminLoggedIn");
        //if (loggedIn === "true") {
        //    navigate("/admin-dashboard");
        //}
    }, [navigate]);

    const handleLogin = () => {
        fetch("http://127.0.0.1:5000/api/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Invalid credentials");
                }
                return response.json();
            })
            .then((data) => {
                // On successful login, remember login state (for demonstration)
                localStorage.setItem("adminLoggedIn", "true");
                setError("");
                // Redirect to Admin Dashboard (placeholder)
                navigate("/admin-dashboard");
            })
            .catch((err) => {
                setError(err.message);
            });
    };

    return (
        <div className="login-page">
            <h1>Admin Login</h1>
            {error && <p className="error">{error}</p>}
            <div className="login-form">
                <label>
                    Username:
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter username..."
                    />
                </label>
                <label>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password..."
                    />
                </label>
                <button onClick={handleLogin}>Login</button>
            </div>
            <Link to="/add-admin">
                <button className="add-admin-button">Add New Admin</button>
            </Link>
        </div>
    );
};

export default AdminLogin;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
    const [customers, setCustomers] = useState([]);
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(false);
    const [searchQuery, setSearchQuery] = useState({ customerId: "", firstName: "", lastName: "" });
    const [newCustomer, setNewCustomer] = useState({ first_name: "", last_name: "", email: "", phone: "" });
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        fetchCustomers();
    }, [page]);

    const fetchCustomers = () => {
        let url = `http://127.0.0.1:5000/api/customers/?page=${page}`;
        if (searchQuery.customerId) url += `&customer_id=${searchQuery.customerId}`;
        if (searchQuery.firstName) url += `&first_name=${searchQuery.firstName}`;
        if (searchQuery.lastName) url += `&last_name=${searchQuery.lastName}`;

        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                setCustomers(data.customers || []);
                setHasNext(data.has_next || false);
            })
            .catch((error) => console.error("Error fetching customers:", error));
    };

    const handleSearch = () => {
        setPage(1);
        fetchCustomers();
    };

    const handleInputChange = (e, field, type = "search") => {
        if (type === "search") {
            setSearchQuery({ ...searchQuery, [field]: e.target.value });
        } else {
            setNewCustomer({ ...newCustomer, [field]: e.target.value });
        }
    };

    const handleAddCustomer = () => {
        console.log("Sending data:", newCustomer);
        fetch("http://127.0.0.1:5000/api/customers/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newCustomer),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    alert(`Error: ${data.error}`);
                } else {
                    alert("Customer added successfully!");
                    setIsAdding(false);
                    setNewCustomer({ first_name: "", last_name: "", email: "", phone: "" });
                    fetchCustomers();
                }
            })
            .catch((error) => console.error("Error adding customer:", error));
    };

    return (
        <div className="admin-dashboard">
            <div className="header">
                <Link to="/">
                    <button className="home-page-button">Return to Home</button>
                </Link>
            </div>

            <h1>Admin Dashboard</h1>

            <div className="search-box">
                <label>Customer ID:</label>
                <input type="text" value={searchQuery.customerId} onChange={(e) => handleInputChange(e, "customerId")} placeholder="Enter Customer ID" />

                <label>First Name:</label>
                <input type="text" value={searchQuery.firstName} onChange={(e) => handleInputChange(e, "firstName")} placeholder="Enter First Name" />

                <label>Last Name:</label>
                <input type="text" value={searchQuery.lastName} onChange={(e) => handleInputChange(e, "lastName")} placeholder="Enter Last Name" />

                <button onClick={handleSearch} className="search-button">Search</button>
            </div>

            <div className="results-box">
                {customers.length > 0 ? (
                    customers.map((customer) => (
                        <div key={customer.customer_id} className="result-item">
                            <p><strong>{customer.first_name} {customer.last_name}</strong></p>
                            <p>Email: {customer.email || "N/A"}</p>
                            <p>Phone: {customer.phone || "N/A"}</p>
                        </div>
                    ))
                ) : (
                    <p>No customers found.</p>
                )}
            </div>

            <div className="pagination">
                {page > 1 && <button onClick={() => setPage(page - 1)}>⬅ Previous</button>}
                {hasNext && <button onClick={() => setPage(page + 1)}>Next ➡</button>}
            </div>

            <button onClick={() => setIsAdding(true)} className="add-customer-button">Add New Customer</button>

            {isAdding && (
                <div className="popup">
                    <h2>Add New Customer</h2>
                    <input type="text" placeholder="First Name" value={newCustomer.first_name} onChange={(e) => handleInputChange(e, "first_name", "new")} />
                    <input type="text" placeholder="Last Name" value={newCustomer.last_name} onChange={(e) => handleInputChange(e, "last_name", "new")} />
                    <input type="email" placeholder="Email" value={newCustomer.email} onChange={(e) => handleInputChange(e, "email", "new")} />
                    <input type="text" placeholder="Phone" value={newCustomer.phone} onChange={(e) => handleInputChange(e, "phone", "new")} />
                    <button onClick={handleAddCustomer}>Add Customer</button>
                    <button onClick={() => setIsAdding(false)}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;

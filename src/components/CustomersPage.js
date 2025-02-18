import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./CustomersPage.css";

const CustomersPage = () => {
    const [customers, setCustomers] = useState([]);
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(false);
    const [searchQuery, setSearchQuery] = useState({ customerId: "", firstName: "", lastName: "" });

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

    const handleInputChange = (e, field) => {
        setSearchQuery({ ...searchQuery, [field]: e.target.value });
    };

    return (
        <div className="customers-container">
            <div className="header">
                <Link to="/">
                    <button className="home-page-button">Return to Home</button>
                </Link>
            </div>

            <h1>Customers</h1>

            <div className="search-box">
                <label>Customer ID:</label>
                <input type="text" value={searchQuery.customerId} onChange={(e) => handleInputChange(e, "customerId")} />

                <label>First Name:</label>
                <input type="text" value={searchQuery.firstName} onChange={(e) => handleInputChange(e, "firstName")} />

                <label>Last Name:</label>
                <input type="text" value={searchQuery.lastName} onChange={(e) => handleInputChange(e, "lastName")} />

                <button onClick={handleSearch} className="search-button">Search</button>
            </div>

            <div className="results-box">
                {customers.length > 0 ? (
                    customers.map((customer) => (
                        <div key={customer.customer_id} className="result-item">
                            <p><strong>{customer.customer_id}: {customer.first_name} {customer.last_name}</strong></p>
                            <p>Email: {customer.email || "N/A"}</p>
                            <p>Store ID: {customer.store_id}</p>
                            <p>Active: {customer.active ? "Yes" : "No"}</p>
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
        </div>
    );
};

export default CustomersPage;

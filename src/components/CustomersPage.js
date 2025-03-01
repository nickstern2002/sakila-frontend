import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./CustomersPage.css";

const CustomersPage = () => {
    const [customers, setCustomers] = useState([]);
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(false);
    const [searchQuery, setSearchQuery] = useState({ customerId: "", firstName: "", lastName: "" });
    const [isAdding, setIsAdding] = useState(false);
    const [newCustomer, setNewCustomer] = useState({
        firstName: "",
        lastName: "",
        email: "",
        storeId: "1",
        address: "",
        address2: "",
        district: "",
        cityId: "1",
        postalCode: "",
        phone: ""
    });

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
        fetch("http://127.0.0.1:5000/api/customers/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                first_name: newCustomer.firstName,
                last_name: newCustomer.lastName,
                email: newCustomer.email,
                store_id: newCustomer.storeId,
                address: newCustomer.address,
                address2: newCustomer.address2,
                district: newCustomer.district,
                city_id: newCustomer.cityId,
                postal_code: newCustomer.postalCode,
                phone: newCustomer.phone
            })
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    alert(`Error: ${data.error}`);
                } else {
                    alert("Customer added successfully!");
                    setIsAdding(false);
                    setNewCustomer({
                        firstName: "",
                        lastName: "",
                        email: "",
                        storeId: "1",
                        address: "",
                        address2: "",
                        district: "",
                        cityId: "1",
                        postalCode: "",
                        phone: ""
                    });
                    fetchCustomers();
                }
            })
            .catch((error) => console.error("Error adding customer:", error));
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

            <button onClick={() => setIsAdding(true)} className="add-customer-button">Add New Customer</button>

            {isAdding && (
                <div className="popup">
                    <h2>Add New Customer</h2>
                    <input type="text" placeholder="First Name" value={newCustomer.firstName} onChange={(e) => handleInputChange(e, "firstName", "new")} />
                    <input type="text" placeholder="Last Name" value={newCustomer.lastName} onChange={(e) => handleInputChange(e, "lastName", "new")} />
                    <input type="email" placeholder="Email" value={newCustomer.email} onChange={(e) => handleInputChange(e, "email", "new")} />
                    <label>Store ID:</label>
                    <select value={newCustomer.storeId} onChange={(e) => handleInputChange(e, "storeId", "new")}>
                        <option value="1">Store 1</option>
                        <option value="2">Store 2</option>
                    </select>
                    <input type="text" placeholder="Address 1" value={newCustomer.address} onChange={(e) => handleInputChange(e, "address", "new")} />
                    <input type="text" placeholder="Address 2 (Optional)" value={newCustomer.address2} onChange={(e) => handleInputChange(e, "address2", "new")} />
                    <input type="text" placeholder="District" value={newCustomer.district} onChange={(e) => handleInputChange(e, "district", "new")} />
                    <label>City ID:</label>
                    <select value={newCustomer.cityId} onChange={(e) => handleInputChange(e, "cityId", "new")}>
                        {[...Array(600).keys()].map(i => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
                    </select>
                    <input type="text" placeholder="Postal Code" value={newCustomer.postalCode} onChange={(e) => handleInputChange(e, "postalCode", "new")} />
                    <input type="text" placeholder="Phone" value={newCustomer.phone} onChange={(e) => handleInputChange(e, "phone", "new")} />
                    <button onClick={handleAddCustomer}>Add Customer</button>
                    <button onClick={() => setIsAdding(false)}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default CustomersPage;

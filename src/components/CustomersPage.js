import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./CustomersPage.css";

const CustomersPage = () => {
    const [customers, setCustomers] = useState([]);
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(false);
    const [searchQuery, setSearchQuery] = useState({ customerId: "", firstName: "", lastName: "" });
    const [isAdding, setIsAdding] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [deleteCustomerId, setDeleteCustomerId] = useState("");
    const [expandedCustomer, setExpandedCustomer] = useState(null);
    const [customerDetails, setCustomerDetails] = useState({});
    const [editCustomer, setEditCustomer] = useState({});
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

    const fetchCustomerDetails = (customerId) => {
        if (expandedCustomer === customerId) {
            setExpandedCustomer(null);
            return;
        }

        fetch(`http://127.0.0.1:5000/api/customers/${customerId}`)
            .then((res) => res.json())
            .then((data) => {
                setCustomerDetails((prevDetails) => ({ ...prevDetails, [customerId]: data }));
                setExpandedCustomer(customerId);
            })
            .catch((error) => console.error("Error fetching customer details:", error));
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

    const handleDeleteCustomer = () => {
        if (!deleteCustomerId) {
            alert("Please enter a Customer ID to delete.");
            return;
        }

        fetch(`http://127.0.0.1:5000/api/customers/${deleteCustomerId}`, {
            method: "DELETE",
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    alert(`Error: ${data.error}`);
                } else {
                    alert("Customer deleted successfully!");
                    setIsDeleting(false);
                    setDeleteCustomerId("");
                    fetchCustomers();
                }
            })
            .catch((error) => console.error("Error deleting customer:", error));
    };

    const handleEditCustomer = (customerId) => {
        setEditCustomer(customerDetails[customerId]);
        setIsEditing(true);
    };

    const handleUpdateCustomer = () => {
        fetch(`http://127.0.0.1:5000/api/customers/${editCustomer.customer_id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                first_name: editCustomer.first_name,
                last_name: editCustomer.last_name,
                email: editCustomer.email,
                store_id: editCustomer.store_id,
                address: editCustomer.address,
                address2: editCustomer.address2,
                district: editCustomer.district,
                city_id: editCustomer.city_id,
                postal_code: editCustomer.postal_code,
                phone: editCustomer.phone
            })
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    alert(`Error: ${data.error}`);
                } else {
                    alert("Customer updated successfully!");
                    setIsEditing(false);
                    fetchCustomers();
                }
            })
            .catch((error) => console.error("Error updating customer:", error));
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
                <input type="text" value={searchQuery.customerId} onChange={(e) => setSearchQuery({ ...searchQuery, customerId: e.target.value })} />
                <label>First Name:</label>
                <input type="text" value={searchQuery.firstName} onChange={(e) => setSearchQuery({ ...searchQuery, firstName: e.target.value })} />
                <label>Last Name:</label>
                <input type="text" value={searchQuery.lastName} onChange={(e) => setSearchQuery({ ...searchQuery, lastName: e.target.value })} />
                <button onClick={fetchCustomers} className="search-button">Search</button>
            </div>

            <div className="results-box">
                {customers.length > 0 ? (
                    customers.map((customer) => (
                        <div key={customer.customer_id} className="result-item" onClick={() => fetchCustomerDetails(customer.customer_id)}>
                            <p><strong>{customer.customer_id}: {customer.first_name} {customer.last_name}</strong></p>
                            <p>Email: {customer.email || "N/A"}</p>
                            <p>Store ID: {customer.store_id}</p>
                            <p>Active: {customer.active ? "Yes" : "No"}</p>
                            {expandedCustomer === customer.customer_id && customerDetails[customer.customer_id] && (
                                <div className="customer-details">
                                    <p><strong>Address:</strong> {customerDetails[customer.customer_id].address}, {customerDetails[customer.customer_id].district}</p>
                                    <p><strong>Phone:</strong> {customerDetails[customer.customer_id].phone}</p>
                                    <p><strong>Rental History:</strong></p>
                                    <ul>
                                        {customerDetails[customer.customer_id].rental_history.length > 0 ? (
                                            customerDetails[customer.customer_id].rental_history.map((rental, index) => (
                                                <li key={index}>{rental.title} - Rented on {rental.rental_date}, Returned on {rental.return_date || "Not Returned"}</li>
                                            ))
                                        ) : (
                                            <p>No rentals found.</p>
                                        )}
                                    </ul>
                                    <button onClick={() => handleEditCustomer(customer.customer_id)}>Edit Customer</button>
                                </div>
                            )}
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

            <button onClick={() => setIsDeleting(true)} className="delete-customer-button">Delete Customer</button>

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

            {isDeleting && (
                <div className="popup">
                    <h2>Delete Customer</h2>
                    <input type="text" placeholder="Enter Customer ID" value={deleteCustomerId} onChange={(e) => setDeleteCustomerId(e.target.value)} />
                    <button onClick={handleDeleteCustomer}>Delete</button>
                    <button onClick={() => setIsDeleting(false)}>Cancel</button>
                </div>
            )}

            {isEditing && (
                <div className="popup">
                    <h2>Edit Customer</h2>
                    <input type="text" placeholder="First Name" value={editCustomer.first_name} onChange={(e) => setEditCustomer({ ...editCustomer, first_name: e.target.value })} />
                    <input type="text" placeholder="Last Name" value={editCustomer.last_name} onChange={(e) => setEditCustomer({ ...editCustomer, last_name: e.target.value })} />
                    <input type="email" placeholder="Email" value={editCustomer.email} onChange={(e) => setEditCustomer({ ...editCustomer, email: e.target.value })} />

                    <label>Store ID:</label>
                    <select value={editCustomer.store_id} onChange={(e) => setEditCustomer({ ...editCustomer, store_id: e.target.value })}>
                        <option value="1">Store 1</option>
                        <option value="2">Store 2</option>
                    </select>

                    <input type="text" placeholder="Address 1" value={editCustomer.address} onChange={(e) => setEditCustomer({ ...editCustomer, address: e.target.value })} />
                    <input type="text" placeholder="Address 2 (Optional)" value={editCustomer.address2} onChange={(e) => setEditCustomer({ ...editCustomer, address2: e.target.value })} />
                    <input type="text" placeholder="District" value={editCustomer.district} onChange={(e) => setEditCustomer({ ...editCustomer, district: e.target.value })} />

                    <label>City ID:</label>
                    <select value={editCustomer.city_id} onChange={(e) => setEditCustomer({ ...editCustomer, city_id: e.target.value })}>
                        {[...Array(600).keys()].map(i => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
                    </select>

                    <input type="text" placeholder="Postal Code" value={editCustomer.postal_code} onChange={(e) => setEditCustomer({ ...editCustomer, postal_code: e.target.value })} />
                    <input type="text" placeholder="Phone" value={editCustomer.phone} onChange={(e) => setEditCustomer({ ...editCustomer, phone: e.target.value })} />

                    <button onClick={handleUpdateCustomer}>Update Customer</button>
                    <button onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
            )}

        </div>
    );
};

export default CustomersPage;

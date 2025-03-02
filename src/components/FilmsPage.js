import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import "./FilmsPage.css";

const FilmsPage = () => {
    const [filmQuery, setFilmQuery] = useState("");
    const [actorQuery, setActorQuery] = useState("");
    const [genreQuery, setGenreQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedFilm, setSelectedFilm] = useState(null);
    const [isRenting, setIsRenting] = useState(false);
    const [rentalCustomerId, setRentalCustomerId] = useState("");
    const [rentalFilmId, setRentalFilmId] = useState(null);

    // Handle search button click
    const handleSearch = () => {
        console.log("Searching for:", { filmQuery, actorQuery, genreQuery });
        const searchURL = `http://127.0.0.1:5000/films?film=${filmQuery}&actor=${actorQuery}&genre=${genreQuery}`;

        fetch(searchURL)
            .then((response) => response.json())
            .then((data) => {
                setSearchResults(data);
                // Clear any previously selected film
                setSelectedFilm(null);
            })
            .catch((error) => {
                console.error("Error fetching search results:", error);
            });
    };

    // Handle when a film result is clicked
    const handleFilmClick = (filmId) => {
        fetch(`http://127.0.0.1:5000/film/${filmId}`)
            .then((response) => response.json())
            .then((data) => {
                setSelectedFilm(data);
            })
            .catch((error) => {
                console.error("Error fetching film details:", error);
            });
    };

    const handleRentFilm = (filmId) => {
        setRentalFilmId(filmId);
        setIsRenting(true);
    };

    const submitRental = () => {
        fetch("http://127.0.0.1:5000/rentals/rent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ customer_id: rentalCustomerId, film_id: rentalFilmId })
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    alert(`Error: ${data.error}`);
                } else {
                    alert("Rental successfully recorded!");
                    setIsRenting(false);
                    setRentalCustomerId("");
                }
            })
            .catch((error) => console.error("Error renting film:", error));
    };

    return (
        <div className="films-container">
            {/* Header with "Go to Home Page" button in the top right */}
            <div className="header">
                <Link to="/">
                    <button className="home-page-button">Go to Home Page</button>
                </Link>
            </div>

            <h1>Films Page</h1>

            {/* Search Inputs */}
            <div className="search-box">
                <label>Film:</label>
                <input
                    type="text"
                    value={filmQuery}
                    onChange={(e) => setFilmQuery(e.target.value)}
                    placeholder="Enter film name..."
                />

                <label>Actor:</label>
                <input
                    type="text"
                    value={actorQuery}
                    onChange={(e) => setActorQuery(e.target.value)}
                    placeholder="Enter actor name..."
                />

                <label>Genre:</label>
                <input
                    type="text"
                    value={genreQuery}
                    onChange={(e) => setGenreQuery(e.target.value)}
                    placeholder="Enter genre..."
                />

                <button onClick={handleSearch} className="search-button">
                    Search
                </button>
            </div>

            <div className="results-box">
                {searchResults.length > 0 ? (
                    searchResults.map((film) => (
                        <React.Fragment key={film.film_id}>
                            <div className="result-item" onClick={() => handleFilmClick(film.film_id)}>
                                <p>{film.title} - {film.genre} ({film.release_year})</p>
                            </div>
                            {selectedFilm && selectedFilm.film_id === film.film_id && (
                                <div className="film-details-inline">
                                    <h2>{selectedFilm.title}</h2>
                                    <p><strong>Description:</strong> {selectedFilm.description}</p>
                                    <p><strong>Release Year:</strong> {selectedFilm.release_year}</p>
                                    <p><strong>Language:</strong> {selectedFilm.language}</p>
                                    <p><strong>Rating:</strong> {selectedFilm.rating}</p>
                                    {selectedFilm.actors && selectedFilm.actors.length > 0 && (
                                        <p><strong>Actors:</strong> {selectedFilm.actors.map((actor) => `${actor.first_name} ${actor.last_name}`).join(", ")}</p>
                                    )}
                                    <button onClick={() => handleRentFilm(selectedFilm.film_id)}>Rent Now</button>
                                    <button onClick={() => setSelectedFilm(null)}>Close</button>
                                </div>
                            )}
                        </React.Fragment>
                    ))
                ) : (
                    <p>Search results will appear here...</p>
                )}
            </div>

            {isRenting && (
                <div className="popup">
                    <h2>Rent Film</h2>
                    <input type="text" placeholder="Enter Customer ID" value={rentalCustomerId} onChange={(e) => setRentalCustomerId(e.target.value)} />
                    <button onClick={submitRental}>Confirm Rental</button>
                    <button onClick={() => setIsRenting(false)}>Cancel</button>
                </div>
            )}

        </div>
    );
};

export default FilmsPage;

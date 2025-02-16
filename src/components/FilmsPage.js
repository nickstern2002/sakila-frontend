import React, { useState } from "react";
import "./FilmsPage.css";

const FilmsPage = () => {
    const [filmQuery, setFilmQuery] = useState("");
    const [actorQuery, setActorQuery] = useState("");
    const [genreQuery, setGenreQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]); // Store backend results

    // Function to handle search button click
    const handleSearch = () => {
        console.log("Searching for:", { filmQuery, actorQuery, genreQuery });

        // Backend API URL (to be created in Flask)
        const searchURL = `http://127.0.0.1:5000/films?film=${filmQuery}&actor=${actorQuery}&genre=${genreQuery}`;

        fetch(searchURL)
            .then((response) => response.json())
            .then((data) => {
                setSearchResults(data); // Store results
            })
            .catch((error) => {
                console.error("Error fetching search results:", error);
            });
    };

    return (
        <div className="films-container">
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

                {/* Search Button */}
                <button onClick={handleSearch} className="search-button">Search</button>
            </div>

            {/* Results Box */}
            <div className="results-box">
                {searchResults.length > 0 ? (
                    searchResults.map((film, index) => (
                        <p key={index}>{film.title} - {film.genre} ({film.release_year})</p>
                    ))
                ) : (
                    <p>Search results will appear here...</p>
                )}
            </div>
        </div>
    );
};

export default FilmsPage;

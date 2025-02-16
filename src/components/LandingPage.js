import React, { useEffect, useState } from "react";
import "./LandingPage.css";

const LandingPage = () => {
  const [films, setFilms] = useState([]);
  const [actors, setActors] = useState([]);
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [selectedActor, setSelectedActor] = useState(null); // New state for selected actor
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/")
      .then((response) => response.json())
      .then((data) => {
        setFilms(data.top_rented_films || []);
        setActors(data.top_actors || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("Failed to load data");
        setLoading(false);
      });
  }, []);

  // Fetch film details
  const fetchFilmDetails = (filmId) => {
    fetch(`http://127.0.0.1:5000/film/${filmId}`)
      .then((response) => response.json())
      .then((data) => {
        setSelectedFilm(data);
      })
      .catch((error) => console.error("Error fetching film details:", error));
  };

  // Fetch actor details
  const fetchActorDetails = (actorId) => {
    fetch(`http://127.0.0.1:5000/actor/${actorId}`)
      .then((response) => response.json())
      .then((data) => {
        setSelectedActor(data);
      })
      .catch((error) => console.error("Error fetching actor details:", error));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="landing-container">
      <h2>Top Rented Films</h2>
      <div className="grid-container">
        {films.map((film) => (
          <div
            key={film.film_id}
            className="card"
            onClick={() => fetchFilmDetails(film.film_id)}
          >
            <p className="title">{film.title}</p>
            <p>{film.rental_count} rentals</p>
          </div>
        ))}
      </div>

      {selectedFilm && (
        <div className="film-details">
          <h2>{selectedFilm.title}</h2>
          <p><strong>Description:</strong> {selectedFilm.description}</p>
          <p><strong>Release Year:</strong> {selectedFilm.release_year}</p>
          <p><strong>Language:</strong> {selectedFilm.language}</p>
          <p><strong>Rating:</strong> {selectedFilm.rating}</p>
          <button onClick={() => setSelectedFilm(null)}>Close</button>
        </div>
      )}

      <h2>Top 5 Actors</h2>
      <div className="grid-container">
        {actors.map((actor) => (
          <div
            key={actor.actor_id}
            className="card"
            onClick={() => fetchActorDetails(actor.actor_id)} // Clickable actor card
          >
            <p className="title">
              {actor.first_name} {actor.last_name}
            </p>
            <p>{actor.film_count} films</p>
          </div>
        ))}
      </div>

      {selectedActor && (
        <div className="actor-details">
          <h2>{selectedActor.first_name} {selectedActor.last_name}</h2>
          <p><strong>Films:</strong> {selectedActor.film_count}</p>
          <h3>Top 5 Rented Films</h3>
          <ul>
            {selectedActor.top_rented_films.map((film) => (
              <li key={film.film_id}>
                {film.title} - {film.rental_count} rentals
              </li>
            ))}
          </ul>
          <button onClick={() => setSelectedActor(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default LandingPage;

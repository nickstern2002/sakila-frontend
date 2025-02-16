import React, { useEffect, useState } from "react";
import "./LandingPage.css"; // Import the CSS file

const LandingPage = () => {
  const [films, setFilms] = useState([]);
  const [actors, setActors] = useState([]);
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="landing-container">
      <h2>Top Rented Films</h2>
      <div className="grid-container">
        {films.map((film) => (
          <div key={film.film_id} className="card">
            <p className="title">{film.title}</p>
            <p>{film.rental_count} rentals</p>
          </div>
        ))}
      </div>

      <h2>Top 5 Actors</h2>
      <div className="grid-container">
        {actors.map((actor) => (
          <div key={actor.actor_id} className="card">
            <p className="title">
              {actor.first_name} {actor.last_name}
            </p>
            <p>{actor.film_count} films</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;

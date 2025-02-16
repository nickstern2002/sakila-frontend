import React, { useEffect, useState } from "react";

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
    <div>
      <h2>Top 5 Rented Films</h2>
      <ul>
        {films.map((film) => (
          <li key={film.film_id}>
            {film.title} - {film.rental_count} rentals
          </li>
        ))}
      </ul>

      <h2>Top 5 Actors</h2>
      <ul>
        {actors.map((actor) => (
          <li key={actor.actor_id}>
            {actor.first_name} {actor.last_name} - {actor.film_count} films
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LandingPage;

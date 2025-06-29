import React, { useEffect, useState } from 'react';

const MovieDetails = ({ movie }) => {
  const [cast, setCast] = useState([]);

  useEffect(() => {
    const fetchCast = async () => {
      if (!movie) return;
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${process.env.REACT_APP_TMDB_API_KEY}`
      );
      const data = await res.json();
      setCast(data.cast.slice(0, 6)); // Top 6 cast members
    };
    fetchCast();
  }, [movie]);

  if (!movie) return null;

  return (
    <div style={{
      maxWidth: '700px',
      margin: '2rem auto',
      padding: '1.5rem 2rem',
      backgroundColor: '#1f1f1f',
      borderRadius: '10px',
      color: '#fff',
      boxShadow: '0 0 20px rgba(0,0,0,0.3)',
    }}>
      <h2 style={{ marginBottom: '0.5rem' }}>{movie.title}</h2>
      <p style={{ margin: '0 0 1rem 0' }}>
        <strong>Release:</strong> {movie.release_date} | <strong>Rating:</strong> {movie.vote_average}
      </p>

      {cast.length > 0 && (
        <>
          <h3 style={{ marginBottom: '0.5rem' }}>Cast</h3>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            justifyContent: 'center',
          }}>
            {cast.map(actor => (
              <div key={actor.id} style={{ textAlign: 'center', width: '90px' }}>
                <img
                  src={
                    actor.profile_path
                      ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                      : 'https://via.placeholder.com/90x135?text=No+Image'
                  }
                  alt={actor.name}
                  style={{
                    borderRadius: '8px',
                    width: '90px',
                    height: '135px',
                    objectFit: 'cover',
                    marginBottom: '0.5rem'
                  }}
                />
                <span style={{ fontSize: '0.8rem' }}>{actor.name}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MovieDetails;

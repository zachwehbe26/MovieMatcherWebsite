import React, { useState } from 'react';

const SwipeCard = ({ movie, onLike, onDislike, onClear}) => {

  const [visibleDetails, setVisibleDetails] = useState(false);
  const handleClick = (src) => {
    setVisibleDetails(!visibleDetails)
  }

  if (!movie) return <div>Loading...</div>;

  // Automatically prep full URL or fallback
  const posterURL = movie.poster_path.startsWith("http")
    ? movie.poster_path
    : `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  //Show details when movie poster is clicked
  return (
    <div className="swipe-card" style={{ textAlign: 'center' }}>
        {visibleDetails ? (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div
          onClick={handleClick}
          style={{
            width: '350px',
            borderRadius: '12px',
            padding: '1rem',
            backgroundColor: '#f0f0f0',
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          <h2>{movie.title}</h2>
          <p><strong>Release Date:</strong> {movie.release_date}</p>
          <p><strong>Rating:</strong> {movie.vote_average}</p>
          <p><strong>Overview:</strong> {movie.overview}</p>
          <p style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>(Click to hide details)</p>
        </div>
      </div>
        ) : (
        //Show movie poster when details are clicked
        <img 
          onClick = {handleClick}
          src={posterURL}
          alt={movie.title}
          style={{ width: '350px', borderRadius: '12px' }}
          onError={(e) => {
          console.error("Failed to load image:", posterURL);
          e.target.src = "https://via.placeholder.com/300x450?text=No+Image";
        }}
      />
      )}

      <h3>{movie.title}</h3>
      <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <button onClick={() => onDislike(movie)}>👎 Dislike</button>
        <button onClick={() => onLike(movie)}>❤️ Like</button>
        <button onClick={() => onClear()}> (DEV TOOL) Clear Storage</button>
      </div>
    </div>
  );
};

export default SwipeCard;
import React from 'react';

const SwipeCard = ({ movie, onLike, onDislike }) => {
  if (!movie) return <div>Loading...</div>;

  // Automatically prep full URL or fallback
  const posterURL = movie.poster_path.startsWith("http")
    ? movie.poster_path
    : `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  return (
    <div className="swipe-card">
      <img
        src={posterURL}
        alt={movie.title}
        style={{ width: '300px', borderRadius: '12px' }}
        onError={(e) => {
          console.error("Failed to load image:", posterURL);
          e.target.src = "https://via.placeholder.com/300x450?text=No+Image";
        }}
      />
      <h3>{movie.title}</h3>
      <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <button onClick={() => onDislike(movie)}>👎 Dislike</button>
        <button onClick={() => onLike(movie)}>❤️ Like</button>
      </div>
    </div>
  );
};

export default SwipeCard;
// components/SwipeCard.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './SwipeCard.css';

const SwipeCard = ({ movie, onLike, onDislike, onClear }) => {
  const [showDescription, setShowDescription] = useState(false);

  if (!movie) return null;

  const handleDragEnd = (event, info) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset > 100 || velocity > 500) {
      onLike(movie);
    } else if (offset < -100 || velocity < -500) {
      onDislike(movie);
    }
  };

  const variants = {
    enter: { opacity: 0, scale: 0.8 },
    center: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.5, rotate: -10 }
  };

  return (
    <div className="swipe-container">
      <AnimatePresence>
        <motion.div
          key={movie.id}
          className="swipe-card"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3 }}
          onClick={() => setShowDescription(!showDescription)}
        >
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="poster-img"
            style={{ filter: showDescription ? 'blur(3px)' : 'none' }}
          />
          {showDescription && (
            <div className="description-overlay">
              <h3>{movie.title}</h3>
              <p>{movie.overview}</p>
              <em>(Click poster to hide)</em>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="button-group">
        <button onClick={() => onDislike(movie)}>👎 Dislike</button>
        <button onClick={() => onLike(movie)}>❤️ Like</button>
        <button onClick={onClear}>🧹 Clear (Dev)</button>
      </div>
    </div>
  );
};

export default SwipeCard;

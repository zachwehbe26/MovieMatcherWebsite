import React, { useState, useEffect } from 'react';
import SwipeCard from './components/SwipeCard';

const sampleMovies = [
  {
    id: 1,
    title: "Inception",
    poster_path: "https://m.media-amazon.com/images/I/81p+xe8cbnL._AC_SY679_.jpg", // Working poster
  },
  {
    id: 2,
    title: "The Dark Knight",
    poster_path: "https://image.tmdb.org/t/p/w500/1hRoyzDtpgMU7Dz4JF22RANzQO7.jpg", // TMDB URL
  },

];

function App() {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setMovies(sampleMovies);
    console.log("Loaded movies:", sampleMovies);
  }, []);

  const handleLike = (movie) => {
    console.log("Liked:", movie.title);
    saveLikedMovie(movie);
    nextMovie();

  };

  const handleDislike = (movie) => {
    console.log("Disliked:", movie.title);
    saveDislikedMovie(movie)
    nextMovie();
  };

  const handleClear = () => {
    localStorage.clear();
    console.log("Cleared movie storage");
  };

  const nextMovie = () => {
    if (currentIndex < movies.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      alert("No more movies!");
    }
  };

  //Add liked movies to a liked web-cache for now
  const saveLikedMovie = (movie) => {
    let liked = JSON.parse(localStorage.getItem('likedMovies')) || [];

    //only store movie id and title
    const simplifiedMovie = {
      id: movie.id,
      title: movie.title
    };

    liked.push(simplifiedMovie);
    localStorage.setItem('likedMovies', JSON.stringify(liked));
  };

  //Add disliked movies to a disliked web-cache for now
  const saveDislikedMovie = (movie) => {
    let disliked = JSON.parse(localStorage.getItem('dislikedMovies')) || [];

    const simplifiedMovie = {
      id: movie.id,
      title: movie.title
    };

    disliked.push(simplifiedMovie);
    localStorage.setItem('dislikedMovies', JSON.stringify(disliked));
  };


  return (
    <div className="App" style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>🎬 Movie Matcher</h1>
      <SwipeCard
        movie={movies[currentIndex]}
        onLike={handleLike}
        onDislike={handleDislike}
        onClear={handleClear}
      />
    </div>
  );
}

export default App;
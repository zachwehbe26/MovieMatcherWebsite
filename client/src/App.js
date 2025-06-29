import React, { useState, useEffect } from 'react';
import SwipeCard from './components/SwipeCard';
import MovieDetails from './components/MovieDetails';

function App() {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [page, setPage] = useState(1);
  const [disableSelection, setDisableSelection] = useState(false);

  const fetchMovies = async () => {
    const apiKey = process.env.REACT_APP_TMDB_API_KEY;
    const page = Math.floor(Math.random() * 500) + 1;
    try {
      const res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=${page}`);
      const data = await res.json();
      const filteredMovies = data.results.filter(movie => movie.poster_path);
      const limited = filteredMovies.slice(0, 5);
      console.log("Fetched movies:", filteredMovies);
      setMovies(prev => [...prev, ...limited]);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleLike = (movie) => {
    console.log("Liked:", movie.title);
    saveLikedMovie(movie);
    nextMovie();
  };

  const handleDislike = (movie) => {
    console.log("Disliked:", movie.title);
    saveDislikedMovie(movie);
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
      fetchMovies().then(() => {
        setCurrentIndex(currentIndex + 1);
      }).catch(() => {
        alert("No more movies!");
        setDisableSelection(true);
      });
    }
  };

  const saveLikedMovie = (movie) => {
    if (disableSelection) return;
    let liked = JSON.parse(localStorage.getItem('likedMovies')) || [];
    if (liked.includes(movie)) return;
    liked.push(movie);
    localStorage.setItem('likedMovies', JSON.stringify(liked));
  };

  const saveDislikedMovie = (movie) => {
    if (disableSelection) return;
    let disliked = JSON.parse(localStorage.getItem('dislikedMovies')) || [];
    if (disliked.includes(movie)) return;
    disliked.push(movie);
    localStorage.setItem('dislikedMovies', JSON.stringify(disliked));
  };

  return (
    <div className="App" style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>🎬 Movie Matcher</h1>
      {movies[currentIndex] && (
        <>
          <SwipeCard
            movie={movies[currentIndex]}
            onLike={handleLike}
            onDislike={handleDislike}
            onClear={handleClear}
          />
          <MovieDetails movie={movies[currentIndex]} />
        </>
      )}
    </div>
  );
}

export default App;

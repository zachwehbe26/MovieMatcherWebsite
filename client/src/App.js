import React, { useState, useEffect } from 'react';
import SwipeCard from './components/SwipeCard';
import MovieDetails from './components/MovieDetails';
import Login from './components/Login';

function App() {

  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [page, setPage] = useState(1);
  const [disableSelection, setDisableSelection] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [likedMovies, setLikedMovies] = useState([]);
  const [dislikedMovies, setDislikedMovies] = useState([]);



  const fetchMovies = async () => {
    const apiKey = process.env.REACT_APP_TMDB_API_KEY;
    const page = Math.floor(Math.random() * 500) + 1;
    try {
      const res = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=${page}&include_adult=false`);
      const data = await res.json();

      // Filter out movies with no poster and explicit adult content
      const filteredMovies = data.results.filter(
        movie => movie.poster_path && movie.adult !== true && movie.original_language === "en"
      );

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

  // Fetch liked/disliked movies from server after login
  useEffect(() => {
    if (isLoggedIn) {
      fetch('http://localhost:5000/movies', {
        credentials: 'include',
      })
        .then(res => res.json())
        .then(data => {
          setLikedMovies(data.likedMovies || []);
          setDislikedMovies(data.dislikedMovies || []);
        })
        .catch(() => {
          setLikedMovies([]);
          setDislikedMovies([]);
        });
    }
  }, [isLoggedIn]);


  //display login if not logged in
  if (!isLoggedIn) {
    return <Login setIsLoggedIn={setIsLoggedIn} />;
  }

  const handleLike = async (movie) => {
    if (disableSelection) return;
    if (likedMovies.find(m => m.id === movie.id)) return;
    if (likedMovies.length < 15) {
      //no longer store movies in local storage
      //movies stored in users object on server
      try {
        //send movie to server
        const res = await fetch('http://localhost:5000/movies/like', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ movie })
        });
        const data = await res.json();
        setLikedMovies(data.likedMovies);
        if (data.likedMovies.length === 15) {
          genRecommendations(data.likedMovies, dislikedMovies);
        }
      } catch (error) {
        console.error('Error liking movie:', error);
      }
    }
    nextMovie();
  };

  const handleDislike = async (movie) => {
    if (disableSelection) return;
    if (dislikedMovies.find(m => m.id === movie.id)) return;
    //store disliked movies in users object on server
    try {
      //send movie to server
      const res = await fetch('http://localhost:5000/movies/dislike', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ movie })
      });
      const data = await res.json();
      setDislikedMovies(data.dislikedMovies);
    } catch (error) {
      console.error('Error disliking movie:', error);
    }
    nextMovie();
  };

  const handleClear = async () => {
    try {
      await fetch('http://localhost:5000/movies/clear', {
        method: 'POST',
        credentials: 'include',
      });
      setLikedMovies([]);
      setDislikedMovies([]);
      setRecommendedMovies([]);
      setShowModal(false);
      console.log('Cleared movie storage');
    } catch (error) {
      console.error('Error clearing movies:', error);
    }
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

  const genRecommendations = async (liked, disliked) => {
    const genreCount = {};
    liked.forEach(movie => {
      movie.genre_ids.forEach(id => {
        genreCount[id] = (genreCount[id] || 0) + 1 //updates count positively for each genre ID
      });
    });

    disliked.forEach(movie => {
       movie.genre_ids.forEach(id => {
         genreCount[id] = (genreCount[id] || 0) - 1 //updates count negatively for each genre ID
       });
    });

    // Sorts genre ID and the amount of times it appears and puts it into an array in descending order
    const sortedGenres = Object.entries(genreCount).sort((a, b) => b[1] - a[1]).map(entry => entry[0]);
    const topGenres = sortedGenres.slice(0, 2).join(',') // takes top 2 genres for recommendation
    try {
      const apiKey = process.env.REACT_APP_TMDB_API_KEY;
      const res = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${topGenres}&sort_by=popularity.desc&include_adult=false`);
      console.log("Top Genres:", topGenres);
      console.log("Fetch URL:", `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${topGenres}&sort_by=popularity.desc&include_adult=false`);
      const data = await res.json();
      console.log("Fetched Recommendation Data:", data);
      const filtered = data.results.filter(m => m.poster_path && !m.adult && m.original_language === "en"
      );
      const recommended = filtered.slice(0, 5);
      setRecommendedMovies(recommended);
      alert("Your movie recommendations are ready. Click the recommendations button to view!");
      console.log("Recommended Movies:", recommended);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  const viewRecommendations = () => {
    // Use recommendedMovies from state
    if (recommendedMovies.length === 0) {
      alert('No recommendations available yet! Please like at least 15 movies');
      return;
    }
    setRecommendedMovies(recommendedMovies.slice(0, 2));
    setShowModal(true);
  };

  return (
      <div className="App" style={{textAlign: 'center', marginTop: '50px'}}>
        <h1>🎬 Movie Matcher</h1>
        <button onClick={viewRecommendations} style={{marginBottom: '20px'}}>
          View Recommendations
        </button>
        <p>You have liked {likedMovies.length} / 15 movies</p>
        {movies[currentIndex] && (
            <>
              <SwipeCard
                  movie={movies[currentIndex]}
                  onLike={handleLike}
                  onDislike={handleDislike}
                  onClear={handleClear}
              />
              <MovieDetails movie={movies[currentIndex]}/>
              
            </>
        )}
        {showModal && (
            <div style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0px 4px 15px rgba(0,0,0,0.3)',
              zIndex: 999
            }}>
              <h2> Recommended Movies</h2>
              { recommendedMovies.map(movie => (
                  <div key={movie.id} style={{ marginBottom: '15px' }}>
                    <h3>{movie.title}</h3>
                    <img
                      src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                      alt={movie.title}
                     />
                  </div>
                ))}
              <button onClick={() => setShowModal(false)}>Close</button>
            </div>
        )}
      </div>
  );
};
export default App;

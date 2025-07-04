import React, { useState, useEffect } from 'react';
import SwipeCard from './components/SwipeCard';
import MovieDetails from './components/MovieDetails';

function App() {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [page, setPage] = useState(1);
  const [disableSelection, setDisableSelection] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [recommendedMovies, setRecommendedMovies] = useState([]);

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

  const genRecommendations = async (likedMovies, dislikedMovies) => {
    const genreCount = {};
    likedMovies.forEach(movie => {
      movie.genre_ids.forEach(id => {
        genreCount[id] = (genreCount[id] || 0) + 1 // updates count positively for each genre ID
      });
    });

    dislikedMovies.forEach(movie => {
       movie.genre_ids.forEach(id => {
         genreCount[id] = (genreCount[id] || 0) - 1 // updates count negatively for each genre ID
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
      localStorage.setItem('recommendedMovies', JSON.stringify(recommended));
      alert("Your movie recommendations are ready. Click the recommendations button to view!");
      console.log("Recommended Movies:", recommended);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  const viewRecommendations = () => {
    const recommended = JSON.parse(localStorage.getItem('recommendedMovies')) || [];
    const liked = JSON.parse(localStorage.getItem('likedMovies')) || [];
    console.log("LIKED MOVIES:", liked.length, liked);
    console.log("RECOMMENDED MOVIES:", recommended.length, recommended);
    if (recommended.length === 0) {
      alert("No recommendations available yet! Please like at least 15 movies");
      return;
    }
    setRecommendedMovies(recommended.slice(0, 2)); // shows 2
    setShowModal(true); //shows popup
  };


  const saveLikedMovie = (movie) => {
    if (disableSelection) return;
    let liked = JSON.parse(localStorage.getItem('likedMovies')) || [];
    if (liked.find(m => m.id === movie.id)) return;
    if (liked.length < 15) {
      liked.push(movie); // push movies until likes hit five
      localStorage.setItem('likedMovies', JSON.stringify(liked));
      if(liked.length === 15) {
        const disliked = JSON.parse(localStorage.getItem('dislikedMovies')) || [];    //accounts for disliked movies in genRecommendations
        genRecommendations(liked, disliked); // generate recommendations for the movies in the liked array
      }
    }
  };

  const saveDislikedMovie = (movie) => {
    if (disableSelection) return;
    let disliked = JSON.parse(localStorage.getItem('dislikedMovies')) || [];
    if (disliked.includes(movie)) return;
    disliked.push(movie);
    localStorage.setItem('dislikedMovies', JSON.stringify(disliked));
  };

  return (
      <div className="App" style={{textAlign: 'center', marginTop: '50px'}}>
        <h1>🎬 Movie Matcher</h1>
        <button onClick={viewRecommendations} style={{marginBottom: '20px'}}>
          View Recommendations
        </button>
        <p>You have liked {JSON.parse(localStorage.getItem("likedMovies"))?.length || 0} / 15 movies</p>
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
}

export default App;

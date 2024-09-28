import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Form, InputGroup } from 'react-bootstrap'; // Import required components from react-bootstrap
import MovieList from './components/MovieList';
import NavigationBar from './components/NavigationBar';
import ReviewsPage from './components/ReviewsPage';
import { useState, useEffect } from 'react';
import './App.css';
import api from './axios';
import Movie from './interfaces/movie';
import Review from './interfaces/review';

// const movies: Movie[] = [
//   { id: 1, title: "Star Wars A New Hope", releaseDate: new Date("2022-08-01"), rating: 9 },
//   { id: 2, title: "Inception", releaseDate: new Date("2010-07-16"), rating: 8.8 },
//   { id: 3, title: "The Dark Knight", releaseDate: new Date("2008-07-18"), rating: 9.0 },
//   { id: 4, title: "Star Wars A New Hope", releaseDate: new Date("2022-08-01"), rating: 9 },
//   { id: 5, title: "Inception", releaseDate: new Date("2010-07-16"), rating: 8.8 },
//   { id: 6, title: "The Dark Knight", releaseDate: new Date("2008-07-18"), rating: 9.0 }
// ];

const App: React.FC = () => {

  const [movies, setMovies] = useState<Movie[] | null>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [reviews, setReviews] = useState<Review[] | null>([]);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [avgRating, setAvgRating] = useState<number | null>(0);

  const [searchBar, setSearchBar] = useState("");
  const handleSearchBarChange = (value: string) => setSearchBar(value);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const moviesResponse = await api.get(`/movies/?keyword=${searchBar}`);
        setMovies(moviesResponse.data);
      } catch (error) {
        alert('Error fetching movies:' + error);
      }
    };

    fetchMovies();
  }, [searchBar, selectedMovie ]);

  return (
    <div className="App">
      <NavigationBar avgRating={avgRating} setAvgRating={setAvgRating} selectedMovie={selectedMovie} movies={movies} setMovies={setMovies} selectedReview={selectedReview} reviews={reviews} setReviews={setReviews} setSelectedReview={setSelectedReview}/>

      {
        selectedMovie ?
          <Container className='mt-3'>
            <ReviewsPage avgRating={avgRating} setAvgRating={setAvgRating} movie={selectedMovie} setSelectedMovie={setSelectedMovie} movies={movies} setReviews={setReviews} selectedReview={selectedReview} reviews={reviews} setSelectedReview={setSelectedReview}/>
          </Container>
        :
          <Container className="mt-3">
          <h3>The best movie reviews site!</h3>

          <div className="my-4">
            <InputGroup>
              <Form.Control 
                type="email" 
                id="exampleInputEmail1" 
                aria-describedby="emailHelp" 
                placeholder="Search your favourite movie here..."
                className="border-primary"
                defaultValue={searchBar}
                onChange={(e) => { handleSearchBarChange(e.target.value); }}
              />
            </InputGroup>
          </div>

          <MovieList movies={movies} setSelectedMovie={setSelectedMovie} setMovies={setMovies}/>
        </Container> 
      }

    </div>
  );
};

export default App;

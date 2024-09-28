import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Navbar, Container } from 'react-bootstrap'; // Import Navbar and Container from react-bootstrap
import MovieModal from './MovieModal';
import ReviewModal from './ReviewModal';
import Movie from '../interfaces/movie';
import Review from '../interfaces/review';

interface NavBarProps {
  selectedMovie: Movie | null;
	movies: Movie[] | null;
  setMovies: React.Dispatch<React.SetStateAction<Movie[] | null>>;
  selectedReview: Review | null;
  reviews: Review[] | null;
  setReviews: React.Dispatch<React.SetStateAction<Review[] | null>>;
  setSelectedReview: React.Dispatch<React.SetStateAction<Review | null>>;
  avgRating: Number | null;
  setAvgRating: React.Dispatch<React.SetStateAction<number | null>>;
}

const NavigationBar: React.FC<NavBarProps> = ({ selectedMovie, movies, setMovies, reviews, selectedReview, setReviews, setSelectedReview, avgRating, setAvgRating }) => {

  const [showMovieModal, setShowMovieModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const handleMovieModalClose = () => setShowMovieModal(false);
  const handleMovieModalShow = () => setShowMovieModal(true);

  const handleReviewModalClose = () => setShowReviewModal(false);
  const handleReviewModalShow = () => setShowReviewModal(true);

  return (
    <>
      <Navbar expand="lg" style={{ backgroundColor: "#e3e7ed" }}>
        <Container fluid>
          <Navbar.Brand href="#" className="mb-0 h1">MOVIECRITIC</Navbar.Brand>
          <div>
            {
				selectedMovie ? null
				:
				<Button variant="outline-primary" onClick={handleMovieModalShow}>
              		Add New Movie
            	</Button>
			}
            <Button variant="primary" onClick={handleReviewModalShow} className="ms-2">
              Add New Review
            </Button>
          </div>
        </Container>
      </Navbar>

      <MovieModal show={showMovieModal} handleClose={handleMovieModalClose} movies={movies} setMovies={setMovies} />
      <ReviewModal show={showReviewModal} handleClose={handleReviewModalClose} movies={movies} selectedMovie={selectedMovie} reviews={reviews} setReviews={setReviews} setSelectedReview={setSelectedReview} selectedReview={selectedReview} setAvgRating={setAvgRating} avgRating={avgRating} />
    </>
  );
};

export default NavigationBar;

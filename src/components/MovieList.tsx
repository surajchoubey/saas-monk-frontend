import React, { useState } from 'react';
import MovieCard from './MovieCard';
import { Row, Col } from 'react-bootstrap';
import MovieModal from './MovieModal';
import Movie from '../interfaces/movie';

interface MovieListProps {
  movies: Movie[] | null;
  setSelectedMovie: React.Dispatch<React.SetStateAction<Movie | null>>;
  setMovies: React.Dispatch<React.SetStateAction<Movie[] | null>>;
}

const MovieList: React.FC<MovieListProps> = ({ movies, setSelectedMovie, setMovies }) => {

    const [showMovieModal, setShowMovieModal] = useState(false);
    const [movieEdit, setMovieEdit] = useState<Movie | null>(null);

    const handleMovieModalClose = () => {
        setMovieEdit(null);
        setShowMovieModal(false);
    }
    const handleMovieModalShow = (movie: Movie) => {
        setMovieEdit(movie);
        setShowMovieModal(true);
    }

    return (
        <Row className="justify-content-center">
        {movies && movies.map((movie) => (
            <Col xs={12} sm={6} md={4} lg={3} key={movie._id} className="mb-4">
                <MovieCard movie={movie} handleMovieModalShow={() => { handleMovieModalShow(movie); }} setSelectedMovie={setSelectedMovie} movies={movies} setMovies={setMovies} />
            </Col>
        ))}
        { movieEdit && <MovieModal movies={movies} show={showMovieModal} isEditing={true} movieName={movieEdit.title} releaseDate={movieEdit.releaseDate} movieId={movieEdit._id} handleClose={handleMovieModalClose} setMovies={setMovies}/> }
        </Row>
    );
};

export default MovieList;

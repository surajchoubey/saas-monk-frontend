import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Card, Button } from 'react-bootstrap';
import Movie from '../interfaces/movie';
import { formatDate } from '../utils';
import api from '../axios';

interface CardProps {
  movie: Movie;
  movies: Movie[];
  handleMovieModalShow: () => void;
  setSelectedMovie: React.Dispatch<React.SetStateAction<Movie | null>>;
  setMovies: React.Dispatch<React.SetStateAction<Movie[] | null>>;
}

const MovieCard: React.FC<CardProps> = ({ movie, setSelectedMovie, handleMovieModalShow, setMovies, movies }) => {

    const handleDelete = async (movieId: string) => {
        try {
            if (movieId.length === 0) throw new Error("wrong");
            const response = await api.delete(`movies/${movieId}`);
            if (response.status === 200) {
                let tempMovies = movies.filter(movie => movie._id !== movieId);
                setMovies(tempMovies);
            }
        } catch (e) {
            alert("Error" + e);
        }
    }

    return (
        <Card style={{ backgroundColor: '#e0defd', margin: '10px' }}>
            <Card.Body>
                <Card.Title style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} onClick={() => { setSelectedMovie(movie); }}>
                    {movie.title}
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Release: {formatDate(movie.releaseDate)}</Card.Subtitle>
                <Card.Text><b> Rating: {`${movie.avgRating ? Number(movie.avgRating.toFixed(1)) : 0 }`} </b></Card.Text>
                <div className="d-flex justify-content-end">
                <Button variant="light" size="sm" className="me-2" onClick={handleMovieModalShow} >
                    <FaEdit />
                </Button>
                <Button variant="light" size="sm">
                    <FaTrash onClick={() => handleDelete(movie._id) }/>
                </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default MovieCard;

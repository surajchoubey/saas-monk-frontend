import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useEffect } from 'react';
import api from '../axios';
import Movie from '../interfaces/movie';

interface MovieModalProps {
  show: boolean;
  handleClose: () => void;
  isEditing?: boolean;
  movieName?: string;
  releaseDate?: string;
  movieId?: string;
  movies: Movie[] | null;
  setMovies: React.Dispatch<React.SetStateAction<Movie[] | null>>;
}

const MovieModal: React.FC<MovieModalProps> = ({
  show,
  handleClose,
  isEditing = false,
  movieName = "",
  releaseDate = "",
  movieId = "",
  movies,
  setMovies
}) => {

  const [formMovieId, setFormMovieId] = useState("");
  const [movieTitle, setMovieTitle] = useState("");
  const [movieReleaseDate, setMovieReleaseDate] = useState("");

  const handleSubmit = async () => {
    // console.log(movieTitle, movieReleaseDate);
    try {
      if (isEditing && formMovieId && formMovieId.length > 0 && movies && movies.length > 0) {
        const response = await api.put(`/movies/${formMovieId}`, { title: movieTitle, releaseDate: movieReleaseDate });
        let tempMovies = [];
        for (const movie of movies) {
          if (movie._id !== formMovieId) {
            tempMovies.push(movie);
          } else {
            tempMovies.push({
              _id: response.data._id,
              title: response.data.title,
              releaseDate: response.data.releaseDate,
              avgRating: movie.avgRating
            });
          }
        }
        setMovies(tempMovies);
      } else if (!isEditing && movies) {
        const response = await api.post('/movies', { title: movieTitle, releaseDate: movieReleaseDate });
        let tempMovies = [...movies, response.data]
        setMovies(tempMovies);
      } else {
        alert("PUT/POST did not happen");
        throw new Error("PUT/POST did not happen");
      }
      // setFormMovieId("");
      setMovieTitle("");
      setMovieReleaseDate("");
      handleClose();
    } catch (e) {
      alert("Error occurred " + e);
    }
  }

  useEffect(() => {
    console.log(movieName, releaseDate);
    setFormMovieId(movieId);
    setMovieTitle(movieName);
    if (releaseDate.length > 0) {
      setMovieReleaseDate(releaseDate.split('T')[0]);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? "Edit Movie" : "Create New Movie"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formMovieName">
            <Form.Control
              type="text" 
              placeholder="Enter movie name"
              onChange={(e) => { setMovieTitle(e.target.value) }}
              value={movieTitle}
            />
          </Form.Group>
          <Form.Group className="mt-1" controlId="formReleaseDate">
            <Form.Label>Release Date</Form.Label>
            <Form.Control 
              type="date"
              onChange={(e) => { setMovieReleaseDate(e.target.value) }}
              value={movieReleaseDate}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={() => { handleSubmit(); }}>
          {isEditing ? "Edit Movie" : "Create New Movie"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MovieModal;

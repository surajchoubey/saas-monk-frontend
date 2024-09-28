import { Modal, Button, Form } from 'react-bootstrap';
import Movie from '../interfaces/movie';
import Review from '../interfaces/review';
import React, { useState, useEffect } from 'react';
import api from '../axios';

interface ReviewModalProps {
  isEditing?: boolean;
  show: boolean;
  handleClose: () => void;
  movies: Movie[] | null;
  selectedMovie: Movie | null;
  selectedReview: Review | null;
  reviews: Review[] | null;
  setReviews: React.Dispatch<React.SetStateAction<Review[] | null>>;
  setSelectedReview: React.Dispatch<React.SetStateAction<Review | null>>;
  setAvgRating: React.Dispatch<React.SetStateAction<number | null>>;
  avgRating: Number | null;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ 
  isEditing = false, 
  show, 
  handleClose, 
  movies, 
  selectedMovie = null, 
  selectedReview = null,
  reviews,
  setReviews,
  setAvgRating
}) => {

  // Hooks must be called outside of any condition
  const [formMovieId, setFormMovieId] = useState(selectedReview?._id ?? "");
  const [formName, setFormName] = useState("");
  const [formRating, setFormRating] = useState(10);
  const [formComments, setFormComments] = useState("");

  // Effect to set the form state when editing
  useEffect(() => {
    if (isEditing && selectedReview) {
      setFormMovieId(selectedReview._id);
      setFormName(selectedReview.reviewerName);
      setFormRating(selectedReview.rating);
      setFormComments(selectedReview.reviewComments);
    }
  }, [isEditing, selectedReview]);

  // Early returns should come after the hooks to avoid conditional hook calls
  if (isEditing && selectedMovie == null) return null;
  if (isEditing && selectedReview == null) return null;

  const handleSubmit = async () => {
    const formData = {
      movieId: formMovieId,
      reviewerName: formName,
      rating: formRating,
      reviewComments: formComments
    }
    try {
      if (isEditing && selectedReview && selectedReview._id.length > 0) {
        const reviewId = selectedReview._id;
        const response = await api.put(`/reviews/${reviewId}`, formData);
        if (reviews && reviews.length >= 0) {
          let tempReviews = [];
          let sum = 0;
          for (const review of reviews) {
            if (review._id !== reviewId) {
              tempReviews.push(review);
              sum += review.rating;
            } else if (selectedMovie && response.data.movieId === selectedMovie._id) {
              tempReviews.push(response.data);
              sum += response.data.rating;
            }
          }
          if (tempReviews.length > 0) {
            let divide = sum / tempReviews.length;
            setAvgRating(Number(divide.toFixed(1)));
          }
          setReviews(tempReviews);
        }
      } else if (!isEditing && reviews) {
        const response = await api.post(`/reviews/`, formData);
        let tempReviews = [...reviews, response.data];
        let sum = 0;
        for (const tempreview of tempReviews) {
          sum += tempreview.rating
        }
        if (sum > 0) setAvgRating(Number((sum / tempReviews.length).toFixed(1)));
        setReviews(tempReviews);
      } else {
        alert("PUT/POST did not happen");
        throw new Error("PUT/POST did not happen");
      }
      handleClose();
      setFormMovieId("");
      setFormName("");
      setFormRating(10);
      setFormComments("");
    } catch (e) {
      alert("Error occurred " + e);
    }
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{ isEditing ? "Edit Review" : "Add New Review" }</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formSelectMovie">
            <Form.Label>Select Movie</Form.Label>
              <Form.Control as="select" value={formMovieId} onChange={(e) => { setFormMovieId(e.target.value) }}>  
                  { movies && movies.length ? movies.map(movie => <option key={movie._id} value={movie._id}>{movie.title}</option> ) : null }
              </Form.Control>
          </Form.Group>
          <Form.Group controlId="formYourName">
            <Form.Label>Your Name</Form.Label>
            <Form.Control type="text" placeholder="Your name" value={formName} onChange={(e) => { setFormName(e.target.value) }}/>
          </Form.Group>
          <Form.Group controlId="formRating">
            <Form.Label>Rating: {formRating}</Form.Label>
            <Form.Range 
              min={1} 
              max={10} 
              value={formRating} 
              onChange={(e) => setFormRating(Number(e.target.value))} 
            />
          </Form.Group>
          <Form.Group controlId="formReviewComments">
            <Form.Label>Comments</Form.Label>
            <Form.Control as="textarea" rows={3} placeholder="Enter your review comments" value={formComments} onChange={(e) => { setFormComments(e.target.value) }}/>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          { isEditing ? "Edit Review" : "Add New Review" }
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReviewModal;

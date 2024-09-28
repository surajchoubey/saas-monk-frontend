// ReviewsPage.tsx

import React from 'react';
import { Container, Card, Button, Row, Col, InputGroup, Form } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { IoArrowBackCircleSharp } from "react-icons/io5";
import ReviewModal from './ReviewModal';
import { useState, useEffect } from 'react';
import Movie from '../interfaces/movie';
import api from '../axios';
import Review from '../interfaces/review';

interface ReviewsPageProps {
  movie: Movie;
  movies: Movie[] | null;
  setSelectedMovie: React.Dispatch<React.SetStateAction<Movie | null>>;
  selectedReview: Review | null;
  setSelectedReview: React.Dispatch<React.SetStateAction<Review | null>>;
  setReviews: React.Dispatch<React.SetStateAction<Review[] | null>>;
  reviews: Review[] | null;
  avgRating: Number | null;
  setAvgRating: React.Dispatch<React.SetStateAction<number | null>>;
}

// const reviews: Review[] = [
//     { id: 1, reviewerName: "Suraj Choubey", rating: 8, reviewComments: "Good movie!" },
//     { id: 2, reviewerName: "Suraj Choubey", rating: 9, reviewComments: "Good movie!" },
//     { id: 3, reviewerName: "Suraj Choubey", rating: 10, reviewComments: "Good movie!" },
//     { id: 4, reviewerName: "Suraj Choubey", rating: 8, reviewComments: "Good movie!" },
//     { id: 5, reviewerName: "Suraj Choubey", rating: 9, reviewComments: "Good movie!" },
//     { id: 6, reviewerName: "Suraj Choubey", rating: 10, reviewComments: "Good movie!" },
//     { id: 7, reviewerName: "Suraj Choubey", rating: 8, reviewComments: "Good movie!" },
//     { id: 8, reviewerName: "Suraj Choubey", rating: 9, reviewComments: "Good movie!" }
// ]

const ReviewsPage: React.FC<ReviewsPageProps> = ({ movie, setSelectedMovie, movies, reviews, setReviews, setSelectedReview, selectedReview, avgRating, setAvgRating }) => {
  // Calculate the average rating
  const [reviewSearchBar, setReviewsSearchBar] = useState("");
  const handleReviewsSearchBarChange = (value: string) => setReviewsSearchBar(value);

  const handleShowReviews = () => setSelectedMovie(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleReviewModalClose = () => {
    setSelectedReview(null);
    setShowModal(false);
  }

  const handleReviewModalShow = (review: Review) => {
    setSelectedReview(review);
    setShowModal(true);
  }

  const handleDelete = async (reviewId: string) => {
    try {
      await api.delete(`/reviews/${reviewId}`);
      if (reviews && reviews.length >= 0) {
        let tempReviews = reviews.filter(review => review._id !== reviewId);
        let sum = 0;
        for (const tempreview of tempReviews) {
          sum += tempreview.rating
        }
        if (sum > 0) setAvgRating(Number((sum / tempReviews.length).toFixed(1)));
        setReviews(tempReviews);
      }
    } catch (e) {
      alert("Error: " + e)
    }
    handleReviewModalClose();
  }

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsResponse = await api.get(`/reviews/${movie._id}/?keyword=${reviewSearchBar}`);
        setAvgRating(reviewsResponse.data.avgRating);
        setReviews(reviewsResponse.data.reviews);
      } catch (error) {
        alert('Error fetching reviews:' + error);
      }
    };

    fetchReviews();
  }, [reviewSearchBar, movie, showModal]);

  return (
    <Container className='mt-3'>
      <Row className='my-4 h1'>
        <Col xs={6} className="d-flex align-items-center">
          <IoArrowBackCircleSharp onClick={handleShowReviews} className='goBackButton' /> &nbsp; {movie.title}
        </Col>
        <Col xs={6} className="text-end text-primary">
          {(reviews && reviews.length > 0 && avgRating && Number(avgRating) >= 0) ? Number(avgRating.toFixed(1)) : 0} / 10
        </Col>
      </Row>
      <div className="my-4">
            <InputGroup>
              <Form.Control 
                type="email" 
                id="exampleInputEmail1" 
                aria-describedby="emailHelp" 
                placeholder="Search your favourite movie here..."
                className="border-primary"
                defaultValue={reviewSearchBar}
                onChange={(e) => { handleReviewsSearchBarChange(e.target.value); }}
              />
            </InputGroup>
          </div>
      {reviews && reviews.length > 0 && reviews.map((review) => (
        <Card key={review._id} className="mb-3" style={{ backgroundColor: 'white', border: '1px solid grey', borderWidth: '5px' }}>
          <Card.Body>
            <Row className="d-flex justify-content-between align-items-center h4">
              <Col xs={6} className="d-flex justify-content-between">
                {review?.reviewComments}
              </Col>
              <Col xs={6} className='text-end'>
                <span className="text-primary">{review.rating} / 10</span>
              </Col>
            </Row>
            <Row className="d-flex justify-content-between align-items-center mt-2">
              <Col xs={6}>
                <span className="text-muted">By {review.reviewerName}</span>
              </Col>
              <Col xs={6} className="text-end">
                <Button variant="outline-primary" size="sm" className="ms-2" onClick={() => { handleReviewModalShow(review); }}>
                  <FaEdit />
                </Button>
                <Button variant="outline-danger" size="sm" className="ms-1" onClick={() => { handleDelete(review._id); }}>
                  <FaTrash />
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}
      <ReviewModal avgRating={avgRating} setAvgRating={setAvgRating} show={showModal} handleClose={handleReviewModalClose} selectedMovie={movie} movies={movies} setSelectedReview={setSelectedReview} selectedReview={selectedReview} isEditing={true} reviews={reviews} setReviews={setReviews}/>
    </Container>
  );
};

export default ReviewsPage;

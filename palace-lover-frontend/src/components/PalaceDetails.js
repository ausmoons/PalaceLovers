import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col, Card, Image, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Rating from 'react-rating-stars-component';
import MapComponent from './MapComponent';

const PalaceDetail = () => {
  const { id } = useParams();
  const [palace, setPalace] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [ratings, setRatings] = useState([]);
  const [userRating, setUserRating] = useState(null);
  const [error, setError] = useState('');
  const { t } = useTranslation();
  const { user } = useAuth();

  useEffect(() => {
    const fetchPalace = async () => {
      try {
        const response = await fetch(`https://localhost:7251/api/palaces/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPalace(data);
      } catch (error) {
        console.error('Error fetching palace details:', error);
      }
    };

    const fetchRatings = async () => {
      try {
        const response = await fetch(`https://localhost:7251/api/ratings/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setRatings(data);

        if (user) {
          const existingRating = data.find(rating => rating.userId === user.id);
          setUserRating(existingRating);
        }
      } catch (error) {
        console.error('Error fetching ratings:', error);
      }
    };

    fetchPalace();
    fetchRatings();
  }, [id, user]);

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError(t('pleaseAddStars'));
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`https://localhost:7251/api/ratings/${id}`, {
        score: rating,
        comment: comment,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setRatings([...ratings, response.data]);
      setUserRating(response.data);
      setRating(0);
      setComment('');
      setError('');
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  if (!palace) {
    return <div>{t('loading')}</div>;
  }

  const { latitude = 0, longitude = 0, name, location, history, yearBuilt, visitingHours, galleries } = palace;

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h2 className="extra-large-text mb-4">{name}</h2>
          <p className="large-text"><strong>{t('location')}:</strong> {location}</p>
          <p className="large-text"><strong>{t('history')}:</strong> {history}</p>
          <p className="large-text"><strong>{t('yearBuilt')}:</strong> {yearBuilt}</p>
          <p className="large-text"><strong>{t('visitingHours')}:</strong> {visitingHours}</p>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          {latitude && longitude ? (
            <MapComponent latitude={latitude} longitude={longitude} palaceName={name} />
          ) : (
            <p className="large-text">{t('location not available')}</p>
          )}
        </Col>
      </Row>
      <Row className="mt-4">
        {galleries.map((gallery) => (
          <Col md={4} className="mb-4" key={gallery.id}>
            <Card>
              <Image src={`https://localhost:7251${gallery.imageUrl}`} alt={name} fluid />
            </Card>
          </Col>
        ))}
      </Row>
      <Row className="mt-4">
        <Col>
          <h3 className="extra-large-text mb-4">{t('rating')}</h3>
          {ratings.map((rating) => (
            <Card className="mb-3 large-text" key={rating.ratingId}>
              <Card.Body>
                <Card.Title className="large-text">{rating.user ? rating.user.username : t('anonymous')}</Card.Title>
                <Card.Text>
                  <strong>{t('score')}:</strong>
                  <Rating
                    value={rating.score}
                    edit={false}
                    size={24}
                  />
                  <br />
                  <strong>{t('comment')}:</strong> {rating.comment}
                </Card.Text>
                <Card.Footer className="text-muted">
                  {new Date(rating.ratingDate).toLocaleDateString()}
                </Card.Footer>
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Row>
      {user && (
        <Row className="mt-4">
          <Col>
            {userRating ? (
              <Card className="mb-3 large-text">
                <Card.Body>
                  <Card.Title className="large-text">{t('yourRating')}</Card.Title>
                  <Card.Text>
                    <strong>{t('score')}:</strong>
                    <Rating
                      value={userRating.score}
                      edit={false}
                      size={24}
                    />
                    <br />
                    <strong>{t('comment')}:</strong> {userRating.comment}
                  </Card.Text>
                  <Card.Footer className="text-muted">
                    {new Date(userRating.ratingDate).toLocaleDateString()}
                  </Card.Footer>
                </Card.Body>
              </Card>
            ) : (
              <>
                <h3 className="extra-large-text mb-4">{t('addRating')}</h3>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleRatingSubmit}>
                  <Form.Group controlId="rating">
                    <Form.Label className="large-text">{t('rating')}</Form.Label>
                    <Rating
                      count={5}
                      size={24}
                      activeColor="#ffd700"
                      value={rating}
                      onChange={(newRating) => setRating(newRating)}
                    />
                  </Form.Group>
                  <Form.Group controlId="comment" className="mt-3">
                    <Form.Label className="large-text">{t('comment')}</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                      className="large-text"
                    />
                  </Form.Group>
                  <Button className="mt-3 large-text" type="submit">{t('submit')}</Button>
                </Form>
              </>
            )}
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default PalaceDetail;

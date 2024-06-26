import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col, Card, Image, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Rating from 'react-rating-stars-component';
import MapComponent from './MapComponent'; // Import the MapComponent

const PalaceDetail = () => {
  const { id } = useParams();
  const [palace, setPalace] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [ratings, setRatings] = useState([]);
  const [userRating, setUserRating] = useState(null); // State to store user's rating
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
        console.log('Palace details fetched:', data); // Debugging log
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
      setUserRating(response.data); // Set the user's rating
      setRating(0);
      setComment('');
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  if (!palace) {
    return <div>{t('loading')}</div>;
  }

  // Assuming you have latitude and longitude in your palace data
  const { latitude = 0, longitude = 0, name, location, history, yearBuilt, visitingHours, galleries } = palace;

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h2>{name}</h2>
          <p><strong>{t('location')}:</strong> {location}</p>
          <p><strong>{t('history')}:</strong> {history}</p>
          <p><strong>{t('yearBuilt')}:</strong> {yearBuilt}</p>
          <p><strong>{t('visitingHours')}:</strong> {visitingHours}</p>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          {latitude && longitude ? (
            <MapComponent latitude={latitude} longitude={longitude} palaceName={name} />
          ) : (
            <p>{t('location not available')}</p>
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
          <h3>{t('rating')}</h3>
          {ratings.map((rating) => (
            <Card className="mb-3" key={rating.ratingId}>
              <Card.Body>
                <Card.Title>{rating.user ? rating.user.username : t('anonymous')}</Card.Title>
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
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>{t('yourRating')}</Card.Title>
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
                <h3>{t('addRating')}</h3>
                <Form onSubmit={handleRatingSubmit}>
                  <Form.Group controlId="rating">
                    <Form.Label>{t('rating')}</Form.Label>
                    <Rating
                      count={5}
                      size={24}
                      activeColor="#ffd700"
                      value={rating}
                      onChange={(newRating) => setRating(newRating)}
                    />
                  </Form.Group>
                  <Form.Group controlId="comment" className="mt-3">
                    <Form.Label>{t('comment')}</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Button className="mt-3" type="submit">{t('submit')}</Button>
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

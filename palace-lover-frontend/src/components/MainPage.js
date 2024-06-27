import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, Button, Col, Container, Row, Form } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import Rating from 'react-rating-stars-component';
import { useTranslation } from 'react-i18next';

const MainPage = () => {
  const [palaces, setPalaces] = useState([]);
  const { user } = useAuth();
  const [sortOrder, setSortOrder] = useState('name');
  const { t } = useTranslation();
  const navigate = useNavigate();

  const fetchPalaces = async () => {
    try {
      const response = await axios.get(`https://localhost:7251/api/palaces?sortBy=${sortOrder}`);
      setPalaces(response.data);
    } catch (error) {
      console.error('Error fetching palaces:', error);
    }
  };


  useEffect(() => {
    fetchPalaces();
  }, []);

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  const handleFilterClick = () => {
    fetchPalaces();
  };
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://localhost:7251/api/palaces/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPalaces(palaces.filter(palace => palace.id !== id));
    } catch (error) {
      console.error('Error deleting palace:', error);
    }
  };

  const calculateAverageRating = (ratings) => {
    if (!ratings) {
      console.log('No ratings provided');
      return 0;
    }
    if (ratings.length === 0) return 0;
    const total = ratings.reduce((acc, rating) => acc + rating.score, 0);
    const average = total / ratings.length;
    return average;
  };

  const handleCardClick = (id) => {
    navigate(`/palace/${id}`);
  };

  return (
    <Container className="mt-4">
      <Row className="mb-4 align-items-center">
        <Col md={3} />
        <Col md={6} className="d-flex justify-content-center align-items-center">
          <h2 className="extra-large-text-2">{t('palaces')}</h2>
        </Col>
        <Col md={3} className="d-flex justify-content-end">
          <Form.Select value={sortOrder} onChange={handleSortChange} style={{ width: '200px', marginLeft: '10px' }} className="large-text-1">
            <option value="name">{t('sortByName')}</option>
            <option value="rating">{t('sortByRating')}</option>
            <option value="date">{t('sortByDate')}</option>
          </Form.Select>
          <Button variant="primary" onClick={handleFilterClick} style={{ marginLeft: '10px' }} className="large-text">{t('filter')}</Button>
        </Col>
      </Row>
      <Row>
        {palaces.map((palace) => (
          <Col md={{ span: 6, offset: 3 }} className="mb-4" key={palace.id}>
            <Card onClick={() => handleCardClick(palace.id)} style={{ cursor: 'pointer' }}>
              {palace.galleries.length > 0 && (
                <Card.Img variant="top" src={`https://localhost:7251${palace.galleries[0].imageUrl}`} />
              )}
              <Card.Body>
                <Card.Title>{palace.name}</Card.Title>
                <Card.Text>{palace.history.slice(0, 100)}...</Card.Text>
                <Card.Text><small className="text-muted">{t('yearBuilt')}: {palace.yearBuilt}</small></Card.Text>
                <div>
                  <Rating
                    value={calculateAverageRating(palace.ratings)}
                    edit={false}
                    size={24}
                    activeColor="#ffd700"
                  />
                </div>
                {(user && (user.id === palace.userId || (user.roles && user.roles.includes('Admin')))) && (
                  <div onClick={(e) => e.stopPropagation()}>
                    <Link to={`/edit-palace/${palace.id}`} className="btn btn-secondary mr-2">{t('edit')}</Link>
                    <Button className="m-1" onClick={() => handleDelete(palace.id)} variant="danger">{t('delete')}</Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default MainPage;

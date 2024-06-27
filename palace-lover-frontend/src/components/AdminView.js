import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const AdminView = () => {
  const [users, setUsers] = useState([]);
  const [palaces, setPalaces] = useState([]);
  const [comments, setComments] = useState([]);
  const { user } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://localhost:7251/api/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchPalaces = async () => {
      try {
        const response = await axios.get('https://localhost:7251/api/palaces');
        setPalaces(response.data);
      } catch (error) {
        console.error('Error fetching palaces:', error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axios.get('https://localhost:7251/api/ratings');
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    if (user && user.roles.includes('Admin')) {
      fetchUsers();
      fetchPalaces();
      fetchComments();
    }
  }, [user]);

  if (!user || !user.roles.includes('Admin')) {
    return <div>Unauthorized</div>;
  }

  return (
    <Container className="mt-4">
      <h2 className="extra-large-text mb-4">{t('adminview')}</h2>
      <Row>
        <Col>
          <h3 className="large-text mb-4">{t('users')}</h3>
          <ListGroup className="mb-4">
            {users.map((user) => (
              <ListGroup.Item key={user.id} className="mb-4 large-text">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <strong className="extra-large-text">{user.username}</strong>
                    <p className="large-text">{user.email}</p>
                  </div>
                </div>
                <h5 className="large-text mb-4">{t('palacesadded')}:</h5>
                <ul className="mb-4">
                  {palaces.filter(palace => palace.userId === user.id).map((palace) => (
                    <li key={palace.id} className="large-text mb-2">{palace.name}</li>
                  ))}
                </ul>
                <h5 className="large-text mb-4">{t('comments')}:</h5>
                <ul>
                  {comments.filter(comment => comment.userId === user.id).map((comment) => (
                    <li key={comment.ratingId} className="large-text mb-2">{comment.comment}</li>
                  ))}
                </ul>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminView;

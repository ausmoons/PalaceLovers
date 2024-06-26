import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const AdminView = () => {
  const [users, setUsers] = useState([]);
  const [palaces, setPalaces] = useState([]);
  const [comments, setComments] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token:', token); // Debugging message

        const response = await axios.get('https://localhost:7251/api/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Users fetched:', response.data); // Debugging message
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchPalaces = async () => {
      try {
        const response = await axios.get('https://localhost:7251/api/palaces');
        console.log('Palaces fetched:', response.data); // Debugging message
        setPalaces(response.data);
      } catch (error) {
        console.error('Error fetching palaces:', error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axios.get('https://localhost:7251/api/ratings');
        console.log('Comments fetched:', response.data); // Debugging message
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
      <h2>Admin View</h2>
      <Row>
        <Col>
          <h3>Users</h3>
          <ListGroup>
            {users.map((user) => (
              <ListGroup.Item key={user.id}>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{user.username}</strong>
                    <p>{user.email}</p>
                  </div>
                </div>
                <h5>Palaces Added:</h5>
                <ul>
                  {palaces.filter(palace => palace.userId === user.id).map((palace) => (
                    <li key={palace.id}>{palace.name}</li>
                  ))}
                </ul>
                <h5>Comments:</h5>
                <ul>
                  {comments.filter(comment => comment.userId === user.id).map((comment) => (
                    <li key={comment.ratingId}>{comment.comment}</li>
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

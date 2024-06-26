import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AddPalaceButton = () => {
  const navigate = useNavigate();

  const handleAddPalace = () => {
    navigate('/add-palace');
  };

  return (
    <Button variant="primary" onClick={handleAddPalace}>Add Palace</Button>
  );
};

export default AddPalaceButton;

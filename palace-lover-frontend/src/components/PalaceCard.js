import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PalaceCard = ({ palace, onDelete }) => {
  const { t, i18n } = useTranslation();

  return (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title>{palace.name}</Card.Title>
        <Card.Text>
          {t('location')}
        </Card.Text>
        <Card.Text>
          {t('history')}
        </Card.Text>
        <div className="d-flex justify-content-between">
          <Link to={`/edit-palace/${palace.id}`} className="btn btn-secondary mr-2">
            {t('edit')}
          </Link>
          <Button variant="danger" onClick={() => onDelete(palace.id)}>
            {t('delete')}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default PalaceCard;

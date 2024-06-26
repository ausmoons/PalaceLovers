import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const EditPalace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [palace, setPalace] = useState({
    name: '',
    location: '',
    latitude: 0,
    longitude: 0,
    history: '',
    yearBuilt: '',
    visitingHours: '',
    images: [],
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToRemove, setImagesToRemove] = useState([]);

  useEffect(() => {
    const fetchPalace = async () => {
      try {
        const response = await axios.get(`https://localhost:7251/api/palaces/${id}`);
        console.log('Fetched Palace:', response.data);
        setPalace({
          ...response.data,
          images: [],
        });
        setExistingImages(response.data.galleries || []);
      } catch (error) {
        console.error('Error fetching palace:', error);
      }
    };

    fetchPalace();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPalace({ ...palace, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setPalace({ ...palace, images: files });

    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const geocodeLocation = async (address) => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
      console.log('Geocoding response:', response.data);
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        return { latitude: lat, longitude: lon };
      } else {
        throw new Error('No results found');
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
      throw error;
    }
  };

  const handleRemoveExistingImage = (imageUrl) => {
    setImagesToRemove([...imagesToRemove, imageUrl]);
    setExistingImages(existingImages.filter(image => image.imageUrl !== imageUrl));
  };

 const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const { latitude, longitude } = await geocodeLocation(palace.location);
        const formData = new FormData();
        formData.append('name', palace.name);
        formData.append('location', palace.location);
        formData.append('latitude', latitude);
        formData.append('longitude', longitude);
        formData.append('history', palace.history);
        formData.append('yearBuilt', palace.yearBuilt);
        formData.append('visitingHours', palace.visitingHours);

        existingImages.forEach(image => {
            formData.append('existingImages', image.imageUrl);
        });

        for (let i = 0; i < (palace.images || []).length; i++) {
            formData.append('images', palace.images[i]);
        }

        imagesToRemove.forEach(imageUrl => {
            formData.append('imagesToRemove', imageUrl);
        });

        const token = localStorage.getItem('token');
        console.log('Form Data:', Array.from(formData.entries()));
        console.log('Authorization Token:', token);

        await axios.put(`https://localhost:7251/api/palaces/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            },
        });
        alert(t('palaceUpdatedSuccessfully'));
        navigate('/');
    } catch (error) {
        console.error('There was an error updating the palace!', error);
        alert(t('errorUpdatingPalace'));
    }
};
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`https://localhost:7251/api/palaces/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 204) {
        console.log('Palace successfully deleted');
        navigate('/');
      } else {
        console.error('Unexpected response status:', response.status);
        alert(t('errorDeletingPalace'));
      }
    } catch (error) {
      console.error('There was an error deleting the palace!', error.response || error);
      alert(t('errorDeletingPalace'));
    }
  };

  return (
    <div className="container mt-4">
      <h2>{t('editPalace')}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">{t('name')}</label>
          <input type="text" className="form-control" id="name" name="name" value={palace.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="location">{t('location')}</label>
          <input type="text" className="form-control" id="location" name="location" value={palace.location} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="history">{t('history')}</label>
          <textarea className="form-control" id="history" name="history" value={palace.history} onChange={handleChange} required></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="yearBuilt">{t('yearBuilt')}</label>
          <input type="number" className="form-control" id="yearBuilt" name="yearBuilt" value={palace.yearBuilt} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="visitingHours">{t('visitingHours')}</label>
          <input type="text" className="form-control" id="visitingHours" name="visitingHours" value={palace.visitingHours} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>{t('existingImages')}</label>
          <div className="existing-images mt-3">
            {existingImages.map((image, index) => (
              <div key={index} style={{ display: 'inline-block', marginRight: '10px' }}>
                <img src={`https://localhost:7251${image.imageUrl}`} alt="Existing" className="img-thumbnail" style={{ maxWidth: '200px' }} />
                <button type="button" className="btn btn-danger" onClick={() => handleRemoveExistingImage(image.imageUrl)}>{t('delete')}</button>
              </div>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="images">{t('newImages')}</label>
          <input type="file" className="form-control" id="images" name="images" multiple onChange={handleFileChange} />
          <div className="image-previews mt-3">
            {imagePreviews.map((preview, index) => (
              <img key={index} src={preview} alt="Preview" className="img-thumbnail" style={{ maxWidth: '200px', marginRight: '10px' }} />
            ))}
          </div>
        </div>
        <button type="submit" className="btn btn-primary">{t('updatePalace')}</button>
        <button onClick={handleDelete} className="btn btn-danger ml-2 m-1">{t('deletePalace')}</button>
      </form>
    </div>
  );
};

export default EditPalace;

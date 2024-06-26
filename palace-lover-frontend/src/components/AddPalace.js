import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AddPalace = () => {
  const [palace, setPalace] = useState({
    name: '',
    location: '',
    history: '',
    yearBuilt: '',
    visitingHours: '',
    images: [],
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

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

      for (let i = 0; i < palace.images.length; i++) {
        formData.append('images', palace.images[i]);
      }

      const token = localStorage.getItem('token');
      await axios.post('https://localhost:7251/api/palaces', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });
      navigate('/');
    } catch (error) {
      console.error('There was an error adding the palace!', error);
    }
  };

  return (
<div className="container mt-4">
  <h2 className="extra-large-text mb-4">{t('addPalace')}</h2>
  <form onSubmit={handleSubmit}>
    <div className="form-group mb-4">
      <label htmlFor="name" className="large-text">{t('name')}</label>
      <input type="text" className="form-control large-text" id="name" name="name" value={palace.name} onChange={handleChange} required />
    </div>
    <div className="form-group mb-4">
      <label htmlFor="location" className="large-text">{t('location')}</label>
      <input type="text" className="form-control large-text" id="location" name="location" value={palace.location} onChange={handleChange} required />
    </div>
    <div className="form-group mb-4">
      <label htmlFor="history" className="large-text">{t('history')}</label>
      <textarea className="form-control large-text" id="history" name="history" value={palace.history} onChange={handleChange} required></textarea>
    </div>
    <div className="form-group mb-4">
      <label htmlFor="yearBuilt" className="large-text">{t('yearBuilt')}</label>
      <input type="number" className="form-control large-text" id="yearBuilt" name="yearBuilt" value={palace.yearBuilt} onChange={handleChange} required />
    </div>
    <div className="form-group mb-4">
      <label htmlFor="visitingHours" className="large-text">{t('visitingHours')}</label>
      <input type="text" className="form-control large-text" id="visitingHours" name="visitingHours" value={palace.visitingHours} onChange={handleChange} />
    </div>
    <div className="form-group mb-4">
      <label htmlFor="images" className="large-text">{t('images')}</label>
      <input type="file" className="form-control large-text" id="images" name="images" multiple onChange={handleFileChange} />
      <div className="image-previews mt-3">
        {imagePreviews.map((preview, index) => (
          <img key={index} src={preview} alt="Preview" className="img-thumbnail" style={{ maxWidth: '200px', marginRight: '10px' }} />
        ))}
      </div>
    </div>
    <button type="submit" className="btn btn-primary large-text-1">{t('addPalace')}</button>
  </form>
</div>
  );
};

export default AddPalace;

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPalace({ ...palace, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setPalace({ ...palace, images: files });

    // Generate image previews
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const geocodeLocation = async (address) => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
      console.log('Geocoding response:', response.data); // Log the API response
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
      <h2>Add Palace</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input type="text" className="form-control" id="name" name="name" value={palace.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input type="text" className="form-control" id="location" name="location" value={palace.location} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="history">History</label>
          <textarea className="form-control" id="history" name="history" value={palace.history} onChange={handleChange} required></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="yearBuilt">Year Built</label>
          <input type="number" className="form-control" id="yearBuilt" name="yearBuilt" value={palace.yearBuilt} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="visitingHours">Visiting Hours</label>
          <input type="text" className="form-control" id="visitingHours" name="visitingHours" value={palace.visitingHours} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="images">Images</label>
          <input type="file" className="form-control" id="images" name="images" multiple onChange={handleFileChange} />
          <div className="image-previews mt-3">
            {imagePreviews.map((preview, index) => (
              <img key={index} src={preview} alt="Preview" className="img-thumbnail" style={{ maxWidth: '200px', marginRight: '10px' }} />
            ))}
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Add Palace</button>
      </form>
    </div>
  );
};

export default AddPalace;

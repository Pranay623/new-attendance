import React, { useState } from 'react';
import './Registed.css';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import logo from './assets/logo.jpg';
import animation1 from './assets/animation1.jpg';
import animation2 from './assets/animation2.jpg';
import animation3 from './assets/animation3.jpg';

const ImageSwiper = () => {
  const images = [animation1, animation2, animation3];
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <img
        src={images[currentIndex]}
        alt={`Slide ${currentIndex + 1}`}
        style={{ width: '300px', height: '150px', borderRadius: '10px', background: 'none' }}
      />
      <div style={{ marginTop: '20px' }}>
        <button onClick={handlePrev} style={{ marginRight: '10px' }}>
          Previous
        </button>
        <button onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
};

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    if (file) {
      formData.append('file', file);
    }

    try {
      const response = await fetch('http://localhost:5001/user/signup', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Signup successful:', data);
      navigate('/profile'); // Redirect on successful sign-up
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  return (
    <div className="wrapper">
      <div className="container">
        <div className='camara-pos'>
          <div className="camara-box">
            <div className="logo-container">
              <img src={logo} alt="Logo" className="logo-image" />
              <h1 className="logo-name">Know Me</h1>
            </div>
            <div className='image-swiper'>
              <ImageSwiper />
            </div>
            <p className="welcome-text">Welcome!</p>
          </div>
        </div>
        <div className="signup-page">
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                value={name}
                placeholder='Name'
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                value={email}
                placeholder='Username'
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <FaUser className='icons' />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <FaLock className='icons' />
            </div>
            <div className="form-group">
              <p>Upload a profile picture</p>
              <input
                type="file"
                name='file'
                onChange={(e) => setFile(e.target.files[0])}
                required
              />
            </div>
            <div className='signupbtn'>
              <button type="submit">Sign Up</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;

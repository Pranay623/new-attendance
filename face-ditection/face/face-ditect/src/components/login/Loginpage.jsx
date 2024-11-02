import React, { useState } from 'react';
import './LoginPage.css';
import { Link, useNavigate } from 'react-router-dom';
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

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberPassword, setRememberPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    console.log('Submitting:', { email, password }); // Log the email and password

    try {
      const response = await fetch('http://localhost:5001/user/signin', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.status === "SUCCESS") {
        console.log("Sign in successful!");
        localStorage.setItem('userID', data.data._id); // Storing user ID
        localStorage.setItem('userName', data.data.name); 
        navigate('/profile');
      } else {
        setError(data.message || "Sign in failed.");
      }
    } catch (error) {
      console.error("Error during sign in:", error);
      setError("An error occurred during sign in.");
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
        <div className="login-page">
          <h2>Login</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <p>
            Don't have an account? 
            <Link to="/register" className="create-account-link"> Create New Account</Link>
          </p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="email"
                value={email}
                placeholder='Enter E-mail'
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
            <div className='loginbtn'>
              <button type="submit">Sign in</button>
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    className='checkbox'
                    checked={rememberPassword}
                    onChange={() => setRememberPassword(!rememberPassword)}
                  />
                  Remember password
                </label>
              </div>
            </div>
          </form>
          <Link to="/forgot-password" className="forgot-password-link">Forgot password?</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

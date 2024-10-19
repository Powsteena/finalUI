import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/Landing.css';
import logo from '../Images/logo.png'
import heroimg from '../Images/hero.png'
import driver from '../Images/driver.jpg'

const LandingPage = () => {
  const navigate = useNavigate();

  const handlePublishRide = () => {
    const isDriverRegistered = localStorage.getItem('userRole') === 'driver';
    navigate(isDriverRegistered ? '/go-ride' : '/driver-register');
  };

  const handleGetStartedClick = () => {
    navigate('/register');
  };

  return (
    <div className="landing-page">
    <nav className="navbar">
  <div className="container">
    <a className="navbar-brand" href="/">
      <img src={logo} alt="Logo" className="logo" />
    </a>
    <ul className="nav-links">
      <li><a href="#about">About</a></li>
      <li><a href="#services">Services</a></li>
      <li><a href="#contact">Contact</a></li>
      <li><a href="/login" className="btn btn-primary btn-small">Login</a></li>
    </ul>
  </div>
</nav>

      <header className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>"Your Next Ride is Just a Tap Away – Let’s Get Going!"</h1>
            <p>Find a ride or publish one. It's easy and quick! Join us and make your commute hassle-free.</p>
            <button className="btn" onClick={handleGetStartedClick}>
            Get Started
          </button>
    </div>
          <div className="hero-image">
            <img src={heroimg} alt="hero" />
          </div>
        </div>
      </header>


<section className="features">
  <div className="container">
    <div className="feature-card driver">
      <div className="feature-image">
        <img src={driver} alt="Driver" />
      </div>
      <div className="feature-text">
        <h2>For Drivers</h2>
        <p>Become a driver and start earning money by sharing rides. It's simple and rewarding!</p>
        <button onClick={handlePublishRide} className="btn">Publish Ride</button>
      </div>
    </div>
  </div>
</section>
      <footer>
        <div className="container">
          <p>&copy; 2024 wayX. All rights reserved.</p>
          <a href="#contact">Contact Us</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/Landing.css';
import logo from '../Images/logo.png'
import heroimg from '../Images/hero.webp'
import driver from '../Images/driver.jpg'
// import passenger from '../Images/passenger.jpg'

const LandingPage = () => {
  const navigate = useNavigate();

  // const handleGoRide = () => {
  //   const isRegistered = localStorage.getItem('userRole') === 'passenger';
  //   navigate(isRegistered ? '/login' : '/register');
  // };

  const handlePublishRide = () => {
    const isDriverRegistered = localStorage.getItem('userRole') === 'driver';
    navigate(isDriverRegistered ? '/go-ride' : '/driver-register');
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
      <li><a href="/register" className="btn btn-secondary btn-small">Register</a></li>
    </ul>
  </div>
</nav>



      <header className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>"Your Next Ride is Just a Tap Away – Let’s Get Going!"</h1>
            <p>Find a ride or publish one. It's easy and quick! Join us and make your commute hassle-free.</p>
          </div>
          <div className="hero-image">
            <img src={heroimg} alt="hero" />
          </div>
        </div>
      </header>

      <section className="features">
        <div className="container">
          <div className="feature-card driver">
            <img src={driver} alt="Driver" />
            <h2>For Drivers</h2>
            <p>Become a driver and start earning money by providing rides. It's simple and rewarding!</p>
            <button onClick={handlePublishRide} className="btn btn-primary">Publish Ride</button>
          </div>
          {/* <div className="feature-card passenger">
            <img src={passenger} alt="Passenger" />
            <h2>For Passengers</h2>
            <p>Find a ride that suits your needs and travel comfortably with our easy-to-use app.</p>
            <button onClick={handleGoRide} className="btn btn-secondary">Go Ride</button>
          </div> */}
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
import React, { useState, useEffect } from 'react';
import CompletedRides from './CompletedRides';
import RideRequests from './RideRequest';
import PaymentInfo from './PaymentInfo';
import '../CSS/DriverDashboard.css';
import axios from 'axios';

const DriverDashboard = () => {
  // State to manage driver's availability and location
  const [isAvailable, setIsAvailable] = useState(false);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [locationError, setLocationError] = useState('');

  // Function to toggle availability and update location
  const toggleAvailability = () => {
    if (!isAvailable) {
      // If the driver is becoming available, get their live location
      getLiveLocation();
    } else {
      // Driver is toggling to unavailable, clear location
      setLocation({ latitude: null, longitude: null });
    }
    setIsAvailable(!isAvailable);
  };

  // Function to get live location using Geolocation API
  const getLiveLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          setLocationError('');
          // Send the updated location and availability to the backend
          updateDriverStatus(latitude, longitude, true);
        },
        (error) => {
          setLocationError('Unable to retrieve your location.');
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
    }
  };

  // Function to send the availability status and location to the backend
  const updateDriverStatus = async (latitude, longitude, availability) => {
    try {
      const response = await axios.post('http://localhost:5000/api/driver/update-status', {
        isAvailable: availability,
        location: { latitude, longitude },
      });
      console.log('Driver status updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating driver status:', error);
    }
  };

  useEffect(() => {
    // If the driver toggles to unavailable, update the backend to reflect that
    if (!isAvailable) {
      updateDriverStatus(null, null, false);
    }
  }, [isAvailable]);

  return (
    <div className="dashboard-container">
      <h1>Driver Dashboard</h1>

      {/* Availability Toggle */}
      <div className="availability-section">
        <h2>Availability Status</h2>
        <button onClick={toggleAvailability} className={`availability-button ${isAvailable ? 'available' : 'unavailable'}`}>
          {isAvailable ? 'Available for Rides' : 'Unavailable for Rides'}
        </button>
        {locationError && <p className="error-text">{locationError}</p>}
      </div>

      {/* Ride Requests Section */}
      <RideRequests />

      {/* Completed Rides Section */}
      <CompletedRides />

      {/* Payment Information Section */}
      <PaymentInfo />
    </div>
  );
};

export default DriverDashboard;

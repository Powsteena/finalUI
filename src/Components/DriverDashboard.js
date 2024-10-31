
import React, { useState, useEffect } from 'react';
import CompletedRides from './CompletedRides';
// import RideRequests from './RideRequest';
import PaymentInfo from './PaymentInfo';
import '../CSS/DriverDashboard.css';
import axios from 'axios';
import io from 'socket.io-client';

// Initialize the Socket.io client
const socket = io('http://localhost:5000'); // Update with your server URL

const DriverDashboard = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [newRideRequest, setNewRideRequest] = useState(null);

  const toggleAvailability = () => {
    if (!isAvailable) {
      getLiveLocation();
    } else {
      setAddress('');
      setCoordinates({ latitude: null, longitude: null });
      setNearbyPlaces([]);
      updateDriverStatus(false, '', { latitude: null, longitude: null });
    }
    setIsAvailable(!isAvailable);
  };

  const getLiveLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocationError('');
          fetchAddress(latitude, longitude);
          setCoordinates({ latitude, longitude });
        },
        (error) => {
          setLocationError('Unable to retrieve your location.');
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
    }
  };

  const fetchAddress = async (latitude, longitude) => {
    const apiUrl = `https://google-map-places.p.rapidapi.com/maps/api/geocode/json?latlng=${latitude},${longitude}&language=en&region=en`;
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          'x-rapidapi-key': '962111a97cmshe5fa71b93e2a226p128708jsn2f0b2b4e19e8',
          'x-rapidapi-host': 'google-map-places.p.rapidapi.com',
        },
      });
      if (response.data && response.data.results && response.data.results.length > 0) {
        const formattedAddress = response.data.results[0].formatted_address;
        setAddress(formattedAddress);
        loadGoogleMap(latitude, longitude);
        fetchNearbyPlaces(formattedAddress);
        updateDriverStatus(true, formattedAddress, { latitude, longitude });
      } else {
        setLocationError('Unable to fetch address.');
      }
    } catch (error) {
      setLocationError('Error fetching location data.');
      console.error(error);
    }
  };

  const fetchNearbyPlaces = async (searchAddress) => {
    const apiUrl = `https://google-map-places.p.rapidapi.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(searchAddress)}&inputtype=textquery&language=en`;
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          'x-rapidapi-key': '962111a97cmshe5fa71b93e2a226p128708jsn2f0b2b4e19e8',
          'x-rapidapi-host': 'google-map-places.p.rapidapi.com',
        },
      });
      if (response.data && response.data.candidates) {
        setNearbyPlaces(response.data.candidates);
      } else {
        console.error('No nearby places found');
      }
    } catch (error) {
      console.error('Error fetching nearby places:', error);
    }
  };

  const updateDriverStatus = async (availability, driverAddress, coordinates) => {
    try {
      const driverId = localStorage.getItem('driverId');
      const response = await axios.post('http://localhost:5000/api/driver/update-availability', {
        driverId,
        isAvailable: availability,
        liveLocation: {
          address: driverAddress,
          coordinates: [coordinates.longitude, coordinates.latitude], // Change this to an array
        },
      });
      console.log('Driver status updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating driver status:', error);
    }
  };

  const loadGoogleMap = (latitude, longitude) => {
    if (window.google) {
      const map = new window.google.maps.Map(document.getElementById('map'), {
        center: { lat: latitude, lng: longitude },
        zoom: 15,
      });

      new window.google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: map,
        title: 'Your Location',
      });

      setMapLoaded(true);
    }
  };

  // Socket.io listener for new ride requests
  useEffect(() => {
    // Listen for 'newRideRequest' event
    socket.on('newRideRequest', (rideData) => {
      setNewRideRequest(rideData); // Store ride request data
      alert('New ride request received!'); // Show notification
    });

    return () => {
      socket.off('newRideRequest');
    };
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Driver Dashboard</h1>

      <div className="availability-section">
        <h2>Availability Status</h2>
        <button onClick={toggleAvailability} className={`availability-button ${isAvailable ? 'available' : 'unavailable'}`}>
          {isAvailable ? 'Available for Rides' : 'Unavailable for Rides'}
        </button>
        {locationError && <p className="error-text">{locationError}</p>}
      </div>

      {mapLoaded && (
        <div className="map-container">
          <h3>Your Current Location</h3>
          <div id="map" style={{ width: '100%', height: '400px' }}></div>
          {address && <p><strong>Address:</strong> {address}</p>}
          {coordinates.latitude && coordinates.longitude && (
            <p>
              <strong>Coordinates:</strong> Latitude: {coordinates.latitude}, Longitude: {coordinates.longitude}
            </p>
          )}
        </div>
      )}

      {nearbyPlaces.length > 0 && (
        <div className="nearby-places">
          <h3>Nearby Places</h3>
          <ul>
            {nearbyPlaces.map((place, index) => (
              <li key={index}>{place.name} - {place.formatted_address}</li>
            ))}
          </ul>
        </div>
      )}

      {/* <RideRequests /> */}
      <CompletedRides />
      <PaymentInfo />

      {newRideRequest && (
        <div className="ride-request-notification">
          <h2>New Ride Request</h2>
          <p>Pickup Location: {newRideRequest.pickupLocation}</p>
          <p>Destination: {newRideRequest.destination}</p>
        </div>
      )}
    </div>
  );
};

export default DriverDashboard;
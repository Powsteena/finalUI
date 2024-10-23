import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import '../CSS/UserDashboard.css';
import { jwtDecode } from 'jwt-decode';

// Fix for default marker icon issue with Leaflet and Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const UserDashboard = () => {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropoffCoords, setDropoffCoords] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([9.6615, 80.0255]);
  const [suggestions, setSuggestions] = useState([]);
  const [activeInput, setActiveInput] = useState('');
  const [vehicleType, setVehicleType] = useState('Car');
  const [numPassengers, setNumPassengers] = useState(1);

  const requestOptions = useMemo(() => ({
    method: "GET",
    headers: new Headers({
      "x-rapidapi-key": "962111a97cmshe5fa71b93e2a226p128708jsn2f0b2b4e19e8",
      "x-rapidapi-host": "google-map-places.p.rapidapi.com",
      "Accept": "application/json"
    }),
    redirect: "follow"
  }), []);
  
  const geocode = useCallback(async (latlng) => {
    try {
      const response = await fetch(
        `https://google-map-places.p.rapidapi.com/maps/api/geocode/json?latlng=${latlng[0]},${latlng[1]}&language=en&region=en&location_type=APPROXIMATE`,
        requestOptions
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error in geocoding:', error);
      return [];
    }
  }, [requestOptions]);

  useEffect(() => {
    const fetchUserLocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            console.log("User Coordinates:", latitude, longitude);
            setUserLocation([latitude, longitude]);
            setMapCenter([latitude, longitude]);

            const locationName = await geocode([latitude, longitude]);
            console.log("Geocode Result:", locationName);
            setPickup(locationName.length > 0 ? locationName[0].formatted_address : 'Unknown Location');
            setPickupCoords([latitude, longitude]);
          },
          (error) => {
            console.error("Error getting user location:", error);
          }
        );
      }
    };

    fetchUserLocation();
  }, [geocode]);

  const fetchPlaceSuggestions = async (query) => {
    try {
      const response = await fetch(
        `https://google-map-places.p.rapidapi.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&language=en&region=en&result_type=administrative_area_level_1`,
        requestOptions
      );
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error fetching geocoded location:', error);
      return [];
    }
  };
  const handleInputChange = async (e, setter, inputType) => {
    const value = e.target.value;
    setter(value);
    setActiveInput(inputType);
    if (value.length > 2) {
      const places = await fetchPlaceSuggestions(value);
      setSuggestions(places);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionSelect = (place, setter, coordsSetter) => {
    setter(place.formatted_address);
    coordsSetter([place.geometry.location.lat, place.geometry.location.lng]);
    setSuggestions([]);
    setActiveInput('');
  };

  const MapClickHandler = () => {
    useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;
        const locationName = await geocode([lat, lng]);

        if (!pickupCoords) {
          setPickupCoords([lat, lng]);
          setPickup(locationName.length > 0 ? locationName[0].formatted_address : 'Unknown Location');
        } else if (!dropoffCoords) {
          setDropoffCoords([lat, lng]);
          setDropoff(locationName.length > 0 ? locationName[0].formatted_address : 'Unknown Location');
        }
      },
    });
    return null;
  };
  const handleSearchRide = async () => {
    const token = localStorage.getItem('token'); 
    if (!pickupCoords || !dropoffCoords || !pickup || !dropoff || !vehicleType || !numPassengers) {
      alert('Please select valid pickup and dropoff locations.');
      return; // Exit early if coordinates are missing
    }
  
    console.log('Searching for a ride from', pickup, 'to', dropoff, 'with vehicle type', vehicleType, 'for', numPassengers, 'passengers.');
    console.log('Pickup coordinates:', pickupCoords);
    console.log('Dropoff coordinates:', dropoffCoords);
  
    if (!token) {
      console.error('No token found, user might not be logged in.');
      alert('You must be logged in to request a ride.');
      return; // Exit if no token is found
    }
  
    try {
      // Decode the token to get user info
      const decodedToken = jwtDecode(token);
      console.log('Decoded token:', decodedToken);
  
      const role = decodedToken.user?.role; 
      if (!role) {
        throw new Error('Role not found in token');
      }
  
      console.log('User role:', role);
  

      const requestBody = {
        pickup: {
          address: pickup,
          coordinates: pickupCoords.slice().reverse() 
        },
        dropoff: {
          address: dropoff,
          coordinates: dropoffCoords.slice().reverse() 
        },
        vehicleType,
        numPassengers,
      };
  
      console.log('Sending request:', JSON.stringify(requestBody, null, 2));
  
      const response = await fetch('http://localhost:5000/api/ride-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Failed to create ride request');
      }
  
      const data = await response.json();
      console.log('Ride request created:', data);
      alert('Ride request created successfully!');


      // Notify nearby drivers
      const notifyResponse = await fetch('http://localhost:5000/api/ride-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          pickupCoords,
          dropoffCoords,
          vehicleType,
          numPassengers,
        }),
      });
  
      if (!notifyResponse.ok) {
        const errorResponse = await notifyResponse.json(); // Get error response for detailed message
        console.error('Error notifying drivers:', errorResponse);
        throw new Error(errorResponse.message || 'Failed to notify drivers');
      }
  
      console.log('Drivers notified successfully!');
  
    } catch (error) {
      console.error('Error creating ride request:', error);
      alert(`Error creating ride request: ${error.message || 'Please try again.'}`);
    }
  };
  

return (
  <div className="dashboard-container">
    <div className="map-section">
      <MapContainer center={mapCenter} zoom={13} style={{ width: '100%', height: '500px' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapClickHandler />
        {userLocation && (
          <Marker position={userLocation}>
            <Popup>Your Location</Popup>
          </Marker>
        )}
        {pickupCoords && (
          <Marker position={pickupCoords}>
            <Popup>Pickup Location: {pickup}</Popup>
          </Marker>
        )}
        {dropoffCoords && (
          <Marker position={dropoffCoords}>
            <Popup>Drop-off Location: {dropoff}</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>

    <div className="form-section">
      <h2>Search for Your Ride</h2>
      <div className="input-group">
        <label htmlFor="pickup">Pickup Location:</label>
        <input
          type="text"
          id="pickup"
          value={pickup}
          onChange={(e) => handleInputChange(e, setPickup, 'pickup')}
          placeholder="Enter pickup location or click on map"
        />
        {suggestions.length > 0 && activeInput === 'pickup' && (
          <div className="suggestions">
            {suggestions.map((place, index) => (
              <div key={index} onClick={() => handleSuggestionSelect(place, setPickup, setPickupCoords)}>
                {place.formatted_address}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="input-group">
        <label htmlFor="dropoff">Drop-off Location:</label>
        <input
          type="text"
          id="dropoff"
          value={dropoff}
          onChange={(e) => handleInputChange(e, setDropoff, 'dropoff')}
          placeholder="Enter drop-off location or click on map"
        />
        {suggestions.length > 0 && activeInput === 'dropoff' && (
          <div className="suggestions">
            {suggestions.map((place, index) => (
              <div key={index} onClick={() => handleSuggestionSelect(place, setDropoff, setDropoffCoords)}>
                {place.formatted_address}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="input-group">
        <label htmlFor="vehicle">Vehicle Type:</label>
        <select id="vehicle" value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
          <option value="Car">Car</option>
          <option value="Van">Van</option>
          <option value="Motorbike">Motorbike</option>
          <option value="Tuk Tuk">Tuk Tuk</option>
        </select>
      </div>
      <div className="input-group">
        <label htmlFor="passengers">Number of Passengers:</label>
        <input
          type="number"
          id="passengers"
          value={numPassengers}
          onChange={(e) => setNumPassengers(Number(e.target.value))}
          min="1"
          max="10"
        />
      </div>
      <button onClick={handleSearchRide}>Search Ride</button>
    </div>
  </div>
);
};
export default UserDashboard;


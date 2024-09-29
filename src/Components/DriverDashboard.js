// import React, { useState, useEffect } from 'react';
// import CompletedRides from './CompletedRides';
// import RideRequests from './RideRequest';
// import PaymentInfo from './PaymentInfo';
// import '../CSS/DriverDashboard.css';
// import axios from 'axios';

// const DriverDashboard = () => {
//   const [isAvailable, setIsAvailable] = useState(false);
//   const [locationError, setLocationError] = useState('');
//   const [mapLoaded, setMapLoaded] = useState(false);
//   const [address, setAddress] = useState('');
//   const [nearbyPlaces, setNearbyPlaces] = useState([]);

//   const toggleAvailability = () => {
//     if (!isAvailable) {
//       getLiveLocation();
//     } else {
//       setAddress('');
//       setNearbyPlaces([]);
//       updateDriverStatus('', false); // Set availability to false without address
//     }
//     setIsAvailable(!isAvailable);
//   };

//   const getLiveLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           setLocationError('');
//           fetchAddress(latitude, longitude);
//         },
//         (error) => {
//           setLocationError('Unable to retrieve your location.');
//         }
//       );
//     } else {
//       setLocationError('Geolocation is not supported by your browser.');
//     }
//   };

//   const fetchAddress = async (latitude, longitude) => {
//     const apiUrl = `https://google-map-places.p.rapidapi.com/maps/api/geocode/json?latlng=${latitude},${longitude}&language=en&region=en`;
//     try {
//       const response = await axios.get(apiUrl, {
//         headers: {
//           'x-rapidapi-key': 'YOUR_RAPIDAPI_KEY', // Use your own API key
//           'x-rapidapi-host': 'google-map-places.p.rapidapi.com',
//         },
//       });
//       if (response.data && response.data.results && response.data.results.length > 0) {
//         const formattedAddress = response.data.results[0].formatted_address;
//         setAddress(formattedAddress);
//         loadGoogleMap(latitude, longitude);
//         fetchNearbyPlaces(formattedAddress);
//         updateDriverStatus(formattedAddress, true); // Send the address here
//       } else {
//         setLocationError('Unable to fetch address.');
//       }
//     } catch (error) {
//       setLocationError('Error fetching location data.');
//       console.error(error);
//     }
//   };

//   const fetchNearbyPlaces = async (searchAddress) => {
//     const apiUrl = `https://google-map-places.p.rapidapi.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(searchAddress)}&inputtype=textquery&language=en`;
//     try {
//       const response = await axios.get(apiUrl, {
//         headers: {
//           'x-rapidapi-key': '962111a97cmshe5fa71b93e2a226p128708jsn2f0b2b4e19e8',
//           'x-rapidapi-host': 'google-map-places.p.rapidapi.com',
//         },
//       });
//       if (response.data && response.data.candidates) {
//         setNearbyPlaces(response.data.candidates);
//       } else {
//         console.error('No nearby places found');
//       }
//     } catch (error) {
//       console.error('Error fetching nearby places:', error);
//     }
//   };

//   const updateDriverStatus = async (address, availability) => {
//     try {
//       const driverId = localStorage.getItem('driverId');
//       const response = await axios.post('http://localhost:5000/api/driver/update-availability', {
//         driverId,
//         isAvailable: availability,
//         address, // Send the address instead of latitude and longitude
//       });
//       console.log('Driver status updated successfully:', response.data);
//     } catch (error) {
//       console.error('Error updating driver status:', error);
//     }
//   };

//   const loadGoogleMap = (latitude, longitude) => {
//     if (window.google) {
//       const map = new window.google.maps.Map(document.getElementById('map'), {
//         center: { lat: latitude, lng: longitude },
//         zoom: 15,
//       });

//       new window.google.maps.Marker({
//         position: { lat: latitude, lng: longitude },
//         map: map,
//         title: 'Your Location',
//       });

//       setMapLoaded(true);
//     }
//   };

//   useEffect(() => {
//     if (!isAvailable) {
//       updateDriverStatus('', false); // Reset status when unavailable
//     }
//   }, [isAvailable]);

//   return (
//     <div className="dashboard-container">
//       <h1>Driver Dashboard</h1>

//       <div className="availability-section">
//         <h2>Availability Status</h2>
//         <button onClick={toggleAvailability} className={`availability-button ${isAvailable ? 'available' : 'unavailable'}`}>
//           {isAvailable ? 'Available for Rides' : 'Unavailable for Rides'}
//         </button>
//         {locationError && <p className="error-text">{locationError}</p>}
//       </div>

//       {mapLoaded && (
//         <div className="map-container">
//           <h3>Your Current Location</h3>
//           <div id="map" style={{ width: '100%', height: '400px' }}></div>
//           {address && <p><strong>Address:</strong> {address}</p>}
//         </div>
//       )}

//       {nearbyPlaces.length > 0 && (
//         <div className="nearby-places">
//           <h3>Nearby Places</h3>
//           <ul>
//             {nearbyPlaces.map((place, index) => (
//               <li key={index}>{place.name} - {place.formatted_address}</li>
//             ))}
//           </ul>
//         </div>
//       )}

//       <RideRequests />
//       <CompletedRides />
//       <PaymentInfo />
//     </div>
//   );
// };

// export default DriverDashboard;






import React, { useState, useEffect } from 'react';
import CompletedRides from './CompletedRides';
import RideRequests from './RideRequest';
import PaymentInfo from './PaymentInfo';
import '../CSS/DriverDashboard.css';
import axios from 'axios';

const DriverDashboard = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [address, setAddress] = useState('');
  const [nearbyPlaces, setNearbyPlaces] = useState([]);

  const toggleAvailability = () => {
    if (!isAvailable) {
      getLiveLocation();
    } else {
      setAddress('');
      setNearbyPlaces([]);
      updateDriverStatus(false, '');
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
        updateDriverStatus(true, formattedAddress);
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

  const updateDriverStatus = async (availability, driverAddress) => {
    try {
      const driverId = localStorage.getItem('driverId');
      const response = await axios.post('http://localhost:5000/api/driver/update-availability', {
        driverId,
        isAvailable: availability,
        address: driverAddress,
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

      <RideRequests />
      <CompletedRides />
      <PaymentInfo />
    </div>
  );
};

export default DriverDashboard;


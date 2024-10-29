// import React, { useState, useEffect } from 'react';
// import CompletedRides from './CompletedRides';
// import RideRequests from './RideRequest';
// import PaymentInfo from './PaymentInfo';
// import '../CSS/DriverDashboard.css';
// import axios from 'axios';
// import io from 'socket.io-client';

// // Initialize the Socket.io client
// const socket = io('http://localhost:5000'); 

// const DriverDashboard = () => {
//   const [isAvailable, setIsAvailable] = useState(false);
//   const [locationError, setLocationError] = useState('');
//   const [mapLoaded, setMapLoaded] = useState(false);
//   const [address, setAddress] = useState('');
//   const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });
//   const [nearbyPlaces, setNearbyPlaces] = useState([]);
//   const [newRideRequest, setNewRideRequest] = useState(null);

//   const toggleAvailability = () => {
//     if (!isAvailable) {
//       getLiveLocation();
//     } else {
//       setAddress('');
//       setCoordinates({ latitude: null, longitude: null });
//       setNearbyPlaces([]);
//       updateDriverStatus(false, '', { latitude: null, longitude: null });
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
//           setCoordinates({ latitude, longitude });
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
//           // 'x-rapidapi-key': '962111a97cmshe5fa71b93e2a226p128708jsn2f0b2b4e19e8',
//           // 'x-rapidapi-key': '1b6d944821mshf58f0f5e9c0718dp1335a3jsn9c23b79529d6',
//           'x-rapidapi-key': '993fddfe25msh8663009768c58e4p17eb0bjsn515d752365782',
//           'x-rapidapi-host': 'google-map-places.p.rapidapi.com',
//         },
//       });
//       if (response.data && response.data.results && response.data.results.length > 0) {
//         const formattedAddress = response.data.results[0].formatted_address;
//         setAddress(formattedAddress);
//         loadGoogleMap(latitude, longitude);
//         fetchNearbyPlaces(formattedAddress);
//         updateDriverStatus(true, formattedAddress, { latitude, longitude });
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
//           // 'x-rapidapi-key': '962111a97cmshe5fa71b93e2a226p128708jsn2f0b2b4e19e8',
//           // 'x-rapidapi-key': '1b6d944821mshf58f0f5e9c0718dp1335a3jsn9c23b79529d6',
//           'x-rapidapi-key': '993fddfe25msh8663009768c58e4p17eb0bjsn515d752365782',
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

//   const updateDriverStatus = async (availability, driverAddress, coordinates) => {
//     try {
//       const driverId = localStorage.getItem('driverId');
//       const response = await axios.post('http://localhost:5000/api/driver/update-availability', {
//         driverId,
//         isAvailable: availability,
//         liveLocation: {
//           address: driverAddress,
//           coordinates: [coordinates.longitude, coordinates.latitude], // Change this to an array
//         },
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

//   // Socket.io listener for new ride requests
//   useEffect(() => {
//     // Listen for 'newRideRequest' event
//     socket.on('newRideRequest', (rideData) => {
//       setNewRideRequest(rideData); // Store ride request data
//       alert('New ride request received!');
//     });

//     return () => {
//       socket.off('newRideRequest');
//     };
//   }, []);

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
//           {coordinates.latitude && coordinates.longitude && (
//             <p>
//               <strong>Coordinates:</strong> Latitude: {coordinates.latitude}, Longitude: {coordinates.longitude}
//             </p>
//           )}
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

//       {newRideRequest && (
//         <div className="ride-request-notification">
//           <h2>New Ride Request</h2>
//           <p>Pickup Location: {newRideRequest.pickupLocation}</p>
//           <p>Destination: {newRideRequest.destination}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DriverDashboard;

// // import React, { useState, useEffect } from 'react';
// // import CompletedRides from './CompletedRides';
// // import RideRequests from './RideRequest';
// // import PaymentInfo from './PaymentInfo';
// // import '../CSS/DriverDashboard.css';
// // import axios from 'axios';
// // import io from 'socket.io-client';

// // // Initialize the Socket.io client
// // const socket = io('http://localhost:5000'); 

// // const DriverDashboard = () => {
// //   const [isAvailable, setIsAvailable] = useState(false);
// //   const [locationError, setLocationError] = useState('');
// //   const [mapLoaded, setMapLoaded] = useState(false);
// //   const [address, setAddress] = useState('');
// //   const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });
// //   const [nearbyPlaces, setNearbyPlaces] = useState([]);
// //   const [newRideRequest, setNewRideRequest] = useState(null);

// //   const toggleAvailability = () => {
// //     if (!isAvailable) {
// //       getLiveLocation();
// //     } else {
// //       setAddress('');
// //       setCoordinates({ latitude: null, longitude: null });
// //       setNearbyPlaces([]);
// //       updateDriverStatus(false, '', { latitude: null, longitude: null });
// //     }
// //     setIsAvailable(!isAvailable);
// //   };

// //   const getLiveLocation = () => {
// //     if (navigator.geolocation) {
// //       navigator.geolocation.getCurrentPosition(
// //         (position) => {
// //           const { latitude, longitude } = position.coords;
// //           setLocationError('');
// //           fetchAddress(latitude, longitude);
// //           setCoordinates({ latitude, longitude });
// //         },
// //         (error) => {
// //           setLocationError('Unable to retrieve your location.');
// //         }
// //       );
// //     } else {
// //       setLocationError('Geolocation is not supported by your browser.');
// //     }
// //   };

// //   const fetchAddress = async (latitude, longitude) => {
// //     const apiUrl = `https://google-map-places.p.rapidapi.com/maps/api/geocode/json?latlng=${latitude},${longitude}&language=en&region=en`;
// //     try {
// //       const response = await axios.get(apiUrl, {
// //         headers: {
// //           'x-rapidapi-key': '962111a97cmshe5fa71b93e2a226p128708jsn2f0b2b4e19e8',
// //           'x-rapidapi-host': 'google-map-places.p.rapidapi.com',
// //         },
// //       });
// //       if (response.data && response.data.results && response.data.results.length > 0) {
// //         const formattedAddress = response.data.results[0].formatted_address;
// //         setAddress(formattedAddress);
// //         loadGoogleMap(latitude, longitude);
// //         fetchNearbyPlaces(formattedAddress);
// //         updateDriverStatus(true, formattedAddress, { latitude, longitude });
// //       } else {
// //         setLocationError('Unable to fetch address.');
// //       }
// //     } catch (error) {
// //       setLocationError('Error fetching location data.');
// //       console.error(error);
// //     }
// //   };

// //   const fetchNearbyPlaces = async (searchAddress) => {
// //     const apiUrl = `https://google-map-places.p.rapidapi.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(searchAddress)}&inputtype=textquery&language=en`;
// //     try {
// //       const response = await axios.get(apiUrl, {
// //         headers: {
// //           'x-rapidapi-key': '962111a97cmshe5fa71b93e2a226p128708jsn2f0b2b4e19e8',
// //           'x-rapidapi-host': 'google-map-places.p.rapidapi.com',
// //         },
// //       });
// //       if (response.data && response.data.candidates) {
// //         setNearbyPlaces(response.data.candidates);
// //       } else {
// //         console.error('No nearby places found');
// //       }
// //     } catch (error) {
// //       console.error('Error fetching nearby places:', error);
// //     }
// //   };

// //   const updateDriverStatus = async (availability, driverAddress, coordinates) => {
// //     try {
// //       const driverId = localStorage.getItem('driverId');
// //       const response = await axios.post('http://localhost:5000/api/driver/update-availability', {
// //         driverId,
// //         isAvailable: availability,
// //         liveLocation: {
// //           address: driverAddress,
// //           coordinates: [coordinates.longitude, coordinates.latitude], // Change this to an array
// //         },
// //       });
// //       console.log('Driver status updated successfully:', response.data);
// //     } catch (error) {
// //       console.error('Error updating driver status:', error);
// //     }
// //   };

// //   const loadGoogleMap = (latitude, longitude) => {
// //     if (window.google) {
// //       const map = new window.google.maps.Map(document.getElementById('map'), {
// //         center: { lat: latitude, lng: longitude },
// //         zoom: 15,
// //       });

// //       new window.google.maps.Marker({
// //         position: { lat: latitude, lng: longitude },
// //         map: map,
// //         title: 'Your Location',
// //       });

// //       setMapLoaded(true);
// //     }
// //   };

// //   // Socket.io listener for new ride requests
// //   useEffect(() => {
// //     // Listen for 'newRideRequest' event
// //     socket.on('newRideRequest', (rideData) => {
// //       setNewRideRequest(rideData); // Store ride request data
// //       alert('New ride request received!');
// //     });

// //     return () => {
// //       socket.off('newRideRequest');
// //     };
// //   }, []);

// //   return (
// //     <div className="dashboard-container">
// //       <h1>Driver Dashboard</h1>

// //       <div className="availability-section">
// //         <h2>Availability Status</h2>
// //         <button onClick={toggleAvailability} className={`availability-button ${isAvailable ? 'available' : 'unavailable'}`}>
// //           {isAvailable ? 'Available for Rides' : 'Unavailable for Rides'}
// //         </button>
// //         {locationError && <p className="error-text">{locationError}</p>}
// //       </div>

// //       {mapLoaded && (
// //         <div className="map-container">
// //           <h3>Your Current Location</h3>
// //           <div id="map" style={{ width: '100%', height: '400px' }}></div>
// //           {address && <p><strong>Address:</strong> {address}</p>}
// //           {coordinates.latitude && coordinates.longitude && (
// //             <p>
// //               <strong>Coordinates:</strong> Latitude: {coordinates.latitude}, Longitude: {coordinates.longitude}
// //             </p>
// //           )}
// //         </div>
// //       )}

// //       {nearbyPlaces.length > 0 && (
// //         <div className="nearby-places">
// //           <h3>Nearby Places</h3>
// //           <ul>
// //             {nearbyPlaces.map((place, index) => (
// //               <li key={index}>{place.name} - {place.formatted_address}</li>
// //             ))}
// //           </ul>
// //         </div>
// //       )}

// //       <RideRequests />
// //       <CompletedRides />
// //       <PaymentInfo />

// //       {newRideRequest && (
// //         <div className="ride-request-notification">
// //           <h2>New Ride Request</h2>
// //           <p>Pickup Location: {newRideRequest.pickupLocation}</p>
// //           <p>Destination: {newRideRequest.destination}</p>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default DriverDashboard;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import io from 'socket.io-client';
// import '../CSS/DriverDashboard.css';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';

// // Initialize Socket.io client
// const socket = io('http://localhost:5000');

// const DriverDashboard = () => {
//   // State management
//   const [isAvailable, setIsAvailable] = useState(false);
//   const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });
//   const [address, setAddress] = useState('');
//   const [locationError, setLocationError] = useState('');
//   const [mapLoaded, setMapLoaded] = useState(false);
//   const [activeRides, setActiveRides] = useState([]);
//   const [completedRides, setCompletedRides] = useState([]);
//   const [earnings, setEarnings] = useState({
//     today: 0,
//     thisWeek: 0,
//     thisMonth: 0
//   });

//   // Initialize Google Maps
//   useEffect(() => {
//     if (coordinates.latitude && coordinates.longitude) {
//       loadGoogleMap(coordinates.latitude, coordinates.longitude);
//     }
//   }, [coordinates]);

//   // Socket.io listeners
//   useEffect(() => {
//     socket.on('newRideRequest', (rideData) => {
//       setActiveRides(prev => [...prev, rideData]);
//       // Show notification
//       if (Notification.permission === 'granted') {
//         new Notification('New Ride Request!', {
//           body: `Pickup: ${rideData.pickupLocation}\nDropoff: ${rideData.dropoffLocation}`
//         });
//       }
//     });

//     socket.on('rideStatusUpdate', (updatedRide) => {
//       setActiveRides(prev => 
//         prev.map(ride => 
//           ride.id === updatedRide.id ? updatedRide : ride
//         )
//       );
//     });

//     return () => {
//       socket.off('newRideRequest');
//       socket.off('rideStatusUpdate');
//     };
//   }, []);

//   // Location tracking
//   const getLiveLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           setLocationError('');
//           setCoordinates({ latitude, longitude });
//           fetchAddress(latitude, longitude);
//         },
//         (error) => {
//           setLocationError('Unable to retrieve your location.');
//           setIsAvailable(false);
//         }
//       );
//     } else {
//       setLocationError('Geolocation is not supported by your browser.');
//       setIsAvailable(false);
//     }
//   };

//   // Fetch address from coordinates
//   // const fetchAddress = async (latitude, longitude) => {
//   //   try {
//   //     const response = await axios.get(
//   //       `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_GOOGLE_MAPS_API_KEY`
//   //     );
//   //     if (response.data.results && response.data.results.length > 0) {
//   //       setAddress(response.data.results[0].formatted_address);
//   //       updateDriverStatus(true, response.data.results[0].formatted_address, { latitude, longitude });
//   //     }
//   //   } catch (error) {
//   //     console.error('Error fetching address:', error);
//   //     setLocationError('Error fetching address.');
//   //   }
//   // };

//   const fetchAddress = async (latitude, longitude) => {
//     const apiUrl = `https://google-map-places.p.rapidapi.com/maps/api/geocode/json?latlng=${latitude},${longitude}&language=en&region=en`;
//     try {
//       const response = await axios.get(apiUrl, {
//         headers: {
//           'x-rapidapi-key': '962111a97cmshe5fa71b93e2a226p128708jsn2f0b2b4e19e8',
//           'x-rapidapi-host': 'google-map-places.p.rapidapi.com',
//         },
//       });
//       if (response.data && response.data.results && response.data.results.length > 0) {
//         const formattedAddress = response.data.results[0].formatted_address;
//         setAddress(formattedAddress);
//         loadGoogleMap(latitude, longitude);
//         fetchNearbyPlaces(formattedAddress);
//         updateDriverStatus(true, formattedAddress, { latitude, longitude });
//       } else {
//         setLocationError('Unable to fetch address.');
//       }
//     } catch (error) {
//       setLocationError('Error fetching location data.');
//       console.error(error);
//     }
//   };

//   const fetchNearbyPlaces = async (searchAddress) => {
//         const apiUrl = `https://google-map-places.p.rapidapi.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(searchAddress)}&inputtype=textquery&language=en`;
//         try {
//           const response = await axios.get(apiUrl, {
//             headers: {
//               'x-rapidapi-key': '962111a97cmshe5fa71b93e2a226p128708jsn2f0b2b4e19e8',
//               'x-rapidapi-host': 'google-map-places.p.rapidapi.com',
//             },
//           });
//           if (response.data && response.data.candidates) {
//             setNearbyPlaces(response.data.candidates);
//           } else {
//             console.error('No nearby places found');
//           }
//         } catch (error) {
//           console.error('Error fetching nearby places:', error);
//         }
//       };

//   // Update driver status
//   // const updateDriverStatus = async (availability, driverAddress, coords) => {
//   //   try {
//   //     const driverId = localStorage.getItem('driverId');
//   //     await axios.post('http://localhost:5000/api/driver/update-availability', {
//   //       driverId,
//   //       isAvailable: availability,
//   //       liveLocation: {
//   //         address: driverAddress,
//   //         coordinates: [coords.longitude, coords.latitude]
//   //       }
//   //     });
//   //   } catch (error) {
//   //     console.error('Error updating driver status:', error);
//   //     setLocationError('Error updating availability status.');
//   //   }
//   // };

//   const updateDriverStatus = async (availability, driverAddress, coordinates) => {
//         try {
//           const driverId = localStorage.getItem('driverId');
//           const response = await axios.post('http://localhost:5000/api/driver/update-availability', {
//             driverId,
//             isAvailable: availability,
//             liveLocation: {
//               address: driverAddress,
//               coordinates: [coordinates.longitude, coordinates.latitude], // Change this to an array
//             },
//           });
//           console.log('Driver status updated successfully:', response.data);
//         } catch (error) {
//           console.error('Error updating driver status:', error);
//         }
//       };

//   // Toggle availability
//   const toggleAvailability = () => {
//     if (!isAvailable) {
//       getLiveLocation();
//       if (Notification.permission !== 'granted') {
//         Notification.requestPermission();
//       }
//     } else {
//       setAddress('');
//       setCoordinates({ latitude: null, longitude: null });
//       updateDriverStatus(false, '', { latitude: null, longitude: null });
//     }
//     setIsAvailable(!isAvailable);
//   };

//   // Load Google Map
//   const loadGoogleMap = (latitude, longitude) => {
//     if (window.google && document.getElementById('map')) {
//       const map = new window.google.maps.Map(document.getElementById('map'), {
//         center: { lat: latitude, lng: longitude },
//         zoom: 15
//       });

//       new window.google.maps.Marker({
//         position: { lat: latitude, lng: longitude },
//         map: map,
//         title: 'Your Location'
//       });

//       setMapLoaded(true);
//     }
//   };

//   // Handle ride actions
//   const acceptRide = async (rideId) => {
//     try {
//       const driverId = localStorage.getItem('driverId');
//       await axios.post(`http://localhost:5000/api/rides/${rideId}/accept`, { driverId });
      
//       setActiveRides(prev => 
//         prev.map(ride => 
//           ride.id === rideId ? { ...ride, status: 'ACCEPTED' } : ride
//         )
//       );
//     } catch (error) {
//       console.error('Error accepting ride:', error);
//     }
//   };

//   const completeRide = async (rideId) => {
//     try {
//       await axios.post(`http://localhost:5000/api/rides/${rideId}/complete`);
      
//       const completedRide = activeRides.find(ride => ride.id === rideId);
//       if (completedRide) {
//         setCompletedRides(prev => [{ ...completedRide, status: 'COMPLETED' }, ...prev]);
//         setActiveRides(prev => prev.filter(ride => ride.id !== rideId));
        
//         setEarnings(prev => ({
//           ...prev,
//           today: prev.today + completedRide.estimatedFare
//         }));
//       }
//     } catch (error) {
//       console.error('Error completing ride:', error);
//     }
//   };

//   return (
//     <div className="dashboard-container">
//       {/* Status Section */}
//       <div className="dashboard-card">
//         <h2>Driver Status</h2>
//         <div className="status-section">
//           <span className={`status-badge ${isAvailable ? 'available' : 'offline'}`}>
//             {isAvailable ? "Available for Rides" : "Offline"}
//           </span>
//           <button 
//             onClick={toggleAvailability}
//             className={`availability-button ${isAvailable ? 'offline-button' : 'online-button'}`}
//           >
//             {isAvailable ? 'Go Offline' : 'Go Online'}
//           </button>
//         </div>
        
//         {locationError && (
//           <div className="error-message">
//             {locationError}
//           </div>
//         )}

//         {address && (
//           <div className="location-info">
//             <p><strong>Current Address:</strong> {address}</p>
//             {coordinates.latitude && coordinates.longitude && (
//               <p><strong>Coordinates:</strong> {coordinates.latitude.toFixed(4)}, {coordinates.longitude.toFixed(4)}</p>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Map Section */}
//       {mapLoaded && (
//         <div className="dashboard-card">
//           <h2>Current Location</h2>
//           <div id="map" className="map-container"></div>
//         </div>
//       )}

//       {/* Active Rides Section */}
//       <div className="dashboard-card">
//         <h2>Active Ride Requests</h2>
//         <div className="rides-container">
//           {activeRides.length === 0 ? (
//             <p className="no-rides">No active ride requests</p>
//           ) : (
//             activeRides.map((ride) => (
//               <div key={ride.id} className="ride-card">
//                 <div className="ride-details">
//                   <h3>Pickup: {ride.pickupLocation}</h3>
//                   <p>Dropoff: {ride.dropoffLocation}</p>
//                   <p className="fare">Estimated Fare: ${ride.estimatedFare}</p>
//                   <span className={`ride-status ${ride.status.toLowerCase()}`}>
//                     {ride.status}
//                   </span>
//                 </div>
//                 <div className="ride-actions">
//                   {ride.status === 'PENDING' ? (
//                     <button 
//                       onClick={() => acceptRide(ride.id)}
//                       className="accept-button"
//                     >
//                       Accept Ride
//                     </button>
//                   ) : (
//                     <button 
//                       onClick={() => completeRide(ride.id)}
//                       className="complete-button"
//                     >
//                       Complete Ride
//                     </button>
//                   )}
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>

//       {/* Earnings Section */}
//       <div className="dashboard-card">
//         <h2>Earnings</h2>
//         <div className="earnings-grid">
//           <div className="earnings-item">
//             <h3>Today</h3>
//             <p className="amount">${earnings.today}</p>
//           </div>
//           <div className="earnings-item">
//             <h3>This Week</h3>
//             <p className="amount">${earnings.thisWeek}</p>
//           </div>
//           <div className="earnings-item">
//             <h3>This Month</h3>
//             <p className="amount">${earnings.thisMonth}</p>
//           </div>
//         </div>
//       </div>

//       {/* Completed Rides Section */}
//       <div className="dashboard-card">
//         <h2>Recent Completed Rides</h2>
//         <div className="rides-container">
//           {completedRides.length === 0 ? (
//             <p className="no-rides">No completed rides yet</p>
//           ) : (
//             completedRides.slice(0, 5).map((ride) => (
//               <div key={ride.id} className="completed-ride-card">
//                 <div className="ride-details">
//                   <p><strong>From:</strong> {ride.pickupLocation}</p>
//                   <p><strong>To:</strong> {ride.dropoffLocation}</p>
//                 </div>
//                 <div className="ride-fare">
//                   <p className="amount">${ride.estimatedFare}</p>
//                   <span className="completed-badge">Completed</span>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DriverDashboard;


// import React, { useState, useEffect } from 'react';
// import CompletedRides from './CompletedRides';
// import RideRequests from './RideRequest';
// import PaymentInfo from './PaymentInfo';
// import '../CSS/DriverDashboard.css';
// import axios from 'axios';
// import io from 'socket.io-client';
// import { Home, Clock, CheckCircle, DollarSign, LogOut, Menu, X } from 'lucide-react';


// // Initialize the Socket.io client
// const socket = io('http://localhost:5000'); // Update with your server URL

// const DriverDashboard = () => {
//   const [isAvailable, setIsAvailable] = useState(false);
//   const [locationError, setLocationError] = useState('');
//   const [mapLoaded, setMapLoaded] = useState(false);
//   const [address, setAddress] = useState('');
//   const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });
//   const [nearbyPlaces, setNearbyPlaces] = useState([]);
//   const [newRideRequest, setNewRideRequest] = useState(null);

//   const toggleAvailability = () => {
//     if (!isAvailable) {
//       getLiveLocation();
//     } else {
//       setAddress('');
//       setCoordinates({ latitude: null, longitude: null });
//       setNearbyPlaces([]);
//       updateDriverStatus(false, '', { latitude: null, longitude: null });
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
//           setCoordinates({ latitude, longitude });
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
//           'x-rapidapi-key': '962111a97cmshe5fa71b93e2a226p128708jsn2f0b2b4e19e8',
//           'x-rapidapi-host': 'google-map-places.p.rapidapi.com',
//         },
//       });
//       if (response.data && response.data.results && response.data.results.length > 0) {
//         const formattedAddress = response.data.results[0].formatted_address;
//         setAddress(formattedAddress);
//         loadGoogleMap(latitude, longitude);
//         fetchNearbyPlaces(formattedAddress);
//         updateDriverStatus(true, formattedAddress, { latitude, longitude });
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

//   const updateDriverStatus = async (availability, driverAddress, coordinates) => {
//     try {
//       const driverId = localStorage.getItem('driverId');
//       const response = await axios.post('http://localhost:5000/api/driver/update-availability', {
//         driverId,
//         isAvailable: availability,
//         liveLocation: {
//           address: driverAddress,
//           coordinates: [coordinates.longitude, coordinates.latitude], // Change this to an array
//         },
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

//   // Socket.io listener for new ride requests
//   useEffect(() => {
//     // Listen for 'newRideRequest' event
//     socket.on('newRideRequest', (rideData) => {
//       setNewRideRequest(rideData); // Store ride request data
//       alert('New ride request received!');
//     });

//     return () => {
//       socket.off('newRideRequest');
//     };
//   }, []);

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
//           {coordinates.latitude && coordinates.longitude && (
//             <p>
//               <strong>Coordinates:</strong> Latitude: {coordinates.latitude}, Longitude: {coordinates.longitude}
//             </p>
//           )}
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

//       {newRideRequest && (
//         <div className="ride-request-notification">
//           <h2>New Ride Request</h2>
//           <p>Pickup Location: {newRideRequest.pickupLocation}</p>
//           <p>Destination: {newRideRequest.destination}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DriverDashboard;

import React, { useState, useEffect } from 'react';
import { Home, Clock, CheckCircle, DollarSign, LogOut, Menu, X } from 'lucide-react';
import RideRequests from './RideRequest';
import CompletedRides from './CompletedRides';
// import Earnings from './Earnings';
import axios from 'axios';
import io from 'socket.io-client';

// Initialize Socket.io client
const socket = io('http://localhost:5000');

const DriverDashboard = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [locationError, setLocationError] = useState('');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [newRideRequest, setNewRideRequest] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_GOOGLE_MAPS_API_KEY`
      );
      if (response.data.results && response.data.results.length > 0) {
        const formattedAddress = response.data.results[0].formatted_address;
        setAddress(formattedAddress);
        loadGoogleMap(latitude, longitude);
        updateDriverStatus(true, formattedAddress, { latitude, longitude });
      } else {
        setLocationError('Unable to fetch address.');
      }
    } catch (error) {
      setLocationError('Error fetching location data.');
      console.error(error);
    }
  };

  const updateDriverStatus = async (availability, driverAddress, coordinates) => {
    try {
      const driverId = localStorage.getItem('driverId');
      await axios.post('http://localhost:5000/api/driver/update-availability', {
        driverId,
        isAvailable: availability,
        liveLocation: {
          address: driverAddress,
          coordinates: [coordinates.longitude, coordinates.latitude],
        },
      });
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

  const handleLogout = () => {
    localStorage.removeItem('driverId');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  useEffect(() => {
    socket.on('newRideRequest', (rideData) => {
      setNewRideRequest(rideData);
    });

    return () => {
      socket.off('newRideRequest');
    };
  }, []);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'requests', label: 'Ride Requests', icon: Clock },
    { id: 'completed', label: 'Completed Rides', icon: CheckCircle },
    { id: 'earnings', label: 'Earnings', icon: DollarSign },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Availability Status</h2>
              <button
                onClick={toggleAvailability}
                className={`px-6 py-2 rounded-full font-medium ${
                  isAvailable ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-red-600 text-white hover:bg-red-600'
                }`}
              >
                {isAvailable ? 'Available for Rides' : 'Unavailable for Rides'}
              </button>
              {locationError && <p className="text-red-500 mt-2">{locationError}</p>}
            </div>

            {mapLoaded && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Your Current Location</h3>
                <div id="map" className="w-full h-96 rounded-lg mb-4"></div>
                {address && (
                  <p className="text-gray-700">
                    <span className="font-medium">Address:</span> {address}
                  </p>
                )}
                {coordinates.latitude && coordinates.longitude && (
                  <p className="text-gray-700">
                    <span className="font-medium">Coordinates:</span> Latitude: {coordinates.latitude}, Longitude:{' '}
                    {coordinates.longitude}
                  </p>
                )}
              </div>
            )}
          </div>
        );
      case 'requests':
        return <RideRequests />;
      case 'completed':
        return <CompletedRides />;
      // case 'earnings':
      //   return <Earnings />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-20">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-white shadow"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-10 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800">Driver Dashboard</h1>
          </div>

          <nav className="flex-1 px-4">
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors
                        ${activeTab === item.id ? 'bg-red-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      <Icon size={20} className="mr-3" />
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <LogOut size={20} className="mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen">
        <div className="p-6">
          {renderContent()}
        </div>
      </div>

      {/* New Ride Request Notification */}
      {newRideRequest && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-6 max-w-sm animate-slide-up">
          <h2 className="text-lg font-semibold mb-2">New Ride Request</h2>
          <p className="text-gray-600 mb-1">
            <span className="font-medium">Pickup:</span> {newRideRequest.pickupLocation}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Destination:</span> {newRideRequest.destination}
          </p>
        </div>
      )}
    </div>
  );
};

export default DriverDashboard;


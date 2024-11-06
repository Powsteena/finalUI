


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import '../CSS/DriverDashboard.css';
// import { useParams } from 'react-router-dom';
// import ConfirmationDialog from '../Components/DriverConfirm';

// // Fix default marker icon
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
//   iconUrl: require('leaflet/dist/images/marker-icon.png'),
//   shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
// });

// const DriverDashboard = () => {
//   const [isAvailable, setIsAvailable] = useState(false);
//   const [locationError, setLocationError] = useState('');
//   const [rideRequests, setRideRequests] = useState([]);
//   const [showConfirmDialog, setShowConfirmDialog] = useState(false);
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const { token } = useParams();

//   const toggleAvailability = () => {
//     setIsAvailable(!isAvailable);
//     if (!isAvailable) {
//       fetchRideRequests();
//     } else {
//       setRideRequests([]);
//     }
//   };

//   const fetchRideRequests = async () => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/driver/ride-requests/${token}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const data = await response.json();
//       if (data.nearbyRequest) {
//         const userResponse = await fetch(`http://localhost:5000/api/driver/user/${data.nearbyRequest.userId}`);
//         if (!userResponse.ok) {
//           throw new Error(`HTTP error! Status: ${userResponse.status}`);
//         }
//         const userDetails = await userResponse.json();

//         const requestWithUserDetails = {
//           ...data.nearbyRequest,
//           userName: userDetails.username,
//           userEmail: userDetails.email,
//         };

//         setRideRequests([requestWithUserDetails]);
//       } else {
//         setRideRequests([]);
//         setLocationError('No nearby ride requests available.');
//       }
//     } catch (error) {
//       setLocationError('Error fetching ride requests.');
//       console.error('Error fetching ride requests:', error);
//     }
//   };

//   const handleAcceptClick = (request) => {
//     setSelectedRequest(request);
//     setShowConfirmDialog(true);
//   };

//   const confirmRideRequest = async () => {
//     if (selectedRequest) {
//       try {
//         const response = await axios.put(`http://localhost:5000/api/driver/accept/${selectedRequest._id}`);
//         if (response.status === 200) {
//           setRideRequests((prevRequests) =>
//             prevRequests.map((request) =>
//               request._id === selectedRequest._id ? { ...request, status: 'accepted' } : request
//             )
//           );
//         }
//       } catch (error) {
//         console.error('Error accepting ride request:', error);
//         setLocationError('Failed to accept the ride request. Please try again.');
//       }
//       setShowConfirmDialog(false);
//       setSelectedRequest(null);
//     }
//   };

//   return (
//     <div className="dashboard-container p-4"  style={{ zIndex:0}}>
//       <h1 className="text-2xl font-bold">Driver Dashboard</h1>

//       <div className="availability-section my-4">
//         <h2 className="text-xl">Availability Status</h2>
//         <button
//           onClick={toggleAvailability}
//           className={`availability-button mt-2 p-2 rounded ${isAvailable ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
//         >
//           {isAvailable ? 'Available for Rides' : 'Unavailable for Rides'}
//         </button>
//         {locationError && <p className="error-text text-red-500">{locationError}</p>}
//       </div>

//       {isAvailable && rideRequests.length > 0 && (
//         <div className="ride-requests-section mt-4">
//           {rideRequests.map((request) => (
//             <div key={request._id} className="request-card border rounded shadow-lg mb-4">
//               <div className="map-container">
//                 <MapContainer
//                   center={request.pickup.coordinates.coordinates.reverse()}
//                   zoom={13}
//                   style={{ height: '250px', width: '100%' }}
//                   className="rounded-t"
//                 >
//                   <TileLayer
//                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                     attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                   />
//                   <Marker position={request.pickup.coordinates.coordinates.reverse()}>
//                     <Popup>
//                       <strong>Pickup:</strong> {request.pickup.address}
//                     </Popup>
//                   </Marker>
//                   <Marker position={request.dropoff.coordinates.coordinates.reverse()}>
//                     <Popup>
//                       <strong>Dropoff:</strong> {request.dropoff.address}
//                     </Popup>
//                   </Marker>
//                 </MapContainer>
//               </div>
//               <div className="request-details p-4">
//                 <h3 className="text-lg font-semibold">Ride Request Details</h3>
//                 <p><strong>Pickup Location:</strong> {request.pickup.address}</p>
//                 <p><strong>Dropoff Location:</strong> {request.dropoff.address}</p>
//                 <p><strong>Status:</strong> {request.status}</p>
//                 <p><strong>Vehicle Type:</strong> {request.vehicleType}</p>
//                 <p><strong>No of Passengers:</strong> {request.numPassengers}</p>
//                 <p><strong>User Name:</strong> {request.userName || 'Not available'}</p>
//                 <p><strong>User Email:</strong> {request.userEmail || 'Not available'}</p>
                
//                 <button 
//                   className="accept-button bg-blue-500 text-white py-1 px-3 rounded" 
//                   onClick={() => handleAcceptClick(request)}
//                 >
//                   Accept Ride
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {showConfirmDialog && selectedRequest && (
//         <ConfirmationDialog
//           onConfirm={confirmRideRequest}
//           onCancel={() => setShowConfirmDialog(false)}
//           request={selectedRequest}
//         />
//       )}
//     </div>
//   );
// };

// export default DriverDashboard;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../CSS/DriverDashboard.css';
import { useParams } from 'react-router-dom';
import ConfirmationDialog from '../Components/DriverConfirm';

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const DriverDashboard = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [rideRequests, setRideRequests] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const { token } = useParams();

  useEffect(() => {
    if (isAvailable) {
      fetchRideRequests();
    }
  }, [isAvailable]);

  const toggleAvailability = () => {
    setIsAvailable(!isAvailable);
    if (!isAvailable) {
      setRideRequests([]);
    }
  };

  const fetchRideRequests = async () => {
    try {
      
      const response = await axios.get(`http://localhost:5000/api/driver/ride-requests/${token}`);

      if (!response.data) {
        setLocationError('No nearby ride requests available.');
        return;
      }
      const nearbyRequest = response.data.nearbyRequest;
      if (nearbyRequest) {
        const userResponse = await axios.get(`http://localhost:5000/api/driver/user/${nearbyRequest.userId}`);
        
        const requestWithUserDetails = {
          ...nearbyRequest,
          userName: userResponse.data.username,
          userEmail: userResponse.data.email,
        };

        setRideRequests([requestWithUserDetails]);
      } else {
        setRideRequests([]);
        setLocationError('No nearby ride requests available.');
      }
    } catch (error) {
      setLocationError('Error fetching ride requests.');
      console.error('Error fetching ride requests:', error);
    }
  };

  const handleAcceptClick = (request) => {
    setSelectedRequest(request);
    setShowConfirmDialog(true);
  };

  const confirmRideRequest = async () => {
    if (selectedRequest) {
      try {
        const response = await axios.put(`http://localhost:5000/api/driver/accept/${selectedRequest._id}`);
        if (response.status === 200) {
          setRideRequests((prevRequests) =>
            prevRequests.map((request) =>
              request._id === selectedRequest._id ? { ...request, status: 'accepted' } : request
            )
          );
        }
      } catch (error) {
        console.error('Error accepting ride request:', error);
        setLocationError('Failed to accept the ride request. Please try again.');
      }
      setShowConfirmDialog(false);
      setSelectedRequest(null);
    }
  };

  return (
    <div className="dashboard-container p-4">
      <h1 className="text-2xl font-bold">Driver Dashboard</h1>

      <div className="availability-section my-4">
        <h2 className="text-xl">Availability Status</h2>
        <button
          onClick={toggleAvailability}
          className={`availability-button mt-2 p-2 rounded ${isAvailable ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
        >
          {isAvailable ? 'Available for Rides' : 'Unavailable for Rides'}
        </button>
        {locationError && <p className="error-text text-red-500">{locationError}</p>}
      </div>

      {isAvailable && rideRequests.length > 0 && (
        <div className="ride-requests-section mt-4">
          {rideRequests.map((request) => (
            <div key={request._id} className="request-card border rounded shadow-lg mb-4">
              <div className="map-container">
                <MapContainer
                  center={request.pickupLocation.coordinates.reverse()} // Adjusted for [lat, lng] format
                  zoom={13}
                  style={{ height: '250px', width: '100%' }}
                  className="rounded-t"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={request.pickupLocation.coordinates}>
                    <Popup>
                      <strong>Pickup:</strong> {request.pickupLocation.address}
                    </Popup>
                  </Marker>
                  <Marker position={request.dropoffLocation.coordinates.reverse()}>
                    <Popup>
                      <strong>Dropoff:</strong> {request.dropoffLocation.address}
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
              <div className="request-details p-4">
                <h3 className="text-lg font-semibold">Ride Request Details</h3>
                <p><strong>Pickup Location:</strong> {request.pickupLocation.address}</p>
                <p><strong>Dropoff Location:</strong> {request.dropoffLocation.address}</p>
                <p><strong>Status:</strong> {request.status}</p>
                <p><strong>Vehicle Type:</strong> {request.vehicleType}</p>
                <p><strong>No of Passengers:</strong> {request.numPassengers}</p>
                <p><strong>User Name:</strong> {request.userName || 'Not available'}</p>
                <p><strong>User Email:</strong> {request.userEmail || 'Not available'}</p>
                
                <button 
                  className="accept-button bg-blue-500 text-white py-1 px-3 rounded" 
                  onClick={() => handleAcceptClick(request)}
                >
                  Accept Ride
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showConfirmDialog && selectedRequest && (
        <ConfirmationDialog
          onConfirm={confirmRideRequest}
          onCancel={() => setShowConfirmDialog(false)}
          request={selectedRequest}
        />
      )}
    </div>
  );
};

export default DriverDashboard;

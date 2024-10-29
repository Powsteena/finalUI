
// // RideRequests.js
// import React, { useState, useEffect } from 'react';
// import { MapPin, PhoneCall } from 'lucide-react';
// import axios from 'axios';

// const RideRequests = () => {
//   const [requests, setRequests] = useState([]);

//   useEffect(() => {
//     const fetchRequests = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/api/driver/ride-requests');
//         setRequests(response.data);
//       } catch (error) {
//         console.error('Error fetching ride requests:', error);
//       }
//     };

//     fetchRequests();
//   }, []);

//   const handleAcceptRide = async (requestId) => {
//     try {
//       await axios.post(`http://localhost:5000/api/driver/accept-ride/${requestId}`);
//       setRequests(requests.filter((req) => req.id !== requestId));
//     } catch (error) {
//       console.error('Error accepting ride:', error);
//     }
//   };

//   return (
//     <div className="space-y-4">
//       <h2 className="text-2xl font-semibold mb-6">Pending Ride Requests</h2>
//       {requests.length === 0 ? (
//         <p className="text-gray-500">No pending ride requests</p>
//       ) : (
//         requests.map((request) => (
//           <div key={request.id} className="bg-white rounded-lg shadow p-6">
//             <div className="flex justify-between items-start mb-4">
//               <div>
//                 <h3 className="text-lg font-semibold">{request.passengerName}</h3>
//                 <p className="text-gray-600">{request.time}</p>
//               </div>
//               <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Pending</span>
//             </div>
//             <div className="space-y-3">
//               <div className="flex items-start">
//                 <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-1" />
//                 <div>
//                   <p className="text-sm text-gray-500">Pickup Location</p>
//                   <p className="text-gray-700">{request.pickupLocation}</p>
//                 </div>
//               </div>
//               <div className="flex items-start">
//                 <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-1" />
//                 <div>
//                   <p className="text-sm text-gray-500">Destination</p>
//                   <p className="text-gray-700">{request.destination}</p>
//                 </div>
//               </div>
//               <div className="flex items-start">
//                 <PhoneCall className="w-5 h-5 text-gray-400 mr-3 mt-1" />
//                 <div>
//                   <p className="text-sm text-gray-500">Contact</p>
//                   <p className="text-gray-700">{request.passengerPhone}</p>
//                 </div>
//               </div>
//             </div>
//             <div className="mt-6">
//               <button
//                 onClick={() => handleAcceptRide(request.id)}
//                 className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
//               >
//                 Accept Ride
//               </button>
//             </div>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default RideRequests;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DriverDashboard = () => {
  const [rides, setRides] = useState([]);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        // Fetch the driverId from local storage (ensure it is stored when the driver logs in)
        const driverId = localStorage.getItem('driverId');
        if (!driverId) {
          console.error('Driver ID not found in local storage');
          return;
        }

        // Fetch ride requests for this driver
        const response = await axios.get(`http://localhost:5000/api/driver/riderequests`);
        setRides(response.data);
      } catch (error) {
        console.error('Error fetching ride requests:', error);
      }
    };

    fetchRides();
  }, []);

  return (
    <div>
      <h1>Your Ride Requests</h1>
      {rides.length === 0 ? (
        <p>No ride requests available</p>
      ) : (
        rides.map((ride) => (
          <div key={ride._id} className="ride-card">
            <h2>Passenger: {ride.userId.name}</h2>
            <p>Pickup: {ride.pickup.address}</p>
            <p>Dropoff: {ride.dropoff.address}</p>
            <p>Contact: {ride.userId.email}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default DriverDashboard;

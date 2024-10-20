// import React, { useState } from 'react';

// const RideRequests = () => {
//   const [rideRequests, setRideRequests] = useState([
//     { id: 1, passenger: 'John Doe', from: 'Point A', to: 'Point B' },
//     { id: 2, passenger: 'Jane Smith', from: 'Point C', to: 'Point D' },
//     { id: 3, passenger: 'John', from: 'Point D', to: 'Point T' }
//   ]);

//   const handleAccept = (id) => {
//     // Logic to accept the ride (e.g., API call to accept ride request)
//     alert(`Ride with ID ${id} accepted`);
//     setRideRequests(rideRequests.filter((ride) => ride.id !== id)); // Remove after accepting
//   };

//   const handleReject = (id) => {
//     // Logic to reject the ride (e.g., API call to reject ride request)
//     alert(`Ride with ID ${id} rejected`);
//     setRideRequests(rideRequests.filter((ride) => ride.id !== id)); // Remove after rejecting
//   };

//   return (
//     <div className="ride-requests-section">
//       <h2>Ride Requests</h2>
//       <ul>
//         {rideRequests.map((ride) => (
//           <li key={ride.id}>
//             Passenger: {ride.passenger}, From: {ride.from}, To: {ride.to}
//             <button onClick={() => handleAccept(ride.id)}>Accept</button>
//             <button onClick={() => handleReject(ride.id)}>Reject</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default RideRequests;


import React, { useState, useEffect } from 'react';

const RideRequests = () => {
  const [rideRequests, setRideRequests] = useState([]);

  useEffect(() => {
    // Simulating an API call to fetch ride requests
    const fetchRideRequests = async () => {
      // Replace with your API call
      const requests = [
        { id: 1, passenger: 'John Doe', from: 'Point A', to: 'Point B' },
        { id: 2, passenger: 'Jane Smith', from: 'Point C', to: 'Point D' },
        { id: 3, passenger: 'John', from: 'Point D', to: 'Point T' }
      ];
      setRideRequests(requests);
    };

    fetchRideRequests();
  }, []);

  const handleAccept = (id) => {
    // Logic to accept the ride (e.g., API call to accept ride request)
    if (window.confirm(`Are you sure you want to accept the ride with ID ${id}?`)) {
      alert(`Ride with ID ${id} accepted`);
      setRideRequests((prevRequests) => prevRequests.filter((ride) => ride.id !== id)); // Remove after accepting
    }
  };

  const handleReject = (id) => {
    // Logic to reject the ride (e.g., API call to reject ride request)
    if (window.confirm(`Are you sure you want to reject the ride with ID ${id}?`)) {
      alert(`Ride with ID ${id} rejected`);
      setRideRequests((prevRequests) => prevRequests.filter((ride) => ride.id !== id)); // Remove after rejecting
    }
  };

  return (
    <div className="ride-requests-section">
      <h2>Ride Requests</h2>
      {rideRequests.length === 0 ? (
        <p>No ride requests available.</p>
      ) : (
        <ul>
          {rideRequests.map((ride) => (
            <li key={ride.id}>
              Passenger: {ride.passenger}, From: {ride.from}, To: {ride.to}
              <button onClick={() => handleAccept(ride.id)}>Accept</button>
              <button onClick={() => handleReject(ride.id)}>Reject</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RideRequests;

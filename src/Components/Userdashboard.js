import React, { useState } from 'react';
import '../CSS/UserDashboard.css';

const UserDashboard = () => {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleFindRides = () => {
    // Implement the logic for finding rides
    console.log('Finding rides from', pickup, 'to', dropoff, 'on', date, 'at', time);
  };

  const handlePublishRide = () => {
    // Implement the logic for publishing a ride
    console.log('Publishing a ride from', pickup, 'to', dropoff, 'on', date, 'at', time);
  };

  return (
    <div className="dashboard">
      <h2>Book Your Ride</h2>
      <div className="input-group">
        <label htmlFor="pickup">Pickup Location:</label>
        <input
          type="text"
          id="pickup"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
          placeholder="Enter pickup location"
        />
      </div>
      <div className="input-group">
        <label htmlFor="dropoff">Drop-off Location:</label>
        <input
          type="text"
          id="dropoff"
          value={dropoff}
          onChange={(e) => setDropoff(e.target.value)}
          placeholder="Enter drop-off location"
        />
      </div>
      <div className="input-group">
        <label htmlFor="date">Date:</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div className="input-group">
        <label htmlFor="time">Time:</label>
        <input
          type="time"
          id="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>
      <div className="actions">
        <button className="btn btn-primary" onClick={handleFindRides}>Find Rides</button>
        <button className="btn btn-secondary" onClick={handlePublishRide}>Publish Ride</button>
      </div>
    </div>
  );
};

export default UserDashboard;

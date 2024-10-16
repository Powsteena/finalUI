import React, { useState, useEffect } from 'react';

const DashboardContent = () => {
  // State to store counts and loading/error state
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalDrivers, setTotalDrivers] = useState(0);
  const [totalRides, setTotalRides] = useState(0);
  const [loading, setLoading] = useState(true);  // Track loading state
  const [error, setError] = useState(null);      // Track error state

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Update with the full URL including the port number
        const usersResponse = await fetch('http://localhost:5000/api/user/count');
        const driversResponse = await fetch('http://localhost:5000/api/driver/count');
        const ridesResponse = await fetch('http://localhost:5000/api/ride-request/count');

        // Check if responses are not OK (status code other than 2xx)
        if (!usersResponse.ok || !driversResponse.ok || !ridesResponse.ok) {
          throw new Error('Failed to fetch one or more resources');
        }

        // Parse the JSON data
        const usersData = await usersResponse.json();
        const driversData = await driversResponse.json();
        const ridesData = await ridesResponse.json();

        // Set the state with the fetched counts
        setTotalUsers(usersData.count);
        setTotalDrivers(driversData.count);
        setTotalRides(ridesData.count);
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        setError('Error fetching data. Please try again later.');
        console.error('Error fetching data:', error);
        setLoading(false); // Set loading to false in case of error
      }
    };

    fetchData();
  }, []);

  // Show loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Show error message if there's an error
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h1>Welcome to the Admin Dashboard</h1>
      <p>Here you can manage users, drivers, and rides.</p>

      <div className="row">
        <div className="col-md-4">
          <div className="card mb-4 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Total Users</h5>
              <p className="card-text">{totalUsers}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card mb-4 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Total Drivers</h5>
              <p className="card-text">{totalDrivers}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card mb-4 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Total Rides</h5>
              <p className="card-text">{totalRides}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;


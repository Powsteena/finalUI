import React from 'react';
// import './DashboardContent.css';

const DashboardContent = () => {
  return (
    <div className="container mt-4">
      <h1>Welcome to the Admin Dashboard</h1>
      <p>Here you can manage users, drivers, and rides.</p>

      {/* Add cards or other content here */}
      <div className="row">
        <div className="col-md-4">
          <div className="card mb-4 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Total Users</h5>
              <p className="card-text">100</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card mb-4 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Total Drivers</h5>
              <p className="card-text">50</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card mb-4 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Total Rides</h5>
              <p className="card-text">200</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;

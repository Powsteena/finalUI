import React from 'react';
import { Link } from 'react-router-dom';
import '../CSS/Sidebar.css'; 

const Sidebar = () => {
  return (
    <div className="sidebar bg-dark">
      <h2 className="text-white p-3">Admin Panel</h2>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link to="/admin" className="nav-link text-white"> {/* Updated to "/admin" */}
            Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin-users" className="nav-link text-white">
            Manage Users
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin-drivers" className="nav-link text-white">
            Manage Drivers
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin-rides" className="nav-link text-white">
            Manage Rides
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/settings" className="nav-link text-white">
            Settings
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;

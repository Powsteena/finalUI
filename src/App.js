import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './Components/LoginForm';
import RegisterForm from './Components/RegisterForm';
import LandingPage from './Components/LandingPage';
import DriverRegisterForm from './Components/DriverRegisterForm';
import DriverLoginForm from './Components/DriverLoginForm';
import UserDashboard from './Components/Userdashboard';
import AdminDashboard from './Components/Admindashboard';
import ManageUsers from './Components/ManageUsers'; // Import ManageUsers component
import ManageDrivers from './Components/ManageDrivers'; // Import ManageDrivers component

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/driver-register" element={<DriverRegisterForm />} />
          <Route path="/driver-login" element={<DriverLoginForm />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} /> {/* Add AdminDashboard route */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-users" element={<ManageUsers />} /> {/* Add ManageUsers route */}
          <Route path="/admin-drivers" element={<ManageDrivers />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

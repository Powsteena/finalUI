import React, { useState, useEffect } from 'react';
import { Bell, Clock, LogOut, Plus, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import MyRides from './MyRides';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('schedule');
  const [notifications, setNotifications] = useState([]);
  const [pastRides, setPastRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form states
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [vehicleType, setVehicleType] = useState('car');
  const [numPassengers, setNumPassengers] = useState(1);
  const [scheduledDateTime, setScheduledDateTime] = useState('');

  
     

  const handleScheduleRide = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);

      if (!decoded.user?.id) {
        throw new Error('Invalid token format. Please login again.');
      }

      await axios.post(
        'http://localhost:5000/api/rides/schedule-ride',
        {
          pickup: { address: pickup },
          dropoff: { address: dropoff },
          vehicleType,
          numPassengers: parseInt(numPassengers),
          scheduledDateTime,
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSuccessMessage('Ride scheduled successfully!');
      clearForm();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to schedule ride');
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setPickup('');
    setDropoff('');
    setVehicleType('car');
    setNumPassengers(1);
    setScheduledDateTime('');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const getRideStatusColor = (status) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return statusColors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">User Dashboard</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('notifications')}
              className="relative p-2 text-gray-600 hover:text-gray-900"
            >
              <Bell size={24} />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {notifications.length}
                </span>
              )}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              activeTab === 'schedule'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Plus size={18} />
            Schedule Ride
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              activeTab === 'history'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Clock size={18} />
            
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              activeTab === 'notifications'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Bell size={18} />
            Notifications
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow p-6">
          {/* Success/Error Messages */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-lg">
              {successMessage}
            </div>
          )}

          {/* Schedule Ride Form */}
          {activeTab === 'schedule' && (
            <form onSubmit={handleScheduleRide} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pickup Location
                  </label>
                  <input
                    type="text"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dropoff Location
                  </label>
                  <input
                    type="text"
                    value={dropoff}
                    onChange={(e) => setDropoff(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Type
                  </label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="car">Car</option>
                    <option value="van">Van</option>
                    <option value="motorbike">Motorbike</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Passengers
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={numPassengers}
                    onChange={(e) => setNumPassengers(parseInt(e.target.value))}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduledDateTime}
                    onChange={(e) => setScheduledDateTime(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
              >
                {loading ? 'Scheduling...' : 'Schedule Ride'}
              </button>
            </form>
          )}

          {/* Ride History */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              {pastRides.length === 0 ? (
                <p className="text-center text-gray-500">No ride history available</p>
              ) : (
                pastRides.map((ride) => (
                  <div
                    key={ride._id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-sm ${getRideStatusColor(ride.status)}`}>
                            {ride.status}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(ride.scheduledDateTime).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm">
                          <strong>From:</strong> {ride.pickup.address}
                        </p>
                        <p className="text-sm">
                          <strong>To:</strong> {ride.dropoff.address}
                        </p>
                        <p className="text-sm">
                          <strong>Vehicle:</strong> {ride.vehicleType} |{' '}
                          <strong>Passengers:</strong> {ride.numPassengers}
                        </p>
                      </div>
                      {ride.driverId && (
                        <div className="text-right text-sm">
                          <p className="font-medium">Driver: {ride.driverId.name}</p>
                          <p className="text-gray-500">Vehicle: {ride.driverId.vehicle}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              {notifications.length === 0 ? (
                <p className="text-center text-gray-500">No notifications</p>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className="flex items-start gap-3 border-b last:border-0 py-3"
                  >
                    {notification.type === 'accepted' ? (
                      <CheckCircle className="text-green-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="text-red-500 flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
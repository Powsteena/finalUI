import React, { useState, useEffect } from 'react';

function ManageDrivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found, please log in.');
      }

      const response = await fetch('http://localhost:5000/api/admin/driver', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setDrivers(data);
    } catch (err) {
      console.error('Error fetching drivers:', err);
      setError(err.response?.data?.msg || err.message || 'Error fetching drivers');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleAction = async (action, driverId) => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found, please log in.');
      }

      const url = action === 'delete'
        ? `http://localhost:5000/api/admin/driver/${driverId}`
        : `http://localhost:5000/api/admin/driver/${driverId}/${action}`;

      const response = await fetch(url, {
        method: action === 'delete' ? 'DELETE' : 'PATCH',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      showNotification(data.msg);
      fetchDrivers();
    } catch (err) {
      console.error(`Error performing ${action}:`, err);
      showNotification(err.response?.data?.msg || err.message || `Error performing ${action}`, 'error');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-yellow-600">Loading...</div>;
  }

  return (
    <div className="bg-black/60 min-h-screen p-6">
      <div className="max-w-7xl mx-auto bg-black border border-yellow-600 rounded-lg shadow-lg overflow-hidden">
        <div className="border-b border-yellow-600 p-6">
          <h2 className="text-2xl font-bold text-yellow-600">Manage Drivers</h2>
        </div>

        {notification.show && (
          <div className={`m-6 p-4 border ${notification.type === 'success' ? 'border-yellow-600 text-yellow-600' : 'border-yellow-600 text-yellow-600'} rounded-lg`}>
            {notification.message}
          </div>
        )}

        {error && (
          <div className="m-6 p-4 border border-yellow-600 text-yellow-600 rounded-lg">
            {error}
          </div>
        )}

        <div className="overflow-x-auto p-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-yellow-600">
                <th className="text-left p-4 text-white">Driver Info</th>
                <th className="text-left p-4 text-white">Vehicle Details</th>
                <th className="text-left p-4 text-white hidden lg:table-cell">Documents</th>
                <th className="text-left p-4 text-white">Status</th>
                <th className="text-left p-4 text-white hidden md:table-cell">Registration Date</th>
                <th className="text-left p-4 text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {drivers.length > 0 ? (
                drivers.map((driver) => (
                  <tr key={driver._id} className="border-b border-white hover:bg-yellow-600/10">
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="text-white font-medium">{driver.username}</div>
                        <div className="text-white text-sm">{driver.email}</div>
                        <div className="text-white text-sm">Phone: {driver.phoneNumber}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1 text-white">
                        <div>Type: {driver.vehicleType}</div>
                        <div>Number: {driver.vehicleNumber}</div>
                      </div>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <div className="space-y-2">
                        <a className="block text-white hover:underline cursor-pointer">License Image</a>
                        <a className="block text-white hover:underline cursor-pointer">Vehicle Registration</a>
                        <a className="block text-white hover:underline cursor-pointer">Insurance Document</a>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-2">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs border ${driver.isApproved ? 'border-yellow-600 text-white' : 'border-yellow-600 text-yellow-600'}`}>
                          {driver.isApproved ? 'Approved' : 'Pending'}
                        </span>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs border ${driver.hasPaid ? 'border-yellow-600 text-white' : 'border-yellow-600 text-yellow-600'}`}>
                          {driver.hasPaid ? 'Paid' : 'Unpaid'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell text-white">
                      {new Date(driver.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col space-y-2">
                        <button
                          className="px-4 py-2 border border-yellow-600 text-white rounded hover:bg-yellow-600 hover:text-black transition-colors"
                          onClick={() => handleAction(driver.isApproved ? 'reject' : 'approve', driver._id)}
                        >
                          {driver.isApproved ? 'Reject' : 'Approve'}
                        </button>
                        <button
                          className="px-4 py-2 border border-yellow-600 text-white rounded hover:bg-yellow-600 hover:text-black transition-colors"
                          onClick={() => handleAction('delete', driver._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center p-4 text-yellow-600">
                    No drivers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ManageDrivers;
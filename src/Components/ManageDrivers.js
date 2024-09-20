import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ManageDrivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found, please log in.');
      }

      const response = await axios.get('http://localhost:5000/api/admin/drivers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDrivers(response.data);
    } catch (err) {
      console.error('Error fetching drivers:', err);
      setError(err.response?.data?.msg || err.message || 'Error fetching drivers');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action, driverId) => {
    try {
      setError(null);
      setSuccessMessage('');
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found, please log in.');
      }

      console.log(`Attempting ${action} for driver ${driverId}`);

      let response;
      if (action === 'delete') {
        response = await axios.delete(
          `http://localhost:5000/api/admin/driver/${driverId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        response = await axios.patch(
          `http://localhost:5000/api/admin/driver/${driverId}/${action}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      console.log('Action response:', response.data);
      setSuccessMessage(response.data.msg);
      fetchDrivers(); // Refresh driver list
    } catch (err) {
      console.error(`Error performing ${action}:`, err);
      setError(err.response?.data?.msg || err.message || `Error performing ${action}`);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{padding: '1rem'}}>
      <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem'}}>Manage Drivers</h2>
      {error && <p style={{color: 'red', marginBottom: '1rem'}}>{error}</p>}
      {successMessage && (
        <p style={{backgroundColor: '#d4edda', border: '1px solid #c3e6cb', color: '#155724', padding: '0.75rem', borderRadius: '0.25rem', marginBottom: '1rem'}}>
          {successMessage}
        </p>
      )}
      <ul style={{listStyleType: 'none', padding: 0}}>
        {drivers.length ? (
          drivers.map((driver) => (
            <li key={driver._id} style={{border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem', borderRadius: '0.25rem'}}>
              <p style={{fontWeight: 'bold'}}>{driver.username} ({driver.email})</p>
              <p>Vehicle Type: {driver.vehicleType}</p>
              <p>License Number: {driver.licenseNumber}</p>
              <p>Documents: {driver.documents.join(', ')}</p>
              <p>Status: {driver.isApproved ? 'Approved' : 'Pending'}</p>
              <p>Created At: {new Date(driver.createdAt).toLocaleString()}</p>
              <div style={{marginTop: '0.5rem'}}>
                <button onClick={() => handleAction(driver.isApproved ? 'reject' : 'approve', driver._id)} style={{marginRight: '0.5rem'}}>
                  {driver.isApproved ? 'Reject' : 'Approve'}
                </button>
                <button onClick={() => handleAction('delete', driver._id)} style={{backgroundColor: '#dc3545', color: 'white'}}>
                  Delete
                </button>
              </div>
            </li>
          ))
        ) : (
          <p>No drivers found.</p>
        )}
      </ul>
    </div>
  );
}

export default ManageDrivers;
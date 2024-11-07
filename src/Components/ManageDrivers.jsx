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
    return <div className="loader">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <style>
        {`
          :root {
            --primary-color: #2563eb;
            --success-color: #059669;
            --danger-color: #dc2626;
            --warning-color: #d97706;
            --background-color: #f3f4f6;
            --card-background: #ffffff;
            --text-primary: #111827;
            --text-secondary: #6b7280;
            --border-color: #e5e7eb;
            --hover-background: #f9fafb;
          }

          .dashboard {
            padding: 24px;
            background: var(--background-color);
            min-height: 100vh;
          }

          .card {
            background: var(--card-background);
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            max-width: 1200px;
            margin: 0 auto;
          }

          .card-header {
            padding: 20px 24px;
            border-bottom: 1px solid var(--border-color);
          }

          .card-header h2 {
            font-size: 24px;
            color: var(--text-primary);
            font-weight: 600;
            margin: 0;
          }

          .notification {
            margin: 16px 24px;
            padding: 12px 16px;
            border-radius: 8px;
            animation: slideIn 0.3s ease;
          }

          .notification.success {
            background: #ecfdf5;
            color: var(--success-color);
          }

          .notification.error {
            background: #fef2f2;
            color: var(--danger-color);
          }

          .table-container {
            overflow-x: auto;
            padding: 16px 24px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
          }

          th {
            text-align: left;
            padding: 12px 16px;
            color: var(--text-secondary);
            font-weight: 600;
            background: var(--background-color);
            white-space: nowrap;
          }

          td {
            padding: 16px;
            border-bottom: 1px solid var(--border-color);
            vertical-align: top;
          }

          tr:hover {
            background: var(--hover-background);
          }

          .driver-info {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }

          .driver-name {
            color: var(--text-primary);
            font-weight: 500;
          }

          .driver-email {
            color: var(--text-secondary);
            font-size: 13px;
          }

          .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 9999px;
            font-size: 12px;
            font-weight: 500;
          }

          .status-badge.approved { background: #ecfdf5; color: var(--success-color); }
          .status-badge.pending { background: #fffbeb; color: var(--warning-color); }
          .status-badge.paid { background: #dbeafe; color: #2563eb; }
          .status-badge.unpaid { background: #fee2e2; color: #dc2626; }
          .status-badge.available { background: #d1fae5; color: #059669; }
          .status-badge.unavailable { background: #fef2f2; color: #dc2626; }

          .document-link {
            color: var(--primary-color);
            text-decoration: underline;
            cursor: pointer;
          }

          .actions {
            display: flex;
            gap: 8px;
            justify-content: flex-end;
          }

          button {
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            border: none;
            transition: all 0.2s;
          }

          .btn-approve { background: #ecfdf5; color: var(--success-color); }
          .btn-approve:hover { background: #d1fae5; }
          .btn-reject { background: #fffbeb; color: var(--warning-color); }
          .btn-reject:hover { background: #fef3c7; }
          .btn-delete { background: #fef2f2; color: var(--danger-color); }
          .btn-delete:hover { background: #fee2e2; }

          @media (max-width: 1024px) {
            .hide-tablet {
              display: none;
            }
          }

          @media (max-width: 768px) {
            .hide-mobile {
              display: none;
            }
            
            .card {
              margin: 0;
              border-radius: 0;
            }

            td, th {
              padding: 12px;
            }

            .actions {
              flex-direction: column;
            }

            button {
              width: 100%;
            }
          }
        `}
      </style>

      <div className="card">
        <div className="card-header">
          <h2>Manage Drivers</h2>
        </div>

        {notification.show && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        )}

        {error && (
          <div className="notification error">
            {error}
          </div>
        )}

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Driver Info</th>
                <th>Vehicle Details</th>
                <th className="hide-tablet">Documents</th>
                <th>Status</th>
                <th className="hide-mobile">Registration Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {drivers.length > 0 ? (
                drivers.map((driver) => (
                  <tr key={driver._id}>
                    <td>
                      <div className="driver-info">
                        <span className="driver-name">{driver.username}</span>
                        <span className="driver-email">{driver.email}</span>
                        <span className="driver-email">Phone: {driver.phoneNumber}</span>
                      </div>
                    </td>
                    <td>
                      <div className="driver-info">
                        <span>Type: {driver.vehicleType}</span>
                        <span>Number: {driver.vehicleNumber}</span>
                      </div>
                    </td>
                    <td className="hide-tablet">
                      <div className="driver-info">
                        <a className="document-link">License Image</a>
                        <a className="document-link">Vehicle Registration</a>
                        <a className="document-link">Insurance Document</a>
                      </div>
                    </td>
                    <td>
                      <div className="driver-info">
                        <span className={`status-badge ${driver.isApproved ? 'approved' : 'pending'}`}>
                          {driver.isApproved ? 'Approved' : 'Pending'}
                        </span>
                        <span className={`status-badge ${driver.hasPaid ? 'paid' : 'unpaid'}`}>
                          {driver.hasPaid ? 'Paid' : 'Unpaid'}
                        </span>
                      </div>
                    </td>
                    <td className="hide-mobile">
                      {new Date(driver.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="actions">
                        <button
                          className={driver.isApproved ? 'btn-reject' : 'btn-approve'}
                          onClick={() => handleAction(driver.isApproved ? 'reject' : 'approve', driver._id)}
                        >
                          {driver.isApproved ? 'Reject' : 'Approve'}
                        </button>
                        <button
                          className="btn-delete"
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
                  <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
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
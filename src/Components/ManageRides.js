import React, { useEffect, useState } from 'react';
import { 
  Car, 
  MapPin, 
  User, 
  Users, 
  Calendar, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import axios from 'axios';

const ManageRides = () => {
  const [rideRequests, setRideRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchRideRequests();
  }, []);

  const fetchRideRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found, please log in.');
      }

      const response = await axios.get('http://localhost:5000/api/admin/rides', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRideRequests(response.data);
    } catch (err) {
      console.error('Error fetching ride requests:', err);
      setError(err.response?.data?.msg || err.message || 'Error fetching ride requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action, rideRequestId) => {
    try {
      setError(null);
      setSuccessMessage('');
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found, please log in.');
      }

      const response = await axios.patch(
        `http://localhost:5000/api/admin/riderequest/${rideRequestId}/${action}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccessMessage(response.data.msg);
      fetchRideRequests();
    } catch (err) {
      console.error(`Error performing ${action}:`, err);
      setError(err.response?.data?.msg || err.message || `Error performing ${action}`);
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="text-green-500" size={18} />;
      case 'cancelled':
        return <XCircle className="text-red-500" size={18} />;
      case 'pending':
        return <AlertCircle className="text-yellow-500" size={18} />;
      default:
        return <Clock className="text-blue-500" size={18} />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-yellow-500" size={48} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto my-8 bg-white rounded-lg shadow-lg">
      <div className="bg-yellow-500 p-6 rounded-t-lg">
        <h1 className="text-black text-2xl font-bold flex items-center gap-2">
          <Car size={24} /> Manage Ride Requests
        </h1>
      </div>
      
      <div className="p-6">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded">
            {successMessage}
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Date</th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Pickup</th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Dropoff</th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Vehicle</th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Passengers</th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">User</th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Driver</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rideRequests.length > 0 ? (
                rideRequests.map((request) => (
                  <tr 
                    key={request._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(request.status)}
                        <span className="font-medium">{request.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-500" />
                        {formatDate(request.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-yellow-500" />
                        {request.pickup?.address || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-black" />
                        {request.dropoff?.address || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Car size={16} className="text-gray-500" />
                        {request.vehicleType}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-gray-500" />
                        {request.numPassengers}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-yellow-500" />
                        {request.userId ? request.userId.username : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-black" />
                        {request.driverId ? request.driverId.username : 'Not Assigned'}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-500">
                    No ride requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageRides;



// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import '../CSS/ManageRides.css'

// function ManageRides() {
//     const [rideRequests, setRideRequests] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [successMessage, setSuccessMessage] = useState('');

//     useEffect(() => {
//         fetchRideRequests();
//     }, []);

//     const fetchRideRequests = async () => {
//         try {
//             const token = localStorage.getItem('token');
//             if (!token) {
//                 throw new Error('No token found, please log in.');
//             }

//             const response = await axios.get('http://localhost:5000/api/admin/rides', {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setRideRequests(response.data);
//         } catch (err) {
//             console.error('Error fetching ride requests:', err);
//             setError(err.response?.data?.msg || err.message || 'Error fetching ride requests');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleAction = async (action, rideRequestId) => {
//         try {
//             setError(null);
//             setSuccessMessage('');
//             const token = localStorage.getItem('token');
//             if (!token) {
//                 throw new Error('No token found, please log in.');
//             }

//             const response = await axios.patch(
//                 `http://localhost:5000/api/admin/riderequest/${rideRequestId}/${action}`,
//                 {},
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );

//             setSuccessMessage(response.data.msg);
//             fetchRideRequests();
//         } catch (err) {
//             console.error(`Error performing ${action}:`, err);
//             setError(err.response?.data?.msg || err.message || `Error performing ${action}`);
//         }
//     };

//     if (loading) {
//         return (
//             <div className="loading-container">
//                 <div className="loading-spinner"></div>
//                 <p>Loading...</p>
//             </div>
//         );
//     }

//     return (
//         <div className="manage-rides-container">
//             <h2 className="page-title">Manage Ride Requests</h2>
            
//             {error && <div className="alert error">{error}</div>}
//             {successMessage && <div className="alert success">{successMessage}</div>}
            
//             <div className="rides-grid">
//                 {rideRequests.length ? (
//                     rideRequests.map((request) => (
//                         <div key={request._id} className="ride-card">
//                             <div className="ride-header">
//                                 <span className={`status-badge ${request.status.toLowerCase()}`}>
//                                     {request.status}
//                                 </span>
//                                 <span className="ride-date">
//                                     {new Date(request.createdAt).toLocaleDateString()}
//                                 </span>
//                             </div>
                            
//                             <div className="ride-details">
//                                 <div className="detail-group">
//                                     <label>Pickup</label>
//                                     <p>{request.pickup?.address || 'Pickup address not available'}</p>
//                                 </div>
                                
//                                 <div className="detail-group">
//                                     <label>Dropoff</label>
//                                     <p>{request.dropoff?.address || 'Dropoff address not available'}</p>
//                                 </div>
                                
//                                 <div className="detail-row">
//                                     <div className="detail-group half">
//                                         <label>Vehicle Type</label>
//                                         <p>{request.vehicleType}</p>
//                                     </div>
//                                     <div className="detail-group half">
//                                         <label>Passengers</label>
//                                         <p>{request.numPassengers}</p>
//                                     </div>
//                                 </div>
                                
//                                 <div className="detail-row">
//                                     <div className="detail-group half">
//                                         <label>User</label>
//                                         <p>{request.userId ? request.userId.username : 'N/A'}</p>
//                                     </div>
//                                     <div className="detail-group half">
//                                         <label>Driver</label>
//                                         <p>{request.driverId ? request.driverId.username : 'Not Assigned'}</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     ))
//                 ) : (
//                     <div className="no-rides">No ride requests found.</div>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default ManageRides;

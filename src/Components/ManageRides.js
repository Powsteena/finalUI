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
        return <CheckCircle className="text-yellow-600" size={18} />;
      case 'cancelled':
        return <XCircle className="text-yellow-600" size={18} />;
      case 'pending':
        return <AlertCircle className="text-yellow-600" size={18} />;
      default:
        return <Clock className="text-yellow-600" size={18} />;
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
      <div className="flex items-center justify-center min-h-screen bg-black">
        <Loader2 className="animate-spin text-yellow-600" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black/70 p-6">
      <div className="max-w-4xl mx-auto bg-black border border-yellow-600 rounded-lg shadow-lg overflow-hidden">
        <div className="border-b border-yellow-600 p-6">
          <h1 className="text-white text-2xl font-bold flex items-center gap-2">
            <Car size={24} /> Manage Ride Requests
          </h1>
        </div>
      
        <div className="p-6">
          {error && (
            <div className="border border-yellow-600 text-white p-4 mb-4 rounded">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="border border-yellow-600 text-white p-4 mb-4 rounded">
              {successMessage}
            </div>
          )}
        
          <div className="overflow-x-auto">
            <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-yellow-600 scrollbar-track-black">
              <table className="min-w-full">
                <thead className="border-b border-yellow-600 sticky top-0 bg-black z-10">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-bold text-white">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-white">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-white">Pickup</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-white">Dropoff</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-white">Vehicle</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-white">Passengers</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-white">User</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-white">Driver</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-yellow-600/30">
                  {rideRequests.length > 0 ? (
                    rideRequests.map((request) => (
                      <tr 
                        key={request._id}
                        className="hover:bg-yellow-600/5 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-white">
                            {getStatusIcon(request.status)}
                            <span className="font-medium">{request.status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-white">
                            <Calendar size={24} />
                            {formatDate(request.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-white">
                            <MapPin size={16} />
                            {request.pickup?.address || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-white">
                            <MapPin size={16} />
                            {request.dropoff?.address || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-white">
                            <Car size={16} />
                            {request.vehicleType}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-white">
                            <Users size={16} />
                            {request.numPassengers}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-white">
                            <User size={16} />
                            {request.userId ? request.userId.username : 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-white">
                            <User size={16} />
                            {request.driverId ? request.driverId.username : 'Not Assigned'}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="text-center py-8 text-yellow-600">
                        No ride requests found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
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

import React from 'react';
import { Clock } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const RidesHistory = () => {
  const [pastRides, setPastRides] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    fetchPastRides();
  }, []);

  const fetchPastRides = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('User not authenticated');
        return;
      }
  
      const decoded = jwtDecode(token);
      const userId = decoded.user?.id;
  
      if (!userId) {
        setError('Failed to identify user. Please login again.');
        return;
      }
  
      const response = await axios.get(`http://localhost:5000/api/auth/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      if (response.data) {
        setPastRides(response.data);
      } else {
        setError('No rides found for the user');
      }
    } catch (err) {
      console.error('Error fetching rides:', err);
      setError('Failed to fetch ride history');
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return <div className="text-center py-4">Loading ride history...</div>;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-800 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {pastRides.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-gray-500">No ride history available</p>
        </div>
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
  );
};

export default RidesHistory;
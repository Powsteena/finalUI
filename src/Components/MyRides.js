import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, Clock, MapPin, Car, User, X } from 'lucide-react';

const CreatedRides = () => {
  const [createdRides, setCreatedRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCreatedRides = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('http://localhost:5000/api/auth/my-rides', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCreatedRides(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch rides');
        setLoading(false);
      }
    };

    fetchCreatedRides();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 text-center bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">My Future Rides</h2>
        {/* <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-full flex items-center space-x-2 transition-colors">
          <span>+</span>
          <span>Schedule Ride</span>
        </button> */}
      </div>

      {createdRides.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No rides scheduled yet.
        </div>
      ) : (
        <div className="space-y-4">
          {createdRides.map((ride) => (
            <div 
              key={ride._id} 
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 relative"
            >
              <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>

              <div className="space-y-4">
                {/* Date and Time */}
                <div className="flex space-x-6">
                  <div className="flex items-center text-gray-600 space-x-2">
                    <Calendar size={18} className="text-yellow-500" />
                    <span>{new Date(ride.scheduledDateTime).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-gray-600 space-x-2">
                    <Clock size={18} className="text-yellow-500" />
                    <span>{new Date(ride.scheduledDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                {/* Pickup Location */}
                <div className="flex items-start space-x-2">
                  <MapPin size={18} className="text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-gray-500">Pickup</div>
                    <div className="text-gray-700">{ride.pickup.address || 'Not provided'}</div>
                  </div>
                </div>

                {/* Dropoff Location */}
                <div className="flex items-start space-x-2">
                  <MapPin size={18} className="text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-gray-500">Dropoff</div>
                    <div className="text-gray-700">{ride.dropoff.address || 'Not provided'}</div>
                  </div>
                </div>

                {/* Vehicle and Passengers Info */}
                <div className="flex justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Car size={18} />
                    <span className="capitalize">{ride.vehicleType}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <User size={18} />
                    <span>{ride.numPassengers || 2}</span>
                  </div>
                </div>

                {ride.driverId && (
                  <div className="flex items-center space-x-2 pt-4 border-t border-gray-100 text-gray-600">
                    <User size={18} className="text-yellow-500" />
                    <span>Driver: {ride.driverId.name} ({ride.driverId.vehicle})</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CreatedRides;
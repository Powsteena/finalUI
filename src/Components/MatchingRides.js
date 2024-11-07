import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MatchingRides = () => {
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRides = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/driver/scheduledrides', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Log the response to debug
                console.log('Fetched rides:', response.data);

                setRides(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error details:', err);
                setError('Failed to fetch rides');
                setLoading(false);
            }
        };

        fetchRides();
    }, []);

    if (loading) return <div className="flex justify-center p-4">Loading...</div>;
    if (error) return <div className="text-red-500 p-4">{error}</div>;


    const handleAcceptRide = async (rideId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.patch(
                `http://localhost:5000/api/driver/accept-ride/${rideId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            // Update the UI or notify the driver about the successful acceptance
            alert('Ride accepted successfully!');
            // Optionally, you can update the UI state to reflect the accepted status
            setRides((prevRides) =>
                prevRides.map((ride) =>
                    ride._id === rideId ? { ...ride, status: 'accepted' } : ride
                )
            );
        } catch (err) {
            console.error('Error accepting ride:', err);
            alert('Failed to accept ride');
        }
    };
    

    return (
        <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-lg">
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Matching Rides</h2>
                {rides.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Username
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Pickup Location
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Dropoff Location
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Passengers
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date & Time
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {rides.map((ride) => (
                                    <tr key={ride._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {ride.userId?.username || ride.userId?.name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {ride.pickup?.address || 'Not provided'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {ride.dropoff?.address || 'Not provided'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {ride.numPassengers}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {new Date(ride.scheduledDateTime).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            
                                            {ride.status === 'pending' && (
                                                <button
                                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors duration-200"
                                                    onClick={() => handleAcceptRide(ride._id)}
                                                >
                                                    Accept Ride
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center p-4 text-gray-500">No matching rides found</p>
                )}
            </div>
        </div>
    );
};

export default MatchingRides;
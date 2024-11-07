import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyAcceptedRides = () => {
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAcceptedRides = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Authentication required. Please login.');
                    setLoading(false);
                    return;
                }

                // Create axios instance with default config
                const axiosInstance = axios.create({
                    baseURL: 'http://localhost:5000/api/auth',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 10000 // 10 second timeout
                });

                const response = await axiosInstance.get('/my-acceptedrides');
                
                if (response.data && Array.isArray(response.data)) {
                    setRides(response.data);
                } else {
                    throw new Error('Invalid data format received');
                }
            } catch (err) {
                console.error('Error details:', err);
                if (err.response) {
                    // Server responded with error
                    switch (err.response.status) {
                        case 401:
                            setError('Session expired. Please login again.');
                            break;
                        case 404:
                            setError('No rides found.');
                            break;
                        case 500:
                            setError('Server error. Please try again later.');
                            break;
                        default:
                            setError('An error occurred while fetching your rides.');
                    }
                } else if (err.request) {
                    // Request made but no response
                    setError('Unable to connect to server. Please check your internet connection.');
                } else {
                    setError('An unexpected error occurred.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAcceptedRides();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-4" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        );
    }

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">My Accepted Rides</h1>
            {rides.length === 0 ? (
                <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative">
                    No accepted rides found
                </div>
            ) : (
                <div className="space-y-4">
                    {rides.map((ride) => (
                        <div 
                            key={ride._id} 
                            className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
                        >
                            <div className="border-b pb-2 mb-2">
                                <h2 className="text-lg font-semibold">Ride Details</h2>
                            </div>
                            <div className="space-y-2">
                                <p>
                                    <span className="font-semibold">Pickup:</span>{' '}
                                    {ride.pickup?.address || 'Not provided'}
                                </p>
                                <p>
                                    <span className="font-semibold">Dropoff:</span>{' '}
                                    {ride.dropoff?.address || 'Not provided'}
                                </p>
                                <p>
                                    <span className="font-semibold">Driver:</span>{' '}
                                    {ride.driverId?.name || 'Not assigned'}
                                    {ride.driverId?.vehicle && ` (Vehicle: ${ride.driverId.vehicle})`}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyAcceptedRides;
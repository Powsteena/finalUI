import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Phone, User, Car, MapPin } from 'lucide-react';

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

                const axiosInstance = axios.create({
                    baseURL: 'http://localhost:5000/api/auth',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
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
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg m-4" role="alert">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {rides.length === 0 ? (
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">No accepted rides found</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2">
                    {rides.map((ride) => (
                        <div 
                            key={ride._id} 
                            className="bg-white shadow-xl rounded-xl overflow-hidden border border-black/10"
                        >
                            {/* Ride Status Header */}
                            <div className="bg-black px-6 py-4">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-lg font-semibold text-yellow-500">Ride #{ride._id.slice(-6)}</h2>
                                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-500 text-black">
                                        {ride.status}
                                    </span>
                                </div>
                            </div>

                            {/* Ride Details */}
                            <div className="p-6 space-y-6">
                                {/* Location Details */}
                                <div className="space-y-3">
                                    <div className="flex items-start space-x-3">
                                        <MapPin className="w-5 h-5 text-yellow-500 mt-1" />
                                        <div>
                                            <p className="text-sm font-medium text-black/60">Pickup Location</p>
                                            <p className="text-black">{ride.pickup?.address || 'Not provided'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <MapPin className="w-5 h-5 text-yellow-500 mt-1" />
                                        <div>
                                            <p className="text-sm font-medium text-black/60">Dropoff Location</p>
                                            <p className="text-black">{ride.dropoff?.address || 'Not provided'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Driver Details */}
                                <div className="bg-yellow-50 rounded-lg p-4 space-y-3">
                                    <h3 className="font-semibold text-black">Driver Information</h3>
                                    
                                    <div className="flex items-center space-x-3">
                                        <User className="w-5 h-5 text-yellow-500" />
                                        <div>
                                            <p className="text-sm font-medium text-black/60">Driver Name</p>
                                            <p className="text-black">{ride.driverId?.username || 'Not assigned'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <Car className="w-5 h-5 text-yellow-500" />
                                        <div>
                                            <p className="text-sm font-medium text-black/60">Vehicle Details</p>
                                            <p className="text-black">
                                                {ride.driverId?.vehicleType || 'Not provided'} - {ride.driverId?.vehicleNumber || 'No vehicle number'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <Phone className="w-5 h-5 text-yellow-500" />
                                        <div>
                                            <p className="text-sm font-medium text-black/60">Contact Number</p>
                                            <p className="text-black">{ride.driverId?.phoneNumber || 'Not provided'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Scheduled Time */}
                                <div className="text-sm text-black/60">
                                    Scheduled for: {new Date(ride.scheduledDateTime).toLocaleString()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyAcceptedRides;
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ManageRides() {
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

            console.log(`Attempting ${action} for ride request ${rideRequestId}`);

            const response = await axios.patch(
                `http://localhost:5000/api/admin/riderequest/${rideRequestId}/${action}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log('Action response:', response.data);
            setSuccessMessage(response.data.msg);
            fetchRideRequests(); // Refresh ride requests list
        } catch (err) {
            console.error(`Error performing ${action}:`, err);
            setError(err.response?.data?.msg || err.message || `Error performing ${action}`);
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div style={{ padding: '1rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Manage Ride Requests</h2>
            {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
            {successMessage && (
                <p
                    style={{
                        backgroundColor: '#d4edda',
                        border: '1px solid #c3e6cb',
                        color: '#155724',
                        padding: '0.75rem',
                        borderRadius: '0.25rem',
                        marginBottom: '1rem',
                    }}
                >
                    {successMessage}
                </p>
            )}
            <ul style={{ listStyleType: 'none', padding: 0 }}>
    {rideRequests.length ? (
        rideRequests.map((request) => (
            <li
                key={request._id}
                style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem', borderRadius: '0.25rem' }}
            >
                <p style={{ fontWeight: 'bold' }}>
                    Pickup: {request.pickup?.address || 'Pickup address not available'}
                </p>
                <p>
                    Dropoff: {request.dropoff?.address || 'Dropoff address not available'}
                </p>
                <p>Vehicle Type: {request.vehicleType}</p>
                <p>Passengers: {request.numPassengers}</p>
                <p>User: {request.userId ? request.userId.username : 'N/A'}</p>
                <p>Driver: {request.driverId ? request.driverId.username : 'Not Assigned'}</p>
                <p>Status: {request.status}</p>
                <p>Date: {new Date(request.createdAt).toLocaleDateString()}</p>

                {/* <div style={{ marginTop: '0.5rem' }}>
                    {request.status === 'pending' && (
                        <>
                            <button
                                onClick={() => handleAction('accept', request._id)}
                                style={{ marginRight: '0.5rem', backgroundColor: '#28a745', color: 'white' }}
                            >
                                Accept
                            </button>
                            <button
                                onClick={() => handleAction('reject', request._id)}
                                style={{ marginRight: '0.5rem', backgroundColor: '#dc3545', color: 'white' }}
                            >
                                Reject
                            </button>
                        </>
                    )}
                    {request.status === 'accepted' && (
                        <button
                            onClick={() => handleAction('complete', request._id)}
                            style={{ marginRight: '0.5rem', backgroundColor: '#007bff', color: 'white' }}
                        >
                            Mark as Completed
                        </button>
                    )}
                </div> */}
            </li>
        ))
    ) : (
        <p>No ride requests found.</p>
    )}
</ul>
        </div>
    );
}

export default ManageRides;

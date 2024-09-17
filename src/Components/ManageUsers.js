import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Function to fetch users
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token'); // Retrieve JWT from localStorage

                if (!token) {
                    throw new Error('No token found, please log in.');
                }

                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/users`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                setUsers(response.data);
            } catch (err) {
                // Handle specific error messages if available
                setError(err.response?.data?.msg || 'Error fetching users');
                console.error('Error fetching users:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Manage Users</h2>
            <ul>
                {users.length ? (
                    users.map(user => (
                        <li key={user._id}>{user.username} ({user.email})</li>
                    ))
                ) : (
                    <p>No users found.</p>
                )}
            </ul>
        </div>
    );
}

export default ManageUsers;


// export default ManageUsers;
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found, please log in.');
            }

            const response = await axios.get('http://localhost:5000/api/admin/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError(err.response?.data?.msg || err.message || 'Error fetching users');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (action, userId) => {
        try {
            setError(null);
            setSuccessMessage('');
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found, please log in.');
            }

            console.log(`Attempting ${action} for user ${userId}`);

            const response = await axios.patch(
                `http://localhost:5000/api/admin/user/${userId}/${action}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log('Action response:', response.data);
            setSuccessMessage(response.data.msg);
            fetchUsers(); // Refresh user list
        } catch (err) {
            console.error(`Error performing ${action}:`, err);
            setError(err.response?.data?.msg || err.message || `Error performing ${action}`);
        }
    };

    // const deleteUser = async (userId) => {
    //     try {
    //         setError(null);
    //         setSuccessMessage('');
    //         const token = localStorage.getItem('token');
    //         if (!token) {
    //             throw new Error('No token found, please log in.');
    //         }

    //         console.log(`Attempting to delete user ${userId}`);

    //         const response = await axios.delete(
    //             `http://localhost:5000/api/admin/user/${userId}`,
    //             { headers: { Authorization: `Bearer ${token}` } }
    //         );

    //         console.log('Delete response:', response.data);
    //         setSuccessMessage(response.data.msg);
    //         fetchUsers(); // Refresh user list
    //     } catch (err) {
    //         console.error('Error deleting user:', err);
    //         setError(err.response?.data?.msg || err.message || 'Error deleting user');
    //     }
    // };

    if (loading) return <p>Loading...</p>;

    return (
        <div style={{padding: '1rem'}}>
            <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem'}}>Manage Users</h2>
            {error && <p style={{color: 'red', marginBottom: '1rem'}}>{error}</p>}
            {successMessage && (
                <p style={{backgroundColor: '#d4edda', border: '1px solid #c3e6cb', color: '#155724', padding: '0.75rem', borderRadius: '0.25rem', marginBottom: '1rem'}}>
                    {successMessage}
                </p>
            )}
            <ul style={{listStyleType: 'none', padding: 0}}>
                {users.length ? (
                    users.map((user) => (
                        <li key={user._id} style={{border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem', borderRadius: '0.25rem'}}>
                            <p style={{fontWeight: 'bold'}}>{user.username} ({user.email})</p>
                            <p>Role: {user.role}</p>
                            <p>Status: {user.isActive ? 'Active' : 'Inactive'}</p>
                            <div style={{marginTop: '0.5rem'}}>
                                <button onClick={() => handleAction(user.isActive ? 'deactivate' : 'activate', user._id)} style={{marginRight: '0.5rem'}}>
                                    {user.isActive ? 'Deactivate' : 'Activate'}
                                </button>
                                <button onClick={() => handleAction(user.role === 'admin' ? 'demote' : 'promote', user._id)} style={{marginRight: '0.5rem'}}>
                                    {user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                                </button>
                                {/* <button onClick={() => deleteUser(user._id)} style={{backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '0.375rem 0.75rem', borderRadius: '0.25rem'}}>
                                    Delete User
                                </button> */}
                            </div>
                        </li>
                    ))
                ) : (
                    <p>No users found.</p>
                )}
            </ul>
        </div>
    );
}

export default ManageUsers;
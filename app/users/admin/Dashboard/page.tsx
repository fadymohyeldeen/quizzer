'use client'; // Add this to mark this component as a client-side component

import { useAuth } from '../../../../context/AuthContext';

export default function Dashboard() {
    const { user, token, logout } = useAuth();
    const handleLogout = () => {
      logout();  // Call the logout function when the user clicks logout
  };
    return (
        <div>
            <h1>Welcome to the Dashboard</h1>
            {user ? (
                <>
                    <p>User ID: {user.id}</p>
                    <p>Email: {user.email}</p>
                    <p>User Name: {user.userName}</p>
                    <p>Token: {token}</p>
                    <button onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <p>Loading user data...</p>
            )}
        </div>
    );
}

interface UserResponse {
    id: number;
    email: string;
    user_name: string;
    role: string;
}

interface LoginResponse {
    user: UserResponse;
    token: string;
}

const API_URL = 'http://localhost:5000';

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/user/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Login failed');
    }

    return response.json();
}

export async function getCurrentUser(token: string): Promise<UserResponse> {
    if (!token) {
        throw new Error('No authentication token provided');
    }

    const userData = localStorage.getItem('user');
    const parsedData = userData ? JSON.parse(userData) : null;
    
    if (!parsedData?.id) {
        throw new Error('User ID not found');
    }

    const response = await fetch(`${API_URL}/user/${parsedData.id}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to fetch user data');
    }

    return response.json();
}

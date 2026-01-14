const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getAuthHeaders = () => {
    const token = localStorage.getItem('skillroute_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const api = {
    async post(endpoint: string, data: any) {
        const headers = {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        };
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                // Handle logout if needed
            }

            let errorMessage = 'API Request Failed';
            try {
                const errorData = await response.json();
                errorMessage = errorData.details || errorData.error || errorData.message || errorMessage;
            } catch (e) {
                // If response is not JSON (e.g. 500 HTML page from Render/Vercel)
                errorMessage = `Server Error (${response.status}): ${response.statusText}`;
            }

            console.error(`API Error [${endpoint}]:`, errorMessage);
            throw new Error(errorMessage);
        }

        return response.json();
    },

    async get(endpoint: string) {
        const headers = {
            ...getAuthHeaders()
        };
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'GET',
            headers
        });

        if (!response.ok) {
            throw new Error('API Request Failed');
        }
        return response.json();
    }
};

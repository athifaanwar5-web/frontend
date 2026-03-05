import { api } from './api';

class AuthService {
    async register(payload: any) {
        const res = await api.post('/auth/register/', payload);
        const data = await res.json();

        if (res.ok) {
            if (typeof window !== 'undefined') {
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh);
                localStorage.setItem('user_role', data.role);
            }
            return { success: true, data };
        } else {
            const errorMsg = data.username ? `Username: ${data.username[0]}` :
                data.email ? `Email: ${data.email[0]}` :
                    data.password ? `Password: ${data.password[0]}` :
                        "Registration failed. Please try again.";
            throw new Error(errorMsg);
        }
    }

    // You can add login, logout, etc. here in the future
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new AuthService();

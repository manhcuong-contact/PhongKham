// d:\PhongKham\public\js\api.js

const API_BASE_URL = 'http://localhost:3000/api/v1';

// Lấy Token từ localStorage
const getAccessToken = () => localStorage.getItem('accessToken');
const getRefreshToken = () => localStorage.getItem('refreshToken');
const setTokens = (access, refresh) => {
    if(access) localStorage.setItem('accessToken', access);
    if(refresh) localStorage.setItem('refreshToken', refresh);
};
const clearTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
};

// Hàm fetch lõi có gắn token
async function fetchAPI(endpoint, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    const token = getAccessToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers
    };

    // Nếu truyền FormData thì bỏ Content-Type mặc định để browser tự set boundary
    if (options.body instanceof FormData) {
        delete config.headers['Content-Type'];
    }

    try {
        let response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        // Xử lý Hết hạn Token (401)
        if (response.status === 401) {
            const refresh = getRefreshToken();
            if (refresh && !options._retry) {
                // Thử làm mới token
                try {
                    const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ refreshToken: refresh })
                    });
                    
                    if (refreshRes.ok) {
                        const refreshData = await refreshRes.json();
                        setTokens(refreshData.data.accessToken, refreshData.data.refreshToken);
                        // Thử gọi lại request ban đầu với token mới
                        config.headers['Authorization'] = `Bearer ${refreshData.data.accessToken}`;
                        config._retry = true;
                        response = await fetch(`${API_BASE_URL}${endpoint}`, config);
                    } else {
                        throw new Error('Refresh failed');
                    }
                } catch (e) {
                    // Nếu refresh cũng lỗi -> Đăng xuất
                    clearTokens();
                    window.location.href = '/login.html';
                    return null;
                }
            } else {
                clearTokens();
                window.location.href = '/login.html';
                return null;
            }
        }

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Có lỗi xảy ra');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Export object chứa các hàm gọi API tiện lợi
const api = {
    // Auth
    login: (email, password) => fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    getMe: () => fetchAPI('/auth/me'),
    
    // Admin Dashboard
    getDashboardStats: () => fetchAPI('/admin/dashboard'),
    getRecentAppointments: () => fetchAPI('/admin/appointments/recent'),
    
    // Public
    getClinics: () => fetchAPI('/clinics'),
    getDoctors: () => fetchAPI('/doctors'),
    getSpecialties: () => fetchAPI('/specialties')
};

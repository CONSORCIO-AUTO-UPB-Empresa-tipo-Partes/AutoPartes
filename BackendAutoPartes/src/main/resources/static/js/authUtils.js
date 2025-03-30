// Save auth data to local storage
function saveAuthData(data) {
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('userEmail', data.email);
    localStorage.setItem('userType', data.userType);
    localStorage.setItem('tokenExpiry', data.expiresAt);
}

// Clear auth data from local storage
function clearAuthData() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userType');
    localStorage.removeItem('tokenExpiry');
}

// Get the auth token
function getAuthToken() {
    return localStorage.getItem('authToken');
}

// Get the user type
function getUserType() {
    return localStorage.getItem('userType');
}

// Check if user is authenticated
function isAuthenticated() {
    const token = getAuthToken();
    return !!token;
}

// Add auth header to fetch options
function withAuth(options = {}) {
    const token = getAuthToken();
    if (!token) return options;

    const headers = options.headers || {};
    return {
        ...options,
        headers: {
            ...headers,
            'Authorization': `Bearer ${token}`
        }
    };
}

// Fetch with authentication
function fetchWithAuth(url, options = {}) {
    return fetch(url, withAuth(options))
        .then(response => {
            if (response.status === 401) {
                // Token expired or invalid
                clearAuthData();
                window.location.href = '/InicioSesionCliente.html';
                throw new Error('Session expired');
            }
            return response;
        });
}

// Logout function
function logout() {
    // Call backend to invalidate token (optional)
    const token = getAuthToken();
    if (token) {
        fetch('/api/auth/logout', withAuth({ method: 'POST' }))
            .catch(error => console.error('Logout error:', error));
    }

    // Clear local storage and redirect
    clearAuthData();
    window.location.href = '/InicioSesionCliente.html';
}

// Check authentication on page load
function checkAuth(requiredUserType = null) {
    const token = getAuthToken();
    if (!token) {
        window.location.href = '/InicioSesionCliente.html';
        return;
    }

    // Validate token on backend
    fetch(`/api/auth/validate?token=${token}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Invalid token');
            }
            return response.text();
        })
        .then(result => {
            if (result !== "Token válido") {
                throw new Error('Invalid token');
            }

            // If specific user type is required, check it
            if (requiredUserType) {
                const userType = getUserType();
                if (userType !== requiredUserType) {
                    window.location.href = '/InicioSesionCliente.html';
                }
            }
        })
        .catch(error => {
            console.error('Auth check failed:', error);
            clearAuthData();
            window.location.href = '/InicioSesionCliente.html';
        });
}

document.addEventListener('DOMContentLoaded', function() {
    // Add logout button to navbar if user is authenticated
    const token = localStorage.getItem('authToken');
    if (token) {
        const navbar = document.querySelector('.navbar-nav');
        if (navbar) {
            const userEmail = localStorage.getItem('userEmail');

            // Create user info element
            const userInfoElement = document.createElement('li');
            userInfoElement.className = 'nav-item dropdown';
            userInfoElement.innerHTML = `
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                    <i class="fas fa-user"></i> ${userEmail}
                </a>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#" id="logout-button">Cerrar sesión</a></li>
                </ul>
            `;
            navbar.appendChild(userInfoElement);

            // Add logout event listener
            document.getElementById('logout-button').addEventListener('click', function(e) {
                e.preventDefault();
                logout();
            });
        }
    }
});
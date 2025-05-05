// Función para cambiar el modo
function toggleMode() {
    const body = document.body;
    body.classList.toggle("modo-claro");

    // Guardar el estado del modo en localStorage
    if (body.classList.contains("modo-claro")) {
        localStorage.setItem("modo", "claro");
    } else {
        localStorage.setItem("modo", "oscuro");
    }
}

// Aplicar el modo guardado al cargar la página
function aplicarModoGuardado() {
    const modoGuardado = localStorage.getItem("modo");
    if (modoGuardado === "claro") {
        document.body.classList.add("modo-claro");
    }
}

// Llamar a la función al cargar la página
aplicarModoGuardado();

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    if (token) {
        // Validate token on backend
        validateToken(token);
    }

    // Get login form elements
    const loginForm = document.querySelector('.login-container');
    const emailInput = document.querySelector('input[type="text"]');
    const passwordInput = document.querySelector('input[type="password"]');
    const loginButton = document.querySelector('.login-container button');

    // Add login form submission handler
    loginButton.addEventListener('click', function(e) {
        e.preventDefault();
        login(emailInput.value, passwordInput.value);
    });

    // Toggle dark/light mode
    window.toggleMode = function() {
        document.body.classList.toggle('dark-mode');
    };
});

// Function to login user
function login(email, password) {
    // Validate form fields
    if (!email || !password) {
        showError('Por favor complete todos los campos');
        return;
    }

    // Send login request to backend
    fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Credenciales inválidas');
            }
            return response.json();
        })
        .then(data => {
            // Save token in local storage
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userEmail', data.email);
            localStorage.setItem('userType', data.userType);
            localStorage.setItem('tokenExpiry', data.expiresAt);

            // Redirect based on user type
            redirectBasedOnUserType(data.userType);
        })
        .catch(error => {
            showError(error.message);
        });
}

// Validate token with backend
function validateToken(token) {
    fetch(`/api/auth/validate?token=${token}`)
        .then(response => response.text())
        .then(data => {
            if (data === "Token válido") {
                // Token is still valid, redirect based on stored user type
                const userType = localStorage.getItem('userType');
                redirectBasedOnUserType(userType);
            } else {
                // Token invalid, clear storage
                localStorage.removeItem('authToken');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userType');
                localStorage.removeItem('tokenExpiry');
            }
        })
        .catch(error => {
            console.error('Error validating token:', error);
        });
}

// Redirect user based on user type
function redirectBasedOnUserType(userType) {
    console.log("Redirecting based on userType:", userType); // Log the userType being checked
    // Normalize userType for comparison (e.g., trim and uppercase)
    const normalizedUserType = (userType || '').trim().toUpperCase();
    console.log("Normalized userType for switch:", normalizedUserType);

    switch(normalizedUserType) {
        case 'BODEGUERO':
        case 'ROLE_BODEGUERO':
            window.location.href = 'Bodeguero.html';
            break;
        case 'ADMIN': // Added case for ADMIN
        case 'ADMINISTRADOR':
        case 'ADMNISTRADOR': // Added exact match for ADMNISTRADOR
        case 'ROLE_ADMINISTRADOR':
            window.location.href = 'Admin.html';
            break;
        case 'SECRETARIA':
        case 'ROLE_SECRETARIA':
            window.location.href = 'Secretaria.html';
            break;
        case 'CLIENTE':
        case 'ROLE_CLIENTE':
        default:
            // Check if it's an unknown but non-client employee type before defaulting to client view
            if (normalizedUserType && normalizedUserType !== 'CLIENTE' && normalizedUserType !== 'ROLE_CLIENTE') {
                console.warn(`Unknown employee userType '${userType}', redirecting to default employee page or showing error.`);
                // Decide on a fallback for unknown employee types, e.g., show error or a generic employee page
                // For now, let's redirect to login with an error message
                showError(`Tipo de usuario empleado desconocido: ${userType}`);
                // Optional: Clear local storage if login should be forced
                // localStorage.clear();
                // window.location.href = 'InicioSesionCliente.html'; // Or stay on page
            } else {
                // Default to client catalog page for CLIENT or truly unknown/null types
                window.location.href = 'Catalogo.html';
            }
            break;
    }
}

// Display error message
function showError(message) {
    // Check if error element exists, if not create it
    let errorElement = document.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        const loginContainer = document.querySelector('.login-container');
        loginContainer.insertBefore(errorElement, loginContainer.querySelector('button'));
    }

    errorElement.textContent = message;
    errorElement.style.display = 'block';

    // Hide error after 3 seconds
    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 3000);
}
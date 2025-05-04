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
    switch(userType) {
        case 'CLIENTE':
            window.location.href = 'Catalogo.html';
            break;
        case 'BODEGUERO':
            window.location.href = 'Bodeguero.html';
            break;
        case 'ADMINISTRADOR':
            window.location.href = 'Admin.html';
            break;
        default:
            window.location.href = 'Catalogo.html';
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
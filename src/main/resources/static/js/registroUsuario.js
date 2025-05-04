document.addEventListener('DOMContentLoaded', function() {
    // Apply saved theme mode on page load
    aplicarModoGuardado();

    // Add form submission handler
    const registrationForm = document.getElementById('formRegistroUsuario');
    if (registrationForm) {
        registrationForm.addEventListener('submit', handleRegistration);
    }
});

// Function to toggle between light and dark mode
function toggleMode() {
    const body = document.body;
    body.classList.toggle("modo-claro");

    // Save mode state in localStorage
    if (body.classList.contains("modo-claro")) {
        localStorage.setItem("modo", "claro");
    } else {
        localStorage.setItem("modo", "oscuro");
    }
}

// Apply saved mode when loading the page
function aplicarModoGuardado() {
    const modoGuardado = localStorage.getItem("modo");
    if (modoGuardado === "claro") {
        document.body.classList.add("modo-claro");
    }
}

// Show error message
function showError(message) {
    const errorElement = document.getElementById('error-message');
    errorElement.textContent = message;
    errorElement.style.display = 'block';

    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 5000);
}

// Show success message
function showSuccess(message) {
    const successElement = document.getElementById('success-message');
    successElement.textContent = message;
    successElement.style.display = 'block';
}

// Handle registration form submission
function handleRegistration(event) {
    event.preventDefault();

    // Get form field values
    const personName = document.getElementById("personName").value;
    const phonenumber = document.getElementById("phonenumber").value;
    const personaddress = document.getElementById("personaddress").value;
    const typedocument = document.getElementById("typedocument").value;
    const iddocument = document.getElementById("iddocument").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Validate passwords match
    if (password !== confirmPassword) {
        showError("Las contraseñas no coinciden. Por favor, inténtalo de nuevo.");
        return;
    }

    // Create registration data object
    const registrationData = {
        email: email,
        password: password,
        personname: personName,
        iddocument: iddocument,
        typedocument: typedocument,
        phonenumber: phonenumber,
        personaddress: personaddress,
        persontype: "Cliente",
        usertypeId: 1 // ID for client user type
    };

    // Send registration request to backend
    fetch('/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(registrationData)
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text || 'Error en el registro') });
        }
        return response.text();
    })
    .then(data => {
        showSuccess('¡Registro exitoso! Redirigiendo al inicio de sesión...');

        // Redirect after 2 seconds
        setTimeout(() => {
            window.location.href = 'InicioSesionCliente.html';
        }, 2000);
    })
    .catch(error => {
        console.error('Error en el registro:', error);
        showError('Error en el registro: ' + (error.message || 'Problema de conexión con el servidor'));
    });
}
// Función para inicializar el modo claro/oscuro
function initModoClaro() {
    const modoGuardado = localStorage.getItem("modo");
    if (modoGuardado === "claro") {
        document.body.classList.add("modo-claro");
    }

    const toggleBtn = document.querySelector('.toggle-mode');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleMode);
    }
}

// Función para cambiar entre modo claro y oscuro
function toggleMode() {
    const body = document.body;
    body.classList.toggle("modo-claro");

    // Guardar la preferencia en localStorage
    localStorage.setItem("modo", body.classList.contains("modo-claro") ? "claro" : "oscuro");
}

// Función para enviar datos al backend
async function saveDataToBackend() {
    const formData = {
        name: document.getElementById('name').value,
        lastname: document.getElementById('lastname').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        documentType: document.getElementById('documentType').value,
        document: document.getElementById('document').value,
        password: document.getElementById('password').value,
    };

    try {
        const response = await fetch('/api/save-profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            document.getElementById('confirmationMessage').style.display = 'block';
            setTimeout(() => {
                document.getElementById('confirmationMessage').style.display = 'none';
            }, 3000);
        } else {
            alert('Error al guardar los datos.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al conectar con el servidor.');
    }
}

// Función para guardar los datos en localStorage
function saveDataToLocalStorage() {
    const formData = {
        name: document.getElementById('name').value,
        lastname: document.getElementById('lastname').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        documentType: document.getElementById('documentType').value,
        document: document.getElementById('document').value,
        password: document.getElementById('password').value,
    };
    localStorage.setItem('profileData', JSON.stringify(formData));
}

// Función para cargar los datos desde localStorage
function loadDataFromLocalStorage() {
    const savedData = localStorage.getItem('profileData');
    if (savedData) {
        const formData = JSON.parse(savedData);
        document.getElementById('name').value = formData.name || '';
        document.getElementById('lastname').value = formData.lastname || '';
        document.getElementById('email').value = formData.email || '';
        document.getElementById('phone').value = formData.phone || '';
        document.getElementById('address').value = formData.address || '';
        document.getElementById('documentType').value = formData.documentType || '';
        document.getElementById('document').value = formData.document || '';
        document.getElementById('password').value = formData.password || '';
    }
}

// Función para validar el formulario
function validateForm() {
    const form = document.getElementById('profileForm');
    const email = document.getElementById('email').value;

    if (!email.includes('@')) {
        alert('El correo electrónico debe contener un "@".');
        return false;
    }

    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return false;
    }

    return true;
}

// Función para manejar el envío del formulario
function setupFormSubmit() {
    document.getElementById('profileForm').addEventListener('submit', function(event) {
        event.preventDefault();

        if (validateForm()) {
            saveDataToLocalStorage();
            saveDataToBackend();

            document.getElementById('confirmationMessage').style.display = 'block';
            setTimeout(() => {
                document.getElementById('confirmationMessage').style.display = 'none';
            }, 3000);
        }
    });
}

// Función para cargar datos desde el backend
async function loadDataFromBackend() {
    try {
        const response = await fetch('/api/get-profile');
        if (response.ok) {
            const formData = await response.json();
            document.getElementById('name').value = formData.name || '';
            document.getElementById('lastname').value = formData.lastname || '';
            document.getElementById('email').value = formData.email || '';
            document.getElementById('phone').value = formData.phone || '';
            document.getElementById('address').value = formData.address || '';
            document.getElementById('documentType').value = formData.documentType || '';
            document.getElementById('document').value = formData.document || '';
            document.getElementById('password').value = formData.password || '';
        }
    } catch (error) {
        console.error('Error:', error);
        // Si hay error, cargar de localStorage como fallback
        loadDataFromLocalStorage();
    }
}

// Inicialización cuando se carga la página
window.addEventListener('DOMContentLoaded', function() {
    initModoClaro(); // Inicializar el modo claro/oscuro
    setupFormSubmit(); // Configurar el envío del formulario

    // Intentar cargar datos del backend primero, si falla cargar de localStorage
    loadDataFromBackend().catch(() => {
        loadDataFromLocalStorage();
    });
});
// Variables globales
let empleados = [];
let editando = false;
let empleadoEditando = null;
let userTypes = []; // Lista de tipos de usuario disponibles

// Verificar si hay un usuario autenticado al cargar la página
document.addEventListener('DOMContentLoaded', async function() { // Added async
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        console.log("No auth token found, redirecting to login.");
        // No alert needed here, just redirect
        window.location.href = 'InicioSesionEmpleados.html';
        return;
    }

    // Keep fetching user info to update local storage and display name/image
    let userName = 'Usuario'; // Default name
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
        try {
            const response = await fetch(`/api/auth/user-info?email=${encodeURIComponent(userEmail)}`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            if (!response.ok) {
                 if (response.status === 401 || response.status === 403) {
                    console.log("Token invalid/expired during user info fetch, redirecting.");
                    localStorage.clear(); // Clear invalid token etc.
                    window.location.href = 'InicioSesionEmpleados.html';
                    return; // Stop execution
                 }
                 // Don't throw error for non-auth issues, just log and continue
                 console.error(`Error fetching user info: ${response.status}`);
                 // Fallback to local storage if fetch fails
                 const userDataStr = localStorage.getItem('user');
                 if (userDataStr) {
                     try {
                         const userData = JSON.parse(userDataStr);
                         userName = userData.name || userData.email || 'Usuario';
                     } catch (e) { console.error('Error parsing user data from local storage:', e); }
                 }
            } else {
                const userData = await response.json();
                localStorage.setItem('user', JSON.stringify(userData)); // Update local storage
                userName = userData.name || userData.email || 'Usuario';
                console.log("User info fetched successfully:", userData);
            }
        } catch (error) {
            console.error('Network or other error fetching user info, trying local storage:', error);
            // Fallback to local storage on network error
            const userDataStr = localStorage.getItem('user');
            if (userDataStr) {
                try {
                    const userData = JSON.parse(userDataStr);
                    userName = userData.name || userData.email || 'Usuario';
                } catch (e) { console.error('Error parsing user data from local storage:', e); }
            }
        }
    } else {
        // Fallback if email is not in local storage
        const userDataStr = localStorage.getItem('user');
        if (userDataStr) {
             try {
                 const userData = JSON.parse(userDataStr);
                 userName = userData.name || userData.email || 'Usuario';
             } catch (e) { console.error('Error parsing user data from local storage:', e); }
        }
    }

    console.log("User is authenticated. Proceeding with page load.");

    // Update username display
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        userNameElement.textContent = userName;
    }

    // --- Continue with page setup ---
    verificarModo();

    // Load data sequentially
    try {
        await cargarTiposUsuario();
        await cargarEmpleados();
    } catch (error) {
        // Errors including auth errors during data load are handled within the functions
        console.error("Error during initial data loading sequence:", error);
        // Avoid duplicate messages if already handled by redirection
        if (!window.location.href.endsWith('InicioSesionEmpleados.html')) {
             mostrarMensaje("Error al cargar datos iniciales: " + error.message, "danger");
        }
    }

    // Load user image
    const userImage = localStorage.getItem('userImage');
    const userImageElement = document.querySelector('#userInfo img');
    if (userImage && userImageElement) {
        userImageElement.src = userImage;
    }
});

// Cargar tipos de usuario
async function cargarTiposUsuario() {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) { // Add check before fetch
        handleAuthError('cargar tipos de usuario');
        return; // Stop execution if no token
    }
    console.log("Attempting to load user types...");
    try {
        const response = await fetch('/api/usertype', {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        // Use handleResponse for consistent error checking
        const data = await handleResponse(response, 'cargar tipos de usuario');
        if (!data) return; // Stop if handleResponse redirected

        // Filter and store, ensuring usertypename is treated as a string
        userTypes = data
            .filter(type => type.usertypename && type.usertypename.toUpperCase() !== 'CLIENT')
            .map(type => ({ ...type, usertypename: String(type.usertypename) })); // Ensure string type

        const selectRol = document.getElementById('rolUsuario');
        selectRol.innerHTML = ''; // Clear existing options

        userTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type.usertypename;
            option.textContent = type.usertypename;
            selectRol.appendChild(option);
        });
        console.log("User types loaded and processed successfully:", JSON.stringify(userTypes)); // Log success and data
    } catch (error) {
        console.error('Error detallado al cargar tipos de usuario:', error);
        if (!error.handled) { // Avoid double alerts if handleResponse already did
            mostrarMensaje('Error al cargar tipos de usuario. Detalles: ' + error.message, 'warning');
        }
        // Fallback logic remains the same...
        const defaultRoles = ['ADMINISTRATOR', 'SECRETARY', 'EMPLOYEE'];
        const selectRol = document.getElementById('rolUsuario');
        selectRol.innerHTML = '';
        defaultRoles.forEach(role => {
            const option = document.createElement('option');
            option.value = role;
            option.textContent = role;
            selectRol.appendChild(option);
        });
        userTypes = defaultRoles.map(role => ({ usertypename: role }));
        console.warn("Fell back to default user types:", JSON.stringify(userTypes));
        // Do not re-throw if handled, let the flow continue if possible or stop if redirected
        // throw error;
    }
}

// Cargar empleados
async function cargarEmpleados() {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) { // Add check before fetch
        handleAuthError('cargar empleados');
        return;
    }
    console.log("Attempting to load employees...");
    try {
        const response = await fetch('/api/persons/employees', {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await handleResponse(response, 'cargar empleados');
        if (!data) return; // Stop if handleResponse redirected

        // Ensure usertype is treated as a string for filtering and later comparison
        empleados = data.filter(empleado => {
            const personType = (empleado.persontype || '').toUpperCase();
            const userType = String(empleado.usertype || '').toUpperCase(); // Ensure string and uppercase
            return personType !== 'CLIENT' && userType !== 'CLIENT';
        }).map(emp => ({ ...emp, usertype: String(emp.usertype || '') })); // Ensure string type in the final array

        console.log("Employees loaded and processed successfully:", JSON.stringify(empleados));
        actualizarTablaEmpleados(); // Update table AFTER employees are loaded
    } catch (error) {
        console.error('Error loading employees:', error);
        if (!error.handled) {
            mostrarMensaje('Error al cargar empleados: ' + error.message, 'danger');
        }
        // Do not re-throw if handled
        // throw error;
    }
}

// Actualizar tabla empleados
function actualizarTablaEmpleados() {
    const tablaBody = document.getElementById('tablaEmpleadosBody');
    tablaBody.innerHTML = '';
    console.log(`Updating employee table. ${userTypes.length} user types available:`, JSON.stringify(userTypes));

    if (!userTypes || userTypes.length === 0) {
        console.warn("Cannot update roles properly because userTypes array is empty or not loaded.");
    }

    empleados.forEach(empleado => {
        const nombreCompleto = (empleado.personname || '').split(' ');
        const nombre = nombreCompleto[0] || '';
        const apellido = nombreCompleto.slice(1).join(' ') || '';

        // Ensure employee usertype is a string and trimmed for comparison
        const empleadoUserTypeRaw = empleado.usertype;
        const empleadoUserTypeProcessed = typeof empleadoUserTypeRaw === 'string' ? empleadoUserTypeRaw.trim() : '';

        let displayRole = 'No asignado'; // Default value
        console.log(`Processing employee ${empleado.iddocument}, raw usertype: '${empleadoUserTypeRaw}', processed: '${empleadoUserTypeProcessed}'`);

        if (empleadoUserTypeProcessed && userTypes && userTypes.length > 0) {
            const processedEmployeeTypeUpper = empleadoUserTypeProcessed.toUpperCase();
            // Find matching type, comparing trimmed and uppercase versions
            const matchingType = userTypes.find(type => {
                const typeNameProcessed = (type.usertypename || '').trim();
                const typeNameUpper = typeNameProcessed.toUpperCase();
                return typeNameUpper === processedEmployeeTypeUpper;
            });

            if (matchingType) {
                displayRole = matchingType.usertypename; // Use the original name from the loaded types
                console.log(` -> Match found: Displaying role as '${displayRole}'`);
            } else {
                // Fallback if the type is not in the loaded list
                displayRole = empleadoUserTypeProcessed || 'No asignado'; // Use processed type or default
                console.warn(` -> No matching type found in userTypes array for processed type '${empleadoUserTypeProcessed}'. Displaying as '${displayRole}'.`);
            }
        } else if (!empleadoUserTypeProcessed) {
            console.warn(` -> Employee ${empleado.iddocument} has null, empty, or non-string usertype after processing.`);
        } else {
            console.warn(` -> userTypes array is empty or not yet loaded when processing employee ${empleado.iddocument}.`);
        }

        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${empleado.iddocument}</td>
            <td>${nombre}</td>
            <td>${apellido}</td>
            <td>${displayRole}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="prepararEdicion('${empleado.iddocument}')">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarEmpleado('${empleado.iddocument}')">Eliminar</button>
            </td>
        `;
        tablaBody.appendChild(fila);
    });
    console.log("Employee table update complete.");
}

// Manejar formulario de registro/edición
document.getElementById('formAgregarEmpleado').addEventListener('submit', async function(event) {
    event.preventDefault();

    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        handleAuthError('guardar empleado');
        return;
    }

    const nombre = document.getElementById('nombreEmpleado').value;
    const apellido = document.getElementById('apellidoEmpleado').value;
    const email = document.getElementById('emailEmpleado').value;
    const password = document.getElementById('passwordEmpleado').value;
    const telefono = document.getElementById('telefonoEmpleado').value;
    const direccion = document.getElementById('direccionEmpleado').value;
    const tipoDocumento = document.getElementById('tipoDocumento').value;
    const rol = document.getElementById('rolUsuario').value;
    const idDocumento = document.getElementById('idEmpleado').value;

    if (!nombre || !apellido || !email || !idDocumento || !telefono) {
        mostrarMensaje('Por favor complete los campos obligatorios', 'warning');
        return;
    }

    if (!editando && !password) {
        mostrarMensaje('La contraseña es obligatoria para nuevos empleados', 'warning');
        return;
    }

    const personaData = {
        iddocument: idDocumento,
        name: nombre,
        lastname: apellido,
        email: email,
        password: password || null,
        phone: telefono,
        address: direccion,
        typedocument: tipoDocumento,
        persontype: 'EMPLOYEE',
        usertype: rol
    };

    const method = editando ? 'PUT' : 'POST';
    const url = editando ? `/api/persons/${empleadoEditando}` : '/api/persons';
    const actionDescription = editando ? 'actualizar empleado' : 'registrar empleado';

    try {
        console.log(`Attempting to ${actionDescription} with data:`, personaData);
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(personaData)
        });

        if (response.ok && (response.status === 200 || response.status === 201)) {
            console.log(`${actionDescription} successful with status ${response.status}.`);

            mostrarMensaje(editando ? 'Empleado actualizado correctamente' : 'Empleado registrado correctamente', 'success');
            document.getElementById('formAgregarEmpleado').reset();
            editando = false;
            empleadoEditando = null;
            document.getElementById('idEmpleado').disabled = false;
            document.querySelector('#formAgregarEmpleado button[type="submit"]').textContent = 'Agregar empleado';

            try {
                await cargarEmpleados();
            } catch (loadError) {
                console.error("Error reloading employees after save:", loadError);
                if (!loadError.handled) {
                     mostrarMensaje('Empleado guardado, pero hubo un error al recargar la lista.', 'warning');
                }
            }

        } else {
            console.warn(`${actionDescription} failed with status ${response.status}.`);
            await handleResponse(response, actionDescription);
             if (!window.location.href.endsWith('InicioSesionEmpleados.html')) {
                 mostrarMensaje(`Error ${response.status} al ${actionDescription}.`, 'danger');
             }
        }

    } catch (error) {
        console.error(`Caught error during ${actionDescription}:`, error);
        if (!error.handled && !window.location.href.endsWith('InicioSesionEmpleados.html')) {
            mostrarMensaje(`Error al ${actionDescription}: ${error.message}`, 'danger');
        }
    }
});

// Preparar edición
async function prepararEdicion(id) { // Make async
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        handleAuthError('preparar edición');
        return;
    }

    try {
        const response = await fetch(`/api/persons/${id}`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await handleResponse(response, 'obtener detalles empleado');
        if (!data) return; // Stop if handleResponse redirected

        const nombreCompleto = data.personname.split(' ');
        const nombre = nombreCompleto[0] || '';
        const apellido = nombreCompleto.slice(1).join(' ') || '';

        document.getElementById('nombreEmpleado').value = nombre;
        document.getElementById('apellidoEmpleado').value = apellido;
        document.getElementById('emailEmpleado').value = data.email || '';
        document.getElementById('passwordEmpleado').value = ''; // Clear password field
        document.getElementById('telefonoEmpleado').value = data.phonenumber || '';
        document.getElementById('direccionEmpleado').value = data.personaddress || '';
        document.getElementById('tipoDocumento').value = data.typedocument || 'CC';

        const selectRol = document.getElementById('rolUsuario');
        const userTypeExists = [...selectRol.options].some(option => option.value === data.usertype);
        if (!userTypeExists && data.usertype && userTypes.some(ut => ut.usertypename === data.usertype)) {
            const option = document.createElement('option');
            option.value = data.usertype;
            option.textContent = data.usertype;
            selectRol.appendChild(option);
        }
        selectRol.value = data.usertype && userTypes.some(ut => ut.usertypename === data.usertype) ? data.usertype : (selectRol.options[0]?.value || '');

        document.getElementById('idEmpleado').value = data.iddocument;
        document.getElementById('idEmpleado').disabled = true;

        editando = true;
        empleadoEditando = id;
        document.querySelector('#formAgregarEmpleado button[type="submit"]').textContent = 'Actualizar empleado';

        mostrarAgregar();
    } catch (error) {
        console.error('Error:', error);
        if (!error.handled) {
            mostrarMensaje('Error al preparar edición: ' + error.message, 'danger');
        }
    }
}

// Eliminar empleado
async function eliminarEmpleado(id) { // Make async
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        handleAuthError('eliminar empleado');
        return;
    }

    if (confirm('¿Está seguro de que desea eliminar este empleado?')) {
        try {
            const response = await fetch(`/api/persons/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            await handleResponse(response, 'eliminar empleado', true);
            mostrarMensaje('Empleado eliminado correctamente', 'success');
            await cargarEmpleados();
        } catch (error) {
            console.error('Error:', error);
            if (!error.handled) {
                mostrarMensaje('Error al eliminar empleado: ' + error.message, 'danger');
            }
        }
    }
}

// Consultar empleado
async function consultarEmpleado() { // Make async
    const idConsultar = document.getElementById('idConsultar').value;
    if (!idConsultar) {
        mostrarMensaje('Por favor ingrese un ID para consultar.', 'warning');
        return;
    }

    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        handleAuthError('consultar empleado');
        return;
    }

    const resultadoDiv = document.getElementById('resultadoConsulta');
    resultadoDiv.innerHTML = '';

    try {
        const response = await fetch(`/api/persons/${idConsultar}`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (response.status === 404) {
            throw new Error('Empleado no encontrado.');
        }

        const data = await handleResponse(response, 'consultar empleado');
        if (!data) return;

        const userType = String(data.usertype || '').toUpperCase();
        if (userType === 'CLIENT') {
             resultadoDiv.innerHTML = `<div class="alert alert-warning">El ID corresponde a un cliente, no a un empleado gestionable aquí.</div>`;
             return;
        }

        const nombreCompleto = data.personname.split(' ');
        const nombre = nombreCompleto[0] || '';
        const apellido = nombreCompleto.slice(1).join(' ');
        resultadoDiv.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${nombre} ${apellido}</h5>
                    <p class="card-text"><strong>ID:</strong> ${data.iddocument}</p>
                    <p class="card-text"><strong>Email:</strong> ${data.email || 'No disponible'}</p>
                    <p class="card-text"><strong>Teléfono:</strong> ${data.phonenumber || 'No disponible'}</p>
                    <p class="card-text"><strong>Rol:</strong> ${data.usertype || 'No asignado'}</p>
                    <button class="btn btn-warning btn-sm" onclick="prepararEdicion('${data.iddocument}')">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarEmpleado('${data.iddocument}')">Eliminar</button>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error en consulta:', error);
        if (!error.handled) {
            resultadoDiv.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
        }
    }
}

// --- Helper functions for Auth and Response Handling ---
function handleAuthError(action) {
    console.error(`Authentication error during ${action}. Redirecting.`);
    if (!window.location.href.endsWith('InicioSesionEmpleados.html')) {
        alert("Su sesión ha expirado o no es válida. Por favor, inicie sesión de nuevo.");
        localStorage.clear();
        window.location.href = 'InicioSesionEmpleados.html';
    }
}

async function handleResponse(response, action, allowNoContent = false) {
    if (response.status === 401 || response.status === 403) {
        console.error(`Authorization error during ${action} (${response.status}). Redirecting.`);
        if (!window.location.href.endsWith('InicioSesionEmpleados.html')) {
            alert("Error de autorización. Su sesión puede haber expirado.");
            localStorage.clear();
            window.location.href = 'InicioSesionEmpleados.html';
        }
        const error = new Error(`Authorization required (${response.status})`);
        error.handled = true;
        throw error;
    }
    if (!response.ok && !(allowNoContent && response.status === 204)) {
        let errorMsg = `Error ${response.status} durante ${action}: ${response.statusText}`;
        try {
            const errorBody = await response.json();
            errorMsg = errorBody.message || errorBody.error || `Error ${response.status} durante ${action}`;
        } catch (e) { }
        const error = new Error(errorMsg);
        error.handled = false;
        throw error;
    }
    if (response.status === 204 && allowNoContent) {
        return null;
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        try {
            return await response.json();
        } catch (e) {
            console.error(`Error parsing JSON response during ${action}:`, e);
            const error = new Error(`Respuesta inválida del servidor durante ${action}.`);
            error.handled = false;
            throw error;
        }
    }
    try {
        return await response.text();
    } catch (e) {
        console.error(`Error reading text response during ${action}:`, e);
        const error = new Error(`Error leyendo respuesta del servidor durante ${action}.`);
        error.handled = false;
        throw error;
    }
}

// Modo claro/oscuro
function toggleMode() {
    const body = document.body;
    body.classList.toggle("modo-claro");
    localStorage.setItem("modo", body.classList.contains("modo-claro") ? "claro" : "oscuro");
}

function aplicarModoGuardado() {
    const modoGuardado = localStorage.getItem("modo");
    if (modoGuardado === "claro") {
        document.body.classList.add("modo-claro");
    }
}

function verificarModo() {
    const modoOscuro = localStorage.getItem('modoOscuro') === 'true';
    document.body.classList.toggle('dark-mode', modoOscuro);
}

// Mostrar mensaje
function mostrarMensaje(mensaje, tipo = 'info') {
    const alertPlaceholder = document.createElement('div');
    alertPlaceholder.innerHTML = `<div class="alert alert-${tipo} alert-dismissible fade show mensaje-flotante" role="alert">
                                    ${mensaje}
                                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                 </div>`;
    document.body.append(alertPlaceholder);
    setTimeout(() => {
        const alertInstance = bootstrap.Alert.getOrCreateInstance(alertPlaceholder.querySelector('.alert'));
        if (alertInstance) {
            alertInstance.close();
        }
    }, 5000);
    console.log(`Mensaje mostrado (${tipo}): ${mensaje}`);
}

// Logout
function logout() {
    console.log("Ejecutando logout desde Admin.js...");
    localStorage.clear();
    window.location.href = 'InicioSesionEmpleados.html';
}

// Mostrar agregar
function mostrarAgregar() {
    document.getElementById('agregarEmpleado').classList.remove('hidden');
    document.getElementById('consultarEmpleado').classList.add('hidden');
    if (!editando) {
        document.getElementById('formAgregarEmpleado').reset();
        document.getElementById('idEmpleado').disabled = false;
        document.querySelector('#formAgregarEmpleado button[type="submit"]').textContent = 'Agregar empleado';
    }
}

// Mostrar consultar
function mostrarConsultar() {
    document.getElementById('agregarEmpleado').classList.add('hidden');
    document.getElementById('consultarEmpleado').classList.remove('hidden');
    document.getElementById('resultadoConsulta').innerHTML = '';
    document.getElementById('idConsultar').value = '';
}
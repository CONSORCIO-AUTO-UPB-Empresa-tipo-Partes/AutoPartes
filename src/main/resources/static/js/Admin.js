// Variables globales
let empleados = [];
let editando = false;
let empleadoEditando = null;
let userTypes = []; // Lista de tipos de usuario disponibles

// Verificar si hay un usuario autenticado al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        window.location.href = 'InicioSesionEmpleados.html';
        return;
    }

    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
        fetch(`/api/auth/user-info?email=${encodeURIComponent(userEmail)}`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        })
            .then(response => {
                if (!response.ok) throw new Error('Error al obtener información del usuario');
                return response.json();
            })
            .then(userData => {
                localStorage.setItem('user', JSON.stringify(userData));
                document.getElementById('userName').textContent = userData.name || userData.email || 'Usuario';
            })
            .catch(error => {
                console.error('Error:', error);
                const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
                document.getElementById('userName').textContent = userInfo.name || userInfo.email || 'Usuario';
            });
    }

    verificarModo();
    cargarTiposUsuario();
    cargarEmpleados();
});

// Cargar tipos de usuario
function cargarTiposUsuario() {
    const authToken = localStorage.getItem('authToken');

    fetch('/api/usertypes', {
        headers: { 'Authorization': `Bearer ${authToken}` }
    })
        .then(response => {
            if (!response.ok) throw new Error('Error al cargar tipos de usuario');
            return response.json();
        })
        .then(data => {
            userTypes = data.filter(type => type.usertypename !== 'CLIENT');
            const selectRol = document.getElementById('rolUsuario');
            selectRol.innerHTML = '';

            userTypes.forEach(type => {
                const option = document.createElement('option');
                option.value = type.usertypename;
                option.textContent = type.usertypename;
                selectRol.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarMensaje('Error al cargar tipos de usuario: ' + error.message, 'warning');

            const defaultRoles = ['ADMINISTRATOR', 'SECRETARY', 'EMPLOYEE'];
            const selectRol = document.getElementById('rolUsuario');
            selectRol.innerHTML = '';

            defaultRoles.forEach(role => {
                const option = document.createElement('option');
                option.value = role;
                option.textContent = role;
                selectRol.appendChild(option);
            });
        });
}

// Cargar empleados
function cargarEmpleados() {
    const authToken = localStorage.getItem('authToken');

    fetch('/api/persons/employees', {
        headers: { 'Authorization': `Bearer ${authToken}` }
    })
        .then(response => {
            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('authToken');
                    window.location.href = 'InicioSesionEmpleados.html';
                    throw new Error('Sesión expirada. Inicie sesión nuevamente.');
                }
                throw new Error('Error al cargar empleados: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            empleados = data.filter(empleado => {
                const personType = (empleado.persontype || '').toUpperCase();
                const userType = (empleado.usertype || '').toUpperCase();
                return personType !== 'CLIENT' && userType !== 'CLIENT';
            });
            actualizarTablaEmpleados();
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarMensaje('Error al cargar empleados: ' + error.message, 'danger');
        });
}

// Actualizar tabla empleados
function actualizarTablaEmpleados() {
    const tablaBody = document.getElementById('tablaEmpleadosBody');
    tablaBody.innerHTML = '';

    empleados.forEach(empleado => {
        const nombreCompleto = empleado.personname.split(' ');
        const nombre = nombreCompleto[0] || '';
        const apellido = nombreCompleto.slice(1).join(' ') || '';

        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${empleado.iddocument}</td>
            <td>${nombre}</td>
            <td>${apellido}</td>
            <td>${empleado.usertype || empleado.persontype}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="prepararEdicion('${empleado.iddocument}')">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarEmpleado('${empleado.iddocument}')">Eliminar</button>
            </td>
        `;
        tablaBody.appendChild(fila);
    });
}

// Manejar formulario de registro/edición
document.getElementById('formAgregarEmpleado').addEventListener('submit', function(event) {
    event.preventDefault();

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

    const authToken = localStorage.getItem('authToken');
    const method = editando ? 'PUT' : 'POST';
    const url = editando ? `/api/persons/${empleadoEditando}` : '/api/persons';

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(personaData)
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.error || 'Error desconocido');
                });
            }
            return response.json();
        })
        .then(data => {
            mostrarMensaje(editando ? 'Empleado actualizado correctamente' : 'Empleado registrado correctamente', 'success');

            document.getElementById('formAgregarEmpleado').reset();
            editando = false;
            empleadoEditando = null;
            document.getElementById('idEmpleado').disabled = false;
            document.querySelector('#formAgregarEmpleado button[type="submit"]').textContent = 'Agregar empleado';

            cargarEmpleados();
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarMensaje('Error: ' + error.message, 'danger');
        });
});

// Preparar edición
function prepararEdicion(id) {
    const authToken = localStorage.getItem('authToken');

    fetch(`/api/persons/${id}`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
    })
        .then(response => {
            if (!response.ok) throw new Error('Error al obtener detalles del empleado');
            return response.json();
        })
        .then(data => {
            const nombreCompleto = data.personname.split(' ');
            const nombre = nombreCompleto[0] || '';
            const apellido = nombreCompleto.slice(1).join(' ') || '';

            document.getElementById('nombreEmpleado').value = nombre;
            document.getElementById('apellidoEmpleado').value = apellido;
            document.getElementById('emailEmpleado').value = data.email || '';
            document.getElementById('passwordEmpleado').value = '';
            document.getElementById('telefonoEmpleado').value = data.phonenumber || '';
            document.getElementById('direccionEmpleado').value = data.personaddress || '';
            document.getElementById('tipoDocumento').value = data.typedocument || 'CC';

            const selectRol = document.getElementById('rolUsuario');
            const userTypeExists = [...selectRol.options].some(option => option.value === data.usertype);
            if (!userTypeExists && data.usertype) {
                const option = document.createElement('option');
                option.value = data.usertype;
                option.textContent = data.usertype;
                selectRol.appendChild(option);
            }
            document.getElementById('rolUsuario').value = data.usertype || 'EMPLOYEE';

            document.getElementById('idEmpleado').value = data.iddocument;
            document.getElementById('idEmpleado').disabled = true;

            editando = true;
            empleadoEditando = id;
            document.querySelector('#formAgregarEmpleado button[type="submit"]').textContent = 'Actualizar empleado';
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarMensaje('Error al preparar edición: ' + error.message, 'danger');
        });
}

// Función auxiliar para mostrar mensajes
function mostrarMensaje(mensaje, tipo) {
    // Aquí podrías implementar un sistema de alertas o usar librerías como SweetAlert
    alert(`${tipo.toUpperCase()}: ${mensaje}`);
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

// Verificar el modo guardado
function verificarModo() {
    const modoOscuro = localStorage.getItem('modoOscuro') === 'true';
    document.body.classList.toggle('dark-mode', modoOscuro);
}
<!-- Script para mostrar información del usuario actual -->
// Cargar información del usuario actual
document.addEventListener('DOMContentLoaded', function() {
    const userDataStr = localStorage.getItem('user');
    if (userDataStr) {
        try {
            const userData = JSON.parse(userDataStr);
            document.getElementById('userName').textContent = userData.name || 'Usuario';
        } catch (e) {
            console.error('Error parsing user data:', e);
        }
    }

    // Si ruta de imagen del usuario existe, mostrarla
    const userImage = localStorage.getItem('userImage');
    if (userImage) {
        document.querySelector('#userInfo img').src = userImage;
    }
});
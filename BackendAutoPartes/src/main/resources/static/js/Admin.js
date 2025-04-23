// Variables globales
let empleados = [];
let editando = false;
let empleadoEditando = null;
let userTypes = []; // Lista de tipos de usuario disponibles

// Verificar si hay un usuario autenticado al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si hay un authToken en localStorage
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        // Redirigir a la página de login si no hay authToken
        window.location.href = 'InicioSesionEmpleados.html';
        return;
    }
    
    // Cargar información del usuario actual desde localStorage
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
        // Obtener información del usuario desde el servidor
        fetch(`/api/auth/user-info?email=${encodeURIComponent(userEmail)}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener información del usuario');
            }
            return response.json();
        })
        .then(userData => {
            // Guardar datos del usuario en localStorage
            localStorage.setItem('user', JSON.stringify(userData));
            
            // Actualizar UI con información del usuario
            document.getElementById('userName').textContent = userData.name || userData.email || 'Usuario';
        })
        .catch(error => {
            console.error('Error:', error);
            // Usar información existente si hay error
            const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
            document.getElementById('userName').textContent = userInfo.name || userInfo.email || 'Usuario';
        });
    }
    
    // Verificar el modo claro/oscuro guardado
    verificarModo();
    
    // Cargar tipos de usuario disponibles
    cargarTiposUsuario();
    
    // Cargar la lista de empleados
    cargarEmpleados();
});

// Función para cargar tipos de usuario desde el backend
function cargarTiposUsuario() {
    const authToken = localStorage.getItem('authToken');
    
    fetch('/api/usertypes', {
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al cargar tipos de usuario');
        }
        return response.json();
    })
    .then(data => {
        userTypes = data.filter(type => type.usertypename !== 'CLIENT'); // Filtrar tipos de usuario, excluyendo CLIENTE
        
        // Actualizar el dropdown de roles
        const selectRol = document.getElementById('rolUsuario');
        selectRol.innerHTML = ''; // Limpiar opciones existentes
        
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
        
        // Cargar opciones por defecto en caso de error
        const defaultRoles = ['ADMINISTRATOR', 'SECRETARY', 'EMPLOYEE'];
        const selectRol = document.getElementById('rolUsuario');
        selectRol.innerHTML = ''; // Limpiar opciones existentes
        
        defaultRoles.forEach(role => {
            const option = document.createElement('option');
            option.value = role;
            option.textContent = role;
            selectRol.appendChild(option);
        });
    });
}

// Función para cargar empleados desde el backend
function cargarEmpleados() {
    const authToken = localStorage.getItem('authToken');
    
    fetch('/api/persons/employees', {
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                // authToken inválido o expirado
                localStorage.removeItem('authToken');
                window.location.href = 'InicioSesionEmpleados.html';
                throw new Error('Sesión expirada. Por favor inicie sesión nuevamente.');
            }
            throw new Error('Error al cargar empleados: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        // Filtrar empleados que no sean del tipo CLIENTE/Cliente/CLIENT
        empleados = data.filter(empleado => {
            // Verificar el persontype (tipo de persona)
            const personType = (empleado.persontype || '').toUpperCase();
            if (personType === 'CLIENT' || personType === 'CLIENTE') {
                return false;
            }
            
            // Verificar también el usertype (tipo de usuario)
            const userType = (empleado.usertype || '').toUpperCase();
            if (userType === 'CLIENT' || userType === 'CLIENTE') {
                return false;
            }
            
            return true;
        });
        actualizarTablaEmpleados();
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarMensaje('Error al cargar empleados: ' + error.message, 'danger');
    });
}

// Función para actualizar la tabla de empleados
function actualizarTablaEmpleados() {
    const tablaBody = document.getElementById('tablaEmpleadosBody');
    tablaBody.innerHTML = '';
    
    empleados.forEach(empleado => {
        // Extraer nombre y apellido del nombre completo
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

// Función para manejar el formulario de registro/edición
document.getElementById('formAgregarEmpleado').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Obtener valores del formulario
    const nombre = document.getElementById('nombreEmpleado').value;
    const apellido = document.getElementById('apellidoEmpleado').value;
    const email = document.getElementById('emailEmpleado').value;
    const password = document.getElementById('passwordEmpleado').value;
    const telefono = document.getElementById('telefonoEmpleado').value;
    const direccion = document.getElementById('direccionEmpleado').value;
    const tipoDocumento = document.getElementById('tipoDocumento').value;
    const rol = document.getElementById('rolUsuario').value;
    const idDocumento = document.getElementById('idEmpleado').value;
    
    // Validar campos
    if (!nombre || !apellido || !email || !idDocumento || !telefono) {
        mostrarMensaje('Por favor complete los campos obligatorios', 'warning');
        return;
    }
    
    // Verificar contraseña para usuarios nuevos
    if (!editando && !password) {
        mostrarMensaje('La contraseña es obligatoria para nuevos empleados', 'warning');
        return;
    }
    
    // Crear el objeto de datos
    const personaData = {
        iddocument: idDocumento,
        name: nombre,
        lastname: apellido,
        email: email,
        password: password || null, // Si está editando y no se proporcionó contraseña, enviar null
        phone: telefono,
        address: direccion,
        typedocument: tipoDocumento,
        persontype: 'EMPLOYEE', // Por defecto es empleado
        usertype: rol
    };
    
    const authToken = localStorage.getItem('authToken');
    
    // Determinar si estamos creando o actualizando
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
        const mensaje = editando ? 'Empleado actualizado correctamente' : 'Empleado registrado correctamente';
        mostrarMensaje(mensaje, 'success');
        
        // Resetear formulario y variables de control
        document.getElementById('formAgregarEmpleado').reset();
        editando = false;
        empleadoEditando = null;
        document.getElementById('idEmpleado').disabled = false;
        document.querySelector('#formAgregarEmpleado button[type="submit"]').textContent = 'Agregar empleado';
        
        // Recargar lista de empleados
        cargarEmpleados();
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarMensaje('Error: ' + error.message, 'danger');
    });
});

// Función para preparar la edición de un empleado
function prepararEdicion(id) {
    const authToken = localStorage.getItem('authToken');
    
    fetch(`/api/persons/${id}`, {
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al obtener detalles del empleado');
        }
        return response.json();
    })
    .then(data => {
        // Extraer nombre y apellido del nombre completo
        const nombreCompleto = data.personname.split(' ');
        const nombre = nombreCompleto[0] || '';
        const apellido = nombreCompleto.slice(1).join(' ') || '';
        
        // Rellenar el formulario con los datos
        document.getElementById('nombreEmpleado').value = nombre;
        document.getElementById('apellidoEmpleado').value = apellido;
        document.getElementById('emailEmpleado').value = data.email || '';
        document.getElementById('passwordEmpleado').value = ''; // No mostramos la contraseña
        document.getElementById('telefonoEmpleado').value = data.phonenumber || '';
        document.getElementById('direccionEmpleado').value = data.personaddress || '';
        document.getElementById('tipoDocumento').value = data.typedocument || 'CC';
        
        // Asegurarse de que el tipo de usuario existe en el dropdown
        const selectRol = document.getElementById('rolUsuario');
        const userTypeExists = Array.from(selectRol.options).some(option => option.value === data.usertype);
        
        if (data.usertype && userTypeExists) {
            selectRol.value = data.usertype;
        }
        
        document.getElementById('idEmpleado').value = data.iddocument;
        
        // Desactivar campo de ID y cambiar botón
        document.getElementById('idEmpleado').disabled = true;
        document.querySelector('#formAgregarEmpleado button[type="submit"]').textContent = 'Actualizar empleado';
        
        // Establecer variables de control
        editando = true;
        empleadoEditando = id;
        
        // Asegurar que la sección de agregar está visible
        mostrarAgregar();
        
        // Hacer password no requerido cuando estamos editando
        document.getElementById('passwordEmpleado').removeAttribute('required');
        
        // Hacer scroll al formulario
        document.getElementById('agregarEmpleado').scrollIntoView({ behavior: 'smooth' });
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarMensaje('Error al obtener detalles del empleado', 'danger');
    });
}

// Función para eliminar un empleado
function eliminarEmpleado(id) {
    if (confirm('¿Está seguro que desea eliminar este empleado?')) {
        const authToken = localStorage.getItem('authToken');
        
        fetch(`/api/persons/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar empleado');
            }
            return response.json();
        })
        .then(data => {
            mostrarMensaje('Empleado eliminado correctamente', 'success');
            cargarEmpleados();
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarMensaje('Error al eliminar empleado', 'danger');
        });
    }
}

// Función para consultar empleado por ID
function consultarEmpleado() {
    const id = document.getElementById('idConsultar').value.trim();
    if (!id) {
        mostrarMensaje('Por favor ingrese un ID para consultar', 'warning');
        return;
    }
    
    const authToken = localStorage.getItem('authToken');
    
    fetch(`/api/persons/${id}`, {
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Empleado no encontrado');
        }
        return response.json();
    })
    .then(data => {
        // Extraer nombre y apellido del nombre completo
        const nombreCompleto = data.personname.split(' ');
        const nombre = nombreCompleto[0] || '';
        const apellido = nombreCompleto.slice(1).join(' ') || '';
        
        const resultadoDiv = document.getElementById('resultadoConsulta');
        resultadoDiv.innerHTML = `
            <div class="alert alert-success">
                <h5>Empleado encontrado:</h5>
                <p><strong>ID:</strong> ${data.iddocument}</p>
                <p><strong>Nombre:</strong> ${nombre}</p>
                <p><strong>Apellido:</strong> ${apellido}</p>
                <p><strong>Email:</strong> ${data.email || 'No disponible'}</p>
                <p><strong>Teléfono:</strong> ${data.phonenumber || 'No disponible'}</p>
                <p><strong>Dirección:</strong> ${data.personaddress || 'No disponible'}</p>
                <p><strong>Tipo de documento:</strong> ${data.typedocument || 'No disponible'}</p>
                <p><strong>Tipo de persona:</strong> ${data.persontype || 'No disponible'}</p>
                <p><strong>Rol de usuario:</strong> ${data.usertype || 'No disponible'}</p>
                <div class="mt-3">
                    <button class="btn btn-warning btn-sm" onclick="prepararEdicion('${data.iddocument}')">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarEmpleado('${data.iddocument}')">Eliminar</button>
                </div>
            </div>
        `;
    })
    .catch(error => {
        console.error('Error:', error);
        const resultadoDiv = document.getElementById('resultadoConsulta');
        resultadoDiv.innerHTML = `
            <div class="alert alert-danger">
                Empleado no encontrado
            </div>
        `;
    });
}

// Funciones para mostrar/ocultar secciones
function mostrarAgregar() {
    document.getElementById('agregarEmpleado').classList.remove('hidden');
    document.getElementById('consultarEmpleado').classList.add('hidden');
    
    // Resetear formulario y variables
    if (!editando) {
        document.getElementById('formAgregarEmpleado').reset();
        document.getElementById('passwordEmpleado').setAttribute('required', '');
    }
}

function mostrarConsultar() {
    document.getElementById('agregarEmpleado').classList.add('hidden');
    document.getElementById('consultarEmpleado').classList.remove('hidden');
    document.getElementById('resultadoConsulta').innerHTML = '';
    document.getElementById('idConsultar').value = '';
}

// Función para mostrar mensajes
function mostrarMensaje(mensaje, tipo) {
    // Crear el elemento para el mensaje
    const mensajeDiv = document.createElement('div');
    mensajeDiv.classList.add('alert', `alert-${tipo}`, 'alert-dismissible', 'fade', 'show', 'mensaje-flotante');
    mensajeDiv.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Agregar al DOM
    document.querySelector('.container').prepend(mensajeDiv);
    
    // Eliminar después de 5 segundos
    setTimeout(() => {
        mensajeDiv.classList.remove('show');
        setTimeout(() => mensajeDiv.remove(), 300);
    }, 5000);
}

// Función para alternar modo claro/oscuro
function toggleMode() {
    document.body.classList.toggle('modo-claro');
    
    // Guardar preferencia en localStorage
    if (document.body.classList.contains('modo-claro')) {
        localStorage.setItem('modo', 'claro');
    } else {
        localStorage.setItem('modo', 'oscuro');
    }
}

// Verificar el modo guardado
function verificarModo() {
    if (localStorage.getItem('modo') === 'claro') {
        document.body.classList.add('modo-claro');
    }
}

// Función para cerrar sesión
function cerrarSesion() {
    // Limpiar datos de sesión
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userType');
    localStorage.removeItem('tokenExpiry');
    
    // Redirigir al login
    window.location.href = 'InicioSesionEmpleados.html';
}
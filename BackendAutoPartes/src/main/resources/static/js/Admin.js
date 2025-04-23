const API_URL = "http://localhost:8080/api/persons";
let editando = false;
let personaEditando = null;

document.addEventListener("DOMContentLoaded", async function() {
    aplicarModoGuardado();
    await cargarPersonas();
    mostrarAgregar();

    document.getElementById("formAgregarPersona").addEventListener("submit", async function(event) {
        event.preventDefault();
        await guardarPersona();
    });
});

async function cargarPersonas() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(Error HTTP: ${response.status});
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            console.warn("Respuesta no JSON recibida:", text);
            return;
        }

        const data = await response.json();
        actualizarTabla(data);
    } catch (error) {
        console.error("Error al cargar personas:", error);
        mostrarError("Error al cargar personas. Por favor intente más tarde.");
    }
}

async function guardarPersona() {
    const persona = {
        name: document.getElementById("nombrePersona").value.trim(),
        lastName: document.getElementById("apellidoPersona").value.trim(),
        phoneNumber: document.getElementById("telefonoPersona").value.trim(),
        documentType: document.getElementById("tipoDocumento").value,
        documentNumber: document.getElementById("numeroDocumento").value.trim(),
        role: document.getElementById("rolUsuario").value
    };

    if (!persona.name || !persona.lastName || !persona.phoneNumber || !persona.documentNumber) {
        mostrarError("Por favor complete todos los campos obligatorios");
        return;
    }

    try {
        let url = API_URL;
        let method = 'POST';

        if (editando) {
            url = ${API_URL}/${personaEditando.id};
            method = 'PUT';
        }

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(persona)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Error en la solicitud");
        }

        await cargarPersonas();
        resetForm();

    } catch (error) {
        console.error("Error al guardar persona:", error);
        mostrarError(error.message);
    }
}

function actualizarTabla(data = []) {
    const tabla = document.getElementById("tablaPersonasBody");
    tabla.innerHTML = data.length === 0
        ? '<tr><td colspan="8" class="text-center">No hay personas registradas</td></tr>'
        : data.map(persona => `
            <tr>
                <td>${persona.id || ''}</td>
                <td>${persona.name || ''}</td>
                <td>${persona.lastName || ''}</td>
                <td>${persona.phoneNumber || ''}</td>
                <td>${getTipoDocumentoNombre(persona.documentType)}</td>
                <td>${persona.documentNumber || ''}</td>
                <td>${getRolNombre(persona.role)}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editarPersona('${persona.id}')">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarPersona('${persona.id}')">Eliminar</button>
                </td>
            </tr>
        `).join('');
}

async function editarPersona(id) {
    try {
        const response = await fetch(${API_URL}/${id});

        if (!response.ok) {
            throw new Error("Persona no encontrada");
        }

        personaEditando = await response.json();

        document.getElementById("nombrePersona").value = personaEditando.name || '';
        document.getElementById("apellidoPersona").value = personaEditando.lastName || '';
        document.getElementById("telefonoPersona").value = personaEditando.phoneNumber || '';
        document.getElementById("tipoDocumento").value = personaEditando.documentType || 'CC';
        document.getElementById("numeroDocumento").value = personaEditando.documentNumber || '';
        document.getElementById("rolUsuario").value = personaEditando.role || 'EMPLOYEE';

        editando = true;
        document.querySelector("#formAgregarPersona button[type='submit']").textContent = "Guardar cambios";
        mostrarAgregar();

    } catch (error) {
        console.error("Error al editar persona:", error);
        mostrarError("Error al cargar datos de la persona");
    }
}

async function eliminarPersona(id) {
    if (!confirm("¿Está seguro de eliminar esta persona?")) return;

    try {
        const response = await fetch(${API_URL}/${id}, {
        method: 'DELETE'
    });

    if (!response.ok) {
        throw new Error("Error al eliminar persona");
    }

    await cargarPersonas();
} catch (error) {
    console.error("Error al eliminar persona:", error);
    mostrarError("Error al eliminar persona");
}
}

async function consultarPersona() {
    const id = document.getElementById("idConsultar").value.trim();
    const resultado = document.getElementById("resultadoConsulta");

    resultado.innerHTML = "";

    if (!id) {
        mostrarError("Por favor ingrese un ID para buscar", resultado);
        return;
    }

    try {
        const response = await fetch(${API_URL}/${id});

        if (!response.ok) {
            throw new Error("Persona no encontrada");
        }

        const persona = await response.json();

        resultado.innerHTML = `
            <div class="card bg-dark text-white">
                <div class="card-body">
                    <h5 class="card-title">Información de la Persona</h5>
                    <p><strong>ID:</strong> ${persona.id || 'N/A'}</p>
                    <p><strong>Nombre:</strong> ${persona.name || ''} ${persona.lastName || ''}</p>
                    <p><strong>Teléfono:</strong> ${persona.phoneNumber || 'N/A'}</p>
                    <p><strong>Documento:</strong> ${getTipoDocumentoNombre(persona.documentType)} ${persona.documentNumber || ''}</p>
                    <p><strong>Rol:</strong> ${getRolNombre(persona.role)}</p>
                </div>
            </div>
        `;
    } catch (error) {
        console.error("Error al consultar persona:", error);
        mostrarError("No se encontró ninguna persona con ese ID", resultado);
    }
}

// Funciones auxiliares
function getRolNombre(rol) {
    const roles = {
        'SECRETARY': 'Secretaria',
        'ADMINISTRATOR': 'Administrador',
        'EMPLOYEE': 'Empleado',
        'CLIENT': 'Cliente'
    };
    return roles[rol] || rol;
}

function getTipoDocumentoNombre(tipo) {
    const tipos = {
        'CC': 'Cédula',
        'CE': 'Cédula Extranjería',
        'TI': 'Tarjeta Identidad',
        'PAS': 'Pasaporte'
    };
    return tipos[tipo] || tipo;
}

function mostrarError(mensaje, elemento = null) {
    const target = elemento || document.body;
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-danger';
    alertDiv.textContent = mensaje;
    target.prepend(alertDiv);
    setTimeout(() => alertDiv.remove(), 5000);
}

function resetForm() {
    document.getElementById("formAgregarPersona").reset();
    editando = false;
    personaEditando = null;
    document.querySelector("#formAgregarPersona button[type='submit']").textContent = "Agregar persona";
}

function mostrarAgregar() {
    document.getElementById("agregarPersona").style.display = "block";
    document.getElementById("consultarPersona").style.display = "none";
    resetForm();
}

function mostrarConsultar() {
    document.getElementById("agregarPersona").style.display = "none";
    document.getElementById("consultarPersona").style.display = "block";
}

// Modo claro/oscuro
function toggleMode() {
    document.body.classList.toggle("modo-claro");
    localStorage.setItem("modo", document.body.classList.contains("modo-claro") ? "claro" : "oscuro");
}

function aplicarModoGuardado() {
    if (localStorage.getItem("modo") === "claro") {
        document.body.classList.add("modo-claro");
    }
}
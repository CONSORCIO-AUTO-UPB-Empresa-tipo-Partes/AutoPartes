let empleados = [];
let editando = false;
let empleadoEditando = null;

document.getElementById("formAgregarEmpleado").addEventListener("submit", function (event) {
    event.preventDefault();

    let nombre = document.getElementById("nombreEmpleado").value;
    let apellido = document.getElementById("apellidoEmpleado").value;
    let rol = document.getElementById("rolUsuario").value;
    let id = document.getElementById("idEmpleado").value;

    if (editando) {
        // Actualizar el empleado existente
        let index = empleados.findIndex(emp => emp.id === empleadoEditando.id);
        if (index !== -1) {
            empleados[index] = { id, nombre, apellido, rol };
        }
        editando = false;
        empleadoEditando = null;
        document.querySelector("#formAgregarEmpleado button[type='submit']").textContent = "Agregar empleado";
    } else {
        // Agregar un nuevo empleado
        if (empleados.some(emp => emp.id === id)) {
            alert("El ID ya existe. Intente con otro.");
            return;
        }
        empleados.push({ id, nombre, apellido, rol });
    }

    actualizarTabla();
    document.getElementById("formAgregarEmpleado").reset();
});

function actualizarTabla() {
    let tabla = document.getElementById("tablaEmpleadosBody");
    tabla.innerHTML = "";
    empleados.forEach(emp => {
        let fila = `<tr>
                        <td>${emp.id}</td>
                        <td>${emp.nombre}</td>
                        <td>${emp.apellido}</td>
                        <td>${emp.rol}</td>
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="editarEmpleado('${emp.id}')">Editar</button>
                            <button class="btn btn-danger btn-sm" onclick="eliminarEmpleado('${emp.id}')">Eliminar</button>
                        </td>
                    </tr>`;
        tabla.innerHTML += fila;
    });
}

function editarEmpleado(id) {
    empleadoEditando = empleados.find(emp => emp.id === id);
    if (empleadoEditando) {
        document.getElementById("nombreEmpleado").value = empleadoEditando.nombre;
        document.getElementById("apellidoEmpleado").value = empleadoEditando.apellido;
        document.getElementById("rolUsuario").value = empleadoEditando.rol;
        document.getElementById("idEmpleado").value = empleadoEditando.id;
        document.getElementById("idEmpleado").setAttribute("readonly", true);
        editando = true;
        document.querySelector("#formAgregarEmpleado button[type='submit']").textContent = "Guardar cambios";
    }
}

function eliminarEmpleado(id) {
    empleados = empleados.filter(emp => emp.id !== id);
    actualizarTabla();
}

function mostrarAgregar() {
    document.getElementById("agregarEmpleado").classList.remove("hidden");
    document.getElementById("consultarEmpleado").classList.add("hidden");
    document.getElementById("idEmpleado").removeAttribute("readonly");
    document.getElementById("formAgregarEmpleado").reset();
    editando = false;
    empleadoEditando = null;
    document.querySelector("#formAgregarEmpleado button[type='submit']").textContent = "Agregar empleado";
}
// Función para alternar entre modo claro y oscuro
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
document.addEventListener("DOMContentLoaded", function () {
    let proveedores = [];
    let editando = false;
    let proveedorEditando = null;

    const formAgregarProveedor = document.getElementById("formAgregarProveedor");
    const nombreProveedorInput = document.getElementById("nombreProveedor");
    const tablaProveedoresBody = document.getElementById("tablaProveedoresBody");
    const resultadoConsulta = document.getElementById("resultadoConsulta");

    formAgregarProveedor.addEventListener("submit", function (event) {
        event.preventDefault();
        let nombre = nombreProveedorInput.value.trim();

        if (editando) {
            // Editar proveedor existente
            proveedorEditando.nombre = nombre;
            editando = false;
            proveedorEditando = null;
            document.querySelector("#formAgregarProveedor button[type='submit']").textContent = "Agregar proveedor";
        } else {
            // Agregar nuevo proveedor con ID automático
            let nuevoProveedor = {
                id: generarID(),
                nombre
            };
            proveedores.push(nuevoProveedor);
        }

        actualizarTabla();
        formAgregarProveedor.reset();
    });

    function generarID() {
        return "P-" + Math.floor(Math.random() * 10000);
    }

    function actualizarTabla() {
        tablaProveedoresBody.innerHTML = "";
        proveedores.forEach(prov => {
            let fila = `<tr>
                            <td>${prov.id}</td>
                            <td>${prov.nombre}</td>
                            <td>
                                <button class="btn btn-warning btn-sm" onclick="editarProveedor('${prov.id}')">Editar</button>
                                <button class="btn btn-danger btn-sm" onclick="eliminarProveedor('${prov.id}')">Eliminar</button>
                            </td>
                        </tr>`;
            tablaProveedoresBody.innerHTML += fila;
        });
    }

    window.editarProveedor = function (id) {
        proveedorEditando = proveedores.find(prov => prov.id === id);
        if (proveedorEditando) {
            nombreProveedorInput.value = proveedorEditando.nombre;
            editando = true;
            document.querySelector("#formAgregarProveedor button[type='submit']").textContent = "Guardar cambios";
        }
    };

    window.eliminarProveedor = function (id) {
        proveedores = proveedores.filter(prov => prov.id !== id);
        actualizarTabla();
    };
});
// Llamar a la función al cargar la página
aplicarModoGuardado();
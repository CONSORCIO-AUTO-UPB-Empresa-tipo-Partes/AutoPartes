let empleados = [];

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

    function consultarEmpleado() {
        let idConsulta = document.getElementById("idConsultar").value;
        let empleado = empleados.find(emp => emp.id === idConsulta);
        let resultado = document.getElementById("resultadoConsulta");

        if (empleado) {
            resultado.innerHTML = `<div class="alert alert-success">
                                  <strong>Empleado encontrado:</strong><br>
                                  <b>ID:</b> ${empleado.id}<br>
                                  <b>Nombre:</b> ${empleado.nombre}<br>
                                  <b>Apellido:</b> ${empleado.apellido}<br>
                                  <b>Rol:</b> ${empleado.rol}
                               </div>`;
        } else {
            resultado.innerHTML = `<div class="alert alert-danger">No se encontró un empleado con ese ID.</div>`;
        }
    }

    function mostrarConsultar() {
        document.getElementById("consultarEmpleado").classList.remove("hidden");
        document.getElementById("agregarEmpleado").classList.add("hidden");
    }

    // Modo claro/oscuro
    const body = document.body;
    const toggleButton = document.querySelector(".toggle-mode");

    function aplicarModo(modo) {
        if (modo === "claro") {
            body.classList.add("modo-claro");
        } else {
            body.classList.remove("modo-claro");
        }
    }

    toggleButton.addEventListener("click", function () {
        let modoActual = body.classList.contains("modo-claro") ? "oscuro" : "claro";
        localStorage.setItem("modo", modoActual);
        aplicarModo(modoActual);
    });

    aplicarModo(localStorage.getItem("modo") || "oscuro");
});

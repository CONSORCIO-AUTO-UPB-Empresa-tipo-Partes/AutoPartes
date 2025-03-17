
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
        empleadoEditando.nombre = nombre;
        empleadoEditando.apellido = apellido;
        empleadoEditando.rol = rol;
        editando = false; // Salir del modo edición
        empleadoEditando = null; // Limpiar la referencia al empleado en edición
        document.querySelector("#formAgregarEmpleado button[type='submit']").textContent = "Agregar empleado";
    } else {
        // Agregar un nuevo empleado
        if (empleados.some(emp => emp.id === id)) {
            alert("El ID ya existe. Intente con otro.");
            return;
        }

        let nuevoEmpleado = { id, nombre, apellido, rol };
        empleados.push(nuevoEmpleado);
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
        editando = true;
        document.querySelector("#formAgregarEmpleado button[type='submit']").textContent = "Guardar cambios";
    }
}

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

    function eliminarEmpleado(id) {
        empleados = empleados.filter(emp => emp.id !== id);
        actualizarTabla();
    }

    function mostrarConsultar() {
        document.getElementById("consultarEmpleado").classList.remove("hidden");
        document.getElementById("agregarEmpleado").classList.add("hidden");
    }

    function mostrarAgregar() {
        document.getElementById("agregarEmpleado").classList.remove("hidden");
        document.getElementById("consultarEmpleado").classList.add("hidden");
    }

    function toggleMode() {
        document.body.classList.toggle("modo-claro");
    }

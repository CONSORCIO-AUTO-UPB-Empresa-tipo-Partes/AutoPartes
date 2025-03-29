let empleados = [];

function consultarEmpleado() {
    let idConsulta = document.getElementById("idConsultar").value.trim();
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

document.addEventListener("DOMContentLoaded", aplicarModoGuardado);

function consultarProveedor() {
    const consulta = document.getElementById("consultaProveedor").value.trim();
    const resultado = document.getElementById("resultadoConsulta");

    if (!consulta) {
        resultado.innerHTML = `
            <div class="alert alert-warning">
                Por favor ingrese un ID o nombre para buscar.
            </div>`;
        return;
    }

    const esID = !isNaN(consulta);
    const url = esID
        ? `/api/providers/${consulta}`
        : `/api/providers/name/${encodeURIComponent(consulta)}`;

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error("No encontrado");
            return response.json();
        })
        .then(proveedor => {
            resultado.innerHTML = `
                <div class="alert alert-success">
                    <strong>Proveedor encontrado por ${esID ? 'ID' : 'nombre'}:</strong> ${proveedor.name}
                </div>`;
            actualizarTablaProveedores([proveedor]);
            resaltarFila(proveedor.id);
        })
        .catch(error => {
            resultado.innerHTML = `
                <div class="alert alert-danger">
                    No se encontraron proveedores con ese ${esID ? 'ID' : 'nombre'}.
                </div>`;
            cargarTodosLosProveedores();
        });
}

function resaltarFila(id) {
    setTimeout(() => {
        const row = document.getElementById(`proveedor-${id}`);
        if (row) {
            row.classList.add('highlight-row');
            setTimeout(() => {
                row.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    }, 300);
}

function cargarTodosLosProveedores() {
    fetch("/api/providers")
        .then(response => response.json())
        .then(proveedores => {
            actualizarTablaProveedores(proveedores);
        })
        .catch(error => {
            console.error("Error al cargar proveedores:", error);
        });
}

function actualizarTablaProveedores(listaProveedores = []) {
    const tabla = document.getElementById("tablaProveedoresBody");
    tabla.innerHTML = "";

    if (listaProveedores.length === 0) {
        tabla.innerHTML = `
            <tr>
                <td colspan="2" class="text-center">No hay proveedores registrados</td>
            </tr>`;
        return;
    }

    let filasHTML = "";
    listaProveedores.forEach(prov => {
        filasHTML += `
            <tr id="proveedor-${prov.id}">
                <td>${prov.id}</td>
                <td><strong>${prov.name}</strong></td>
            </tr>`;
    });

    tabla.innerHTML = filasHTML;
}

// Buscar con Enter
document.getElementById("consultaProveedor").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        consultarProveedor();
    }
});

// Modo claro/oscuro
function toggleMode() {
    const body = document.body;
    body.classList.toggle("modo-claro");
    localStorage.setItem("modo", body.classList.contains("modo-claro") ? "claro" : "oscuro");
}

function aplicarModoGuardado() {
    const modo = localStorage.getItem("modo");
    if (modo === "claro") {
        document.body.classList.add("modo-claro");
    }
}

window.onload = function () {
    aplicarModoGuardado();
    cargarTodosLosProveedores();
    document.getElementById("consultaProveedor").focus();
};

window.addEventListener("load", loadCart);

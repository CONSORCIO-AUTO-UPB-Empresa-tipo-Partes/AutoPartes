// Base de datos de proveedores (simulada)
let proveedores = [
    { id: "P001", nombre: "Proveedor Uno" },
    { id: "P002", nombre: "Distribuidora ACME" },
    { id: "P003", nombre: "TecnoParts" },
    { id: "P004", nombre: "Alimentos S.A." },
    { id: "P005", nombre: "Ferretería Industrial" }
];

// Función para consultar proveedor por ID o nombre
function consultarProveedor() {
    let consulta = document.getElementById("consultaProveedor").value.trim();
    let resultado = document.getElementById("resultadoConsulta");

    if (!consulta) {
        resultado.innerHTML = `
            <div class="alert alert-warning">
                Por favor ingrese un ID o nombre para buscar.
            </div>`;
        return;
    }

    // Buscar por ID o nombre (ignorando mayúsculas/minúsculas)
    let proveedoresEncontrados = proveedores.filter(prov =>
        prov.id.toLowerCase().includes(consulta.toLowerCase()) ||
        prov.nombre.toLowerCase().includes(consulta.toLowerCase())
    );

    if (proveedoresEncontrados.length > 0) {
        let mensaje = '';
        if (proveedoresEncontrados.length === 1) {
            mensaje = `1 proveedor encontrado`;
        } else {
            mensaje = `${proveedoresEncontrados.length} proveedores encontrados`;
        }

        resultado.innerHTML = `
            <div class="alert alert-success">
                <strong>${mensaje}</strong>
            </div>`;

        // Actualizar la tabla con los resultados
        actualizarTablaProveedores(proveedoresEncontrados);

        // Resaltar las filas encontradas
        setTimeout(() => {
            proveedoresEncontrados.forEach(prov => {
                const row = document.getElementById(`proveedor-${prov.id}`);
                if (row) {
                    row.classList.add('highlight-row');
                    setTimeout(() => {
                        row.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 100);
                }
            });
        }, 300);
    } else {
        resultado.innerHTML = `
            <div class="alert alert-danger">
                No se encontraron proveedores con ese ID o nombre.
            </div>`;
        // Mostrar todos los proveedores si no hay resultados
        actualizarTablaProveedores(proveedores);
    }
}

// Función para actualizar la tabla de proveedores
function actualizarTablaProveedores(listaProveedores = proveedores) {
    let tabla = document.getElementById("tablaProveedoresBody");
    tabla.innerHTML = "";

    if (listaProveedores.length === 0) {
        tabla.innerHTML = `
            <tr>
                <td colspan="2" class="text-center">No hay proveedores registrados</td>
            </tr>`;
        return;
    }

    listaProveedores.forEach(prov => {
        let fila = `<tr id="proveedor-${prov.id}">
            <td>${prov.id}</td>
            <td><strong>${prov.nombre}</strong></td>
        </tr>`;
        tabla.innerHTML += fila;
    });
}

// Función para cambiar entre modo claro/oscuro
function toggleMode() {
    document.body.classList.toggle("modo-claro");
}

// Inicializar la tabla al cargar la página
window.onload = function() {
    actualizarTablaProveedores();
    // Poner foco en el campo de búsqueda
    document.getElementById("consultaProveedor").focus();
};

// Permitir búsqueda al presionar Enter
document.getElementById("consultaProveedor").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        consultarProveedor();
    }
});
// Función para cambiar el modo
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

// Llamar a la función al cargar la página
aplicarModoGuardado();

// Cargar el carrito al iniciar la página
window.addEventListener('load', loadCart);
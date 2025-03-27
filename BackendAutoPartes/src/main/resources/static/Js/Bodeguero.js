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

// Llamar a la función al cargar la página
aplicarModoGuardado();

// Lógica para agregar, editar y eliminar productos
let productos = JSON.parse(localStorage.getItem("productos")) || []; // Cargar productos desde localStorage
let idCounter = productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1; // Generar ID único
let productoEditando = null; // Variable para almacenar el producto que se está editando

const formAgregarProducto = document.getElementById("formAgregarProducto");
const tablaProductos = document.getElementById("tablaProductos");
const previewImagen = document.getElementById("previewImagen"); // Elemento para previsualizar la imagen
const eliminarImagenBtn = document.getElementById("eliminarImagen"); // Botón para eliminar la imagen

formAgregarProducto.addEventListener("submit", function (e) {
    e.preventDefault();
    const nombre = document.getElementById("nombreProducto").value;
    const imagen = document.getElementById("imagenProducto").files[0];

    if (!nombre || !imagen) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    const formData = new FormData();
    formData.append("itemname", nombre);
    formData.append("imagepath", imagen);

    fetch("/api/itemtypes", {
        method: "POST",
        body: formData
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Error al crear el producto");
        }
    })
    .then(data => {
        alert("Producto creado exitosamente");
        // Aquí puedes actualizar la tabla de productos o realizar otras acciones
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un problema al crear el producto");
    });
});

function finalizarEdicion() {
    localStorage.setItem("productos", JSON.stringify(productos)); // Actualizar localStorage
    actualizarTabla();
    formAgregarProducto.reset();
    previewImagen.src = "#";
    previewImagen.style.display = "none";
    eliminarImagenBtn.style.display = "none"; // Ocultar el botón de eliminar imagen
    productoEditando = null; // Limpiar la variable de edición
}

function editarProducto(id) {
    productoEditando = productos.find((p) => p.id === id);
    if (productoEditando) {
        document.getElementById("nombreProducto").value = productoEditando.nombre;
        if (productoEditando.imagen) {
            previewImagen.src = productoEditando.imagen;
            previewImagen.style.display = "block";
            eliminarImagenBtn.style.display = "block"; // Mostrar el botón de eliminar imagen
        } else {
            previewImagen.src = "#";
            previewImagen.style.display = "none";
            eliminarImagenBtn.style.display = "none"; // Ocultar el botón de eliminar imagen
        }
    }
}

// Eliminar la imagen actual
eliminarImagenBtn.addEventListener("click", function () {
    if (productoEditando) {
        productoEditando.imagen = ""; // Eliminar la imagen
        previewImagen.src = "#";
        previewImagen.style.display = "none";
        eliminarImagenBtn.style.display = "none"; // Ocultar el botón de eliminar imagen
    }
});

// Mostrar la imagen seleccionada en el input file
document.getElementById("imagenProducto").addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            previewImagen.src = e.target.result;
            previewImagen.style.display = "block";
        };
        reader.readAsDataURL(file);
    }
});

// Mostrar la tabla al cargar la página
actualizarTabla();

function actualizarTabla() {
    tablaProductos.innerHTML = "";
    productos.forEach((producto) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${producto.id}</td>
            <td>${producto.nombre}</td>
            <td><img src="${producto.imagen}" alt="${producto.nombre}" style="width: 50px; height: 50px;"></td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="editarProducto(${producto.id})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${producto.id})">Eliminar</button>
            </td>
        `;
        tablaProductos.appendChild(fila);
    });
}

function eliminarProducto(id) {
    productos = productos.filter((p) => p.id !== id);
    localStorage.setItem("productos", JSON.stringify(productos)); // Actualizar localStorage
    actualizarTabla();
}
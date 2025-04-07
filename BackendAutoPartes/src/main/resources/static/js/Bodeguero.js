document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("authToken");
    const userType = localStorage.getItem("userType");

    if (!token || userType !== "BODEGUERO") {
        alert("Acceso restringido. Debes iniciar sesión como Bodeguero.");
        window.location.href = "InicioSesionEmpleados.html";
    }
});

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
        let productos = [];
        let idCounter = 1;
        let productoEditando = null;

        const formAgregarProducto = document.getElementById("formAgregarProducto");
        const tablaProductos = document.getElementById("tablaProductos");
        const previewImagen = document.getElementById("previewImagen");
        const eliminarImagenBtn = document.getElementById("eliminarImagen");

        // Cargar productos al iniciar
        cargarProductos();

        // Función para cargar los productos desde el backend
        function cargarProductos() {
            fetch("/api/itemtypes")
            .then(response => response.json())
            .then(data => {
                productos = data;
                actualizarTabla();
            })
            .catch(error => {
                console.error("Error al cargar productos:", error);
            });
        }

        formAgregarProducto.addEventListener("submit", function (e) {
            e.preventDefault();

            const nombre = document.getElementById("nombreProducto").value;
            const imagenInput = document.getElementById("imagenProducto");
            const imagen = imagenInput.files[0];

            if (!nombre) {
                alert("Por favor, completa el nombre del producto.");
                return;
            }

            const formData = new FormData();
            formData.append("itemname", nombre);

            // Si hay una imagen, la añadimos al FormData
            if (imagen) {
                formData.append("image", imagen);
            }

            // Si estamos editando, usamos PUT, si no, POST
            const method = productoEditando ? "PUT" : "POST";
            const url = productoEditando
                ? `/api/itemtypes/${productoEditando.id}`
                : "/api/itemtypes";

            fetch(url, {
                method: method,
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                alert(productoEditando ? "Producto actualizado exitosamente" : "Producto creado exitosamente");
                limpiarFormulario();
                cargarProductos(); // Recargar la lista desde el backend
            })
            .catch(error => {
                console.error("Error:", error);
                alert("Hubo un problema: " + error.message);
            });
        });

        function limpiarFormulario() {
            formAgregarProducto.reset();
            previewImagen.src = "";
            previewImagen.style.display = "none";
            eliminarImagenBtn.style.display = "none";
            productoEditando = null;
        }

        function editarProducto(id) {
            fetch(`/api/itemtypes/${id}`)
            .then(response => response.json())
            .then(data => {
                productoEditando = data;
                document.getElementById("nombreProducto").value = productoEditando.itemname;

                if (productoEditando.imagepath) {
                    // Mostrar la imagen existente
                    previewImagen.src = productoEditando.imagepath;
                    previewImagen.style.display = "block";
                    eliminarImagenBtn.style.display = "block";
                } else {
                    previewImagen.style.display = "none";
                    eliminarImagenBtn.style.display = "none";
                }
            })
            .catch(error => {
                console.error("Error al cargar el producto:", error);
                alert("Error al cargar el producto para edición");
            });
        }

        // Eliminar la imagen actual
        eliminarImagenBtn.addEventListener("click", function () {
            if (productoEditando) {
                // Si estamos editando, enviamos una solicitud para eliminar la imagen
                fetch(`/api/itemtypes/${productoEditando.id}/image`, {
                    method: "DELETE"
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Error al eliminar la imagen");
                    }
                    previewImagen.src = "";
                    previewImagen.style.display = "none";
                    eliminarImagenBtn.style.display = "none";
                })
                .catch(error => {
                    console.error("Error:", error);
                    alert("No se pudo eliminar la imagen");
                });
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
                    eliminarImagenBtn.style.display = "block";
                };
                reader.readAsDataURL(file);
            }
        });

        function actualizarTabla() {
            tablaProductos.innerHTML = "";
            productos.forEach((producto) => {
                const fila = document.createElement("tr");
                const imagenHtml = producto.imagepath
                    ? `<img src="${producto.imagepath}" alt="${producto.itemname}" style="width: 50px; height: 50px;">`
                    : "Sin imagen";

                fila.innerHTML = `
                    <td>${producto.id}</td>
                    <td>${producto.itemname}</td>
                    <td>${imagenHtml}</td>
                    <td>
                        <button class="btn btn-primary btn-sm" onclick="editarProducto(${producto.id})">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${producto.id})">Eliminar</button>
                    </td>
                `;
                tablaProductos.appendChild(fila);
            });
        }

        function eliminarProducto(id) {
            if (confirm("¿Estás seguro de eliminar este producto?")) {
                fetch(`/api/itemtypes/${id}`, {
                    method: "DELETE"
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Error al eliminar el producto");
                    }
                    alert("Producto eliminado exitosamente");
                    cargarProductos(); // Recargar la lista desde el backend
                })
                .catch(error => {
                    console.error("Error:", error);
                    alert("No se pudo eliminar el producto");
                });
            }
        }
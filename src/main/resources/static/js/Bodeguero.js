document.addEventListener("DOMContentLoaded", async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
        console.log("No auth token found, redirecting to login.");
        window.location.href = "InicioSesionEmpleados.html";
        return;
    }

    let userName = 'Usuario';

    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
        try {
            const response = await fetch(`/api/auth/user-info?email=${encodeURIComponent(userEmail)}`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    console.log("Token invalid/expired during user info fetch, redirecting.");
                    localStorage.clear();
                    window.location.href = 'InicioSesionEmpleados.html';
                    return;
                }
                console.error(`Error fetching user info: ${response.status}`);
                const userDataStr = localStorage.getItem('user');
                if (userDataStr) {
                    try {
                        const userData = JSON.parse(userDataStr);
                        userName = userData.name || userData.email || 'Usuario';
                    } catch (e) { console.error('Error parsing user data from local storage:', e); }
                }
            } else {
                const userData = await response.json();
                localStorage.setItem('user', JSON.stringify(userData));
                userName = userData.name || userData.email || 'Usuario';
                console.log("User info fetched successfully:", userData);
            }
        } catch (error) {
            console.error('Network or other error fetching user info, trying local storage:', error);
            const userDataStr = localStorage.getItem('user');
            if (userDataStr) {
                try {
                    const userData = JSON.parse(userDataStr);
                    userName = userData.name || userData.email || 'Usuario';
                } catch (e) { console.error('Error parsing user data from local storage:', e); }
            }
        }
    } else {
        const userDataStr = localStorage.getItem('user');
        if (userDataStr) {
            try {
                const userData = JSON.parse(userDataStr);
                userName = userData.name || userData.email || 'Usuario';
            } catch (e) { console.error('Error parsing user data from local storage:', e); }
        }
    }

    console.log("User is authenticated. Proceeding with Bodeguero page load.");

    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        userNameElement.textContent = userName;
    }

    aplicarModoGuardado();
    cargarProductos();
});

function toggleMode() {
    const body = document.body;
    body.classList.toggle("modo-claro");

    if (body.classList.contains("modo-claro")) {
        localStorage.setItem("modo", "claro");
    } else {
        localStorage.setItem("modo", "oscuro");
    }
}

function aplicarModoGuardado() {
    const modoGuardado = localStorage.getItem("modo");
    if (modoGuardado === "claro") {
        document.body.classList.add("modo-claro");
    }
}

aplicarModoGuardado();

let productos = [];
let idCounter = 1;
let productoEditando = null;

const formAgregarProducto = document.getElementById("formAgregarProducto");
const tablaProductos = document.getElementById("tablaProductos");
const previewImagen = document.getElementById("previewImagen");
const eliminarImagenBtn = document.getElementById("eliminarImagen");

async function cargarProductos() {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        handleAuthError('cargar productos');
        return;
    }
    try {
        const response = await fetch("/api/itemtypes", {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await handleResponse(response, 'cargar productos');
        if (data === null || data === undefined) return;

        productos = data;
        actualizarTabla();
    } catch (error) {
        console.error("Error al cargar productos:", error);
        if (!error.handled) {
            alert("Error al cargar productos: " + error.message);
        }
    }
}

formAgregarProducto.addEventListener("submit", async function (e) {
    e.preventDefault();

    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        handleAuthError('guardar producto');
        return;
    }

    const nombre = document.getElementById("nombreProducto").value;
    const imagenInput = document.getElementById("imagenProducto");
    const imagen = imagenInput.files[0];

    if (!nombre) {
        alert("Por favor, completa el nombre del producto.");
        return;
    }

    const formData = new FormData();
    formData.append("itemname", nombre);

    if (imagen) {
        formData.append("image", imagen);
    }

    const method = productoEditando ? "PUT" : "POST";
    const url = productoEditando
        ? `/api/itemtypes/${productoEditando.id}`
        : "/api/itemtypes";

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Authorization': `Bearer ${authToken}` },
            body: formData
        });
        const data = await handleResponse(response, 'guardar producto');
        if (data === null || data === undefined) return;

        alert(productoEditando ? "Producto actualizado exitosamente" : "Producto creado exitosamente");
        limpiarFormulario();
        await cargarProductos();
    } catch (error) {
        console.error("Error:", error);
        if (!error.handled) {
            alert("Hubo un problema al guardar el producto: " + error.message);
        }
    }
});

function limpiarFormulario() {
    formAgregarProducto.reset();
    previewImagen.src = "";
    previewImagen.style.display = "none";
    eliminarImagenBtn.style.display = "none";
    productoEditando = null;
}

async function editarProducto(id) {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        handleAuthError('cargar producto para editar');
        return;
    }
    try {
        const response = await fetch(`/api/itemtypes/${id}`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await handleResponse(response, 'cargar producto para editar');
        if (data === null || data === undefined) return;

        productoEditando = data;
        document.getElementById("nombreProducto").value = productoEditando.itemname;

        if (productoEditando.imagepath) {
            previewImagen.src = productoEditando.imagepath;
            previewImagen.style.display = "block";
            eliminarImagenBtn.style.display = "block";
        } else {
            previewImagen.style.display = "none";
            eliminarImagenBtn.style.display = "none";
        }
    } catch (error) {
        console.error("Error al cargar el producto:", error);
        if (!error.handled) {
            alert("Error al cargar el producto para edición: " + error.message);
        }
    }
}

eliminarImagenBtn.addEventListener("click", async function () {
    if (productoEditando) {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            handleAuthError('eliminar imagen');
            return;
        }
        try {
            const response = await fetch(`/api/itemtypes/${productoEditando.id}/image`, {
                method: "DELETE",
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            await handleResponse(response, 'eliminar imagen', true);
            previewImagen.src = "";
            previewImagen.style.display = "none";
            eliminarImagenBtn.style.display = "none";
            alert("Imagen eliminada.");
        } catch (error) {
            console.error("Error:", error);
            if (!error.handled) {
                alert("No se pudo eliminar la imagen: " + error.message);
            }
        }
    }
});

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
            ? `<img src="${producto.imagepath.startsWith('/uploads/images/') ? producto.imagepath : '/uploads/images/' + producto.imagepath}" alt="${producto.itemname}" style="width: 50px; height: 50px;">`
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

async function eliminarProducto(id) {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        handleAuthError('eliminar producto');
        return;
    }
    if (confirm("¿Estás seguro de eliminar este producto?")) {
        try {
            const response = await fetch(`/api/itemtypes/${id}`, {
                method: "DELETE",
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            await handleResponse(response, 'eliminar producto', true);
            alert("Producto eliminado exitosamente");
            await cargarProductos();
        } catch (error) {
            console.error("Error:", error);
            if (!error.handled) {
                alert("No se pudo eliminar el producto: " + error.message);
            }
        }
    }
}

function handleAuthError(action) {
    console.error(`Authentication error during ${action}. Redirecting to login.`);
    localStorage.clear();
    window.location.href = "InicioSesionEmpleados.html";
}

async function handleResponse(response, action, allowNoContent = false) {
    if (response.ok) {
        if (allowNoContent && response.status === 204) {
            return null;
        }
        return await response.json();
    } else {
        if (response.status === 401 || response.status === 403) {
            console.error(`Authentication error during ${action}. Redirecting to login.`);
            localStorage.clear();
            window.location.href = "InicioSesionEmpleados.html";
            return null;
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
}
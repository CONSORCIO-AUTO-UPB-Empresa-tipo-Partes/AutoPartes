// Configuración global
const API_URL = '/api/catalog';
let productosCatalogo = [];
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    initModoClaro();
    initCarrito();
    cargarCatalogo();
    setupEventListeners();
});

// 1. Conexión al Controller de Catálogo
async function cargarCatalogo() {
    try {
        mostrarLoader();

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        productosCatalogo = await response.json();
        mostrarProductosEnCatalogo();
    } catch (error) {
        console.error("Error al cargar el catálogo:", error);
        mostrarError("Error al cargar los productos. Por favor, intente más tarde.");
    } finally {
        ocultarLoader();
    }
}

// 2. Función de Agregar al Carrito
function agregarAlCarrito(productoId) {
    const producto = productosCatalogo.find(p => p.id === productoId);

    if (!producto) {
        console.error("Producto no encontrado");
        mostrarError("Producto no disponible");
        return;
    }

    // Verificar si el producto ya está en el carrito
    const itemExistente = carrito.find(item => item.id === producto.id);

    if (itemExistente) {
        // Incrementar la cantidad si ya existe
        itemExistente.cantidad += 1;
    } else {
        // Agregar nuevo item al carrito
        carrito.push({
            id: producto.id,
            nombre: producto.itemname,
            precio: producto.price,
            imagen: producto.imagepath,
            cantidad: 1,
            disponible: producto.stock
        });
    }

    // Actualizar localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Actualizar UI
    actualizarContadorCarrito();
    mostrarNotificacion(`${producto.itemname} agregado al carrito`);
}

// 3. Persistencia del Carrito
function actualizarContadorCarrito() {
    const contador = document.getElementById('carritoContador');
    if (!contador) return;

    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);

    contador.textContent = totalItems;
    contador.style.display = totalItems > 0 ? 'inline-block' : 'none';
}

// 4. Visualización de Productos
function mostrarProductosEnCatalogo() {
    const catalogoContainer = document.getElementById('catalogoContainer');

    if (!productosCatalogo || productosCatalogo.length === 0) {
        catalogoContainer.innerHTML = `
            <div class="alert alert-info">
                No hay productos disponibles en el catálogo.
            </div>`;
        return;
    }

    let html = '<div class="category-container">';

    productosCatalogo.forEach(producto => {
        const precioFormateado = producto.price?.toLocaleString('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }) || 'Precio no disponible';

        html += `
            <div class="category-card">
                ${producto.imagepath ?
            `<img src="${producto.imagepath}" alt="${producto.itemname}">` :
            '<div class="no-image-placeholder">Sin imagen</div>'}
                <h4>${producto.itemname}</h4>
                <div class="description">${producto.description || 'Descripción no disponible'}</div>
                <div class="price">${precioFormateado}</div>
                ${producto.stock > 0 ?
            `<button class="btn btn-primary" onclick="agregarAlCarrito(${producto.id})">
                        <i class="fas fa-cart-plus"></i> Agregar al carrito
                    </button>` :
            '<button class="btn btn-secondary" disabled>Agotado</button>'}
            </div>`;
    });

    html += '</div>';
    catalogoContainer.innerHTML = html;
}

// 5. Funciones de UI/UX
function mostrarNotificacion(mensaje) {
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion-carrito';
    notificacion.innerHTML = `
        <i class="fas fa-check-circle"></i>
        ${mensaje}
    `;

    document.body.appendChild(notificacion);

    setTimeout(() => {
        notificacion.classList.add('mostrar');
    }, 10);

    setTimeout(() => {
        notificacion.classList.remove('mostrar');
        setTimeout(() => {
            document.body.removeChild(notificacion);
        }, 300);
    }, 3000);
}

function mostrarError(mensaje) {
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show">
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
}

function mostrarLoader() {
    document.getElementById('loader').style.display = 'flex';
}

function ocultarLoader() {
    document.getElementById('loader').style.display = 'none';
}

// 6. Modo Claro/Oscuro
function initModoClaro() {
    const modoGuardado = localStorage.getItem("modo");
    if (modoGuardado === "claro") {
        document.body.classList.add("modo-claro");
    }

    document.querySelector('.toggle-mode').addEventListener('click', toggleMode);
}

function toggleMode() {
    const body = document.body;
    body.classList.toggle("modo-claro");

    localStorage.setItem("modo", body.classList.contains("modo-claro") ? "claro" : "oscuro");
}

// 7. Inicialización del Carrito
function initCarrito() {
    actualizarContadorCarrito();

    // Verificar items agotados
    carrito = carrito.filter(item => {
        const producto = productosCatalogo.find(p => p.id === item.id);
        return producto && producto.stock > 0;
    });

    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// 8. Configuración de Eventos
function setupEventListeners() {
    // Buscador de productos
    const buscador = document.getElementById('search-input');
    if (buscador) {
        buscador.addEventListener('input', filtrarProductos);
    }
}

// 9. Filtrado de productos
function filtrarProductos() {
    const busqueda = document.getElementById('search-input').value.toLowerCase();
    const productosFiltrados = productosCatalogo.filter(producto =>
        producto.itemname.toLowerCase().includes(busqueda) ||
        (producto.description && producto.description.toLowerCase().includes(busqueda))
    );

    mostrarProductosFiltrados(productosFiltrados);
}

function mostrarProductosFiltrados(productos) {
    const catalogoContainer = document.getElementById('catalogoContainer');

    if (productos.length === 0) {
        catalogoContainer.innerHTML = `
            <div class="alert alert-info">
                No se encontraron productos que coincidan con la búsqueda.
            </div>`;
        return;
    }

    // Reutilizamos la función de mostrar productos pero con la lista filtrada
    const temp = productosCatalogo;
    productosCatalogo = productos;
    mostrarProductosEnCatalogo();
    productosCatalogo = temp;
}
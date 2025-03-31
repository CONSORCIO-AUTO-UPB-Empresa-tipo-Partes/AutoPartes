// Configuración global
const API_URL = '/api/catalog';
let productosCatalogo = [];
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Variables para paginación
let currentPage = 1;
const productsPerPage = 12;
let filteredProducts = [];

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

        // Primero intenta cargar desde la API
        const response = await fetch(API_URL);

        if (response.ok) {
            productosCatalogo = await response.json();
        } else {
            // Si falla la API, usa los datos locales
            console.warn("API no disponible, usando datos locales");
            productosCatalogo = allProducts;
        }

        filteredProducts = [...productosCatalogo];
        mostrarProductosEnCatalogo();
    } catch (error) {
        console.error("Error al cargar el catálogo:", error);
        mostrarError("Error al cargar los productos. Por favor, intente más tarde.");

        // Usar datos locales como respaldo
        productosCatalogo = allProducts;
        filteredProducts = [...productosCatalogo];
        mostrarProductosEnCatalogo();
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

    const itemExistente = carrito.find(item => item.id === producto.id);

    if (itemExistente) {
        if (itemExistente.cantidad < (producto.stock || producto.available || 20)) {
            itemExistente.cantidad += 1;
        } else {
            mostrarNotificacion(`No hay más unidades disponibles de ${producto.itemname || producto.name}`);
            return;
        }
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.itemname || producto.name,
            precio: producto.price,
            imagen: producto.imagepath || producto.image,
            cantidad: 1,
            disponible: producto.stock || producto.available || 20
        });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
    mostrarNotificacion(`${producto.itemname || producto.name} agregado al carrito`);
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
    const catalogoContainer = document.getElementById('product-container') || document.getElementById('catalogoContainer');
    if (!catalogoContainer) return;

    // Calcular índices para la paginación
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);

    if (!productsToShow || productsToShow.length === 0) {
        catalogoContainer.innerHTML = `
            <div class="alert alert-info">
                No hay productos disponibles en el catálogo.
            </div>`;
        return;
    }

    let html = '<div class="product-grid">';

    productsToShow.forEach(producto => {
        const precioFormateado = producto.price ? producto.price.toLocaleString('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }) : 'Precio no disponible';

        const nombre = producto.itemname || producto.name;
        const imagen = producto.imagepath || producto.image;
        const descripcion = producto.description || 'Descripción no disponible';
        const disponible = producto.stock || producto.available;

        html += `
            <div class="category-card">
                ${imagen ?
            `<img src="${imagen}" alt="${nombre}" onerror="this.src='../static/img/placeholder-producto.png'">` :
            '<div class="no-image-placeholder">Sin imagen</div>'}
                <h4>${nombre}</h4>
                <div class="description">${descripcion}</div>
                <div class="price">${precioFormateado}</div>
                ${disponible > 0 ?
            `<button class="btn btn-primary" onclick="agregarAlCarrito(${producto.id})">
                        <i class="fas fa-cart-plus"></i> Agregar al carrito
                    </button>` :
            '<button class="btn btn-secondary" disabled>Agotado</button>'}
            </div>`;
    });

    html += '</div>';
    catalogoContainer.innerHTML = html;

    // Renderizar paginación
    renderPagination();
}

// 5. Funciones de UI/UX
function mostrarNotificacion(mensaje) {
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion-carrito';
    notificacion.innerHTML = `
        <i class="fas fa-check-circle"></i> ${mensaje}
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
    const errorContainer = document.getElementById('errorContainer') || document.createElement('div');
    errorContainer.id = 'errorContainer';
    errorContainer.innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show">
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;

    if (!document.getElementById('errorContainer')) {
        document.body.prepend(errorContainer);
    }
}

function mostrarLoader() {
    const loader = document.getElementById('loader') || document.createElement('div');
    loader.id = 'loader';
    loader.innerHTML = '<div class="spinner-border text-primary"></div>';
    loader.style.display = 'flex';

    if (!document.getElementById('loader')) {
        document.body.appendChild(loader);
    }
}

function ocultarLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = 'none';
    }
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
        return producto && (producto.stock > 0 || producto.available > 0);
    });

    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// 8. Configuración de Eventos
function setupEventListeners() {
    const buscador = document.getElementById('search-input');
    if (buscador) {
        buscador.addEventListener('input', filtrarProductos);
    }
}

// 9. Filtrado de productos
function filtrarProductos() {
    const busqueda = document.getElementById('search-input').value.toLowerCase().trim();

    if (busqueda === "") {
        filteredProducts = [...productosCatalogo];
    } else {
        filteredProducts = productosCatalogo.filter(producto => {
            const nombre = producto.itemname || producto.name;
            const descripcion = producto.description || '';
            const categoria = producto.category || '';

            return nombre.toLowerCase().includes(busqueda) ||
                descripcion.toLowerCase().includes(busqueda) ||
                categoria.toLowerCase().includes(busqueda);
        });
    }

    currentPage = 1;
    mostrarProductosEnCatalogo();
}

// 10. Paginación
function renderPagination() {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;

    const pageCount = Math.ceil(filteredProducts.length / productsPerPage);

    pagination.innerHTML = '';

    // Botón Anterior
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(${currentPage - 1})">Anterior</a>`;
    pagination.appendChild(prevLi);

    // Números de página
    for (let i = 1; i <= pageCount; i++) {
        const pageLi = document.createElement('li');
        pageLi.className = `page-item ${i === currentPage ? 'active' : ''}`;
        pageLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(${i})">${i}</a>`;
        pagination.appendChild(pageLi);
    }

    // Botón Siguiente
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === pageCount ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(${currentPage + 1})">Siguiente</a>`;
    pagination.appendChild(nextLi);
}

function changePage(page) {
    currentPage = page;
    mostrarProductosEnCatalogo();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Datos de productos locales (respaldo)
const allProducts = [
    // ... (aquí iría el array completo de productos que tenías en el original)
    // He omitido esta parte por brevedad, pero deberías mantenerla igual que en tu código original
];

// Hacer funciones accesibles globalmente
window.agregarAlCarrito = agregarAlCarrito;
window.changePage = changePage;
window.toggleMode = toggleMode;
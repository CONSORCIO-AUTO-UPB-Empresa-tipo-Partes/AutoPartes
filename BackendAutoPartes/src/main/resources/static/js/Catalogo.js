// Configuración global
const API_URL = '/api/catalog';
let productosCatalogo = [];
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

 feature/frontend/ArregloDeCatalogo
// Variables para paginación
let currentPage = 1;
const productsPerPage = 12;
let filteredProducts = [];


 develop
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

 feature/frontend/ArregloDeCatalogo
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

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        productosCatalogo = await response.json();
 develop
        mostrarProductosEnCatalogo();
    } catch (error) {
        console.error("Error al cargar el catálogo:", error);
        mostrarError("Error al cargar los productos. Por favor, intente más tarde.");
 feature/frontend/ArregloDeCatalogo

        // Usar datos locales como respaldo
        productosCatalogo = allProducts;
        filteredProducts = [...productosCatalogo];
        mostrarProductosEnCatalogo();

 develop
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
 feature/frontend/ArregloDeCatalogo
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
 develop
    }
}

 feature/frontend/ArregloDeCatalogo
function ocultarLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = 'none';
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
 develop
}

// 6. Modo Claro/Oscuro
function initModoClaro() {
    const modoGuardado = localStorage.getItem("modo");
    if (modoGuardado === "claro") {
        document.body.classList.add("modo-claro");
    }

<<<<<<< HEAD
 feature/frontend/ArregloDeCatalogo
    const toggleBtn = document.querySelector('.toggle-mode');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleMode);
    }
=======
    document.querySelector('.toggle-mode').addEventListener('click', toggleMode);
>>>>>>> c8d5c49 (Arreglo final de catalogo en el css y java script)
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
=======
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
 develop

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

 feature/frontend/ArregloDeCatalogo
    const toggleBtn = document.querySelector('.toggle-mode');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleMode);
    }
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
    // Llantas
    { id: 1, name: 'Llanta Deportiva', category: 'llantas', price: 150000, image: '../assets/IMAGENES/neumatico%20%234.jpeg', description: 'Llanta de alto rendimiento para deportivos. Diseño aerodinámico.', available: true },
    { id: 2, name: 'Llanta de Aleación', category: 'llantas', price: 200000, image: '../assets/IMAGENES/neumatico%20%232.jpeg', description: 'Llanta ligera y resistente, ideal para todo tipo de vehículos.', available: true },
    { id: 3, name: 'Llanta Lisas', category: 'llantas', price: 120000, image: '../assets/IMAGENES/neumatico10.avif', description: 'Llanta lisa para un manejo suave y cómodo.', available: true },
    { id: 4, name: 'Llanta Radiales', category: 'llantas', price: 180000, image: '../assets/IMAGENES/neumatico7.jpg', description: 'Llanta radial para mayor durabilidad y rendimiento.', available: true },
    { id: 5, name: 'Llanta Mixtas', category: 'llantas', price: 160000, image: '../assets/IMAGENES/neumatico8.jpg', description: 'Llanta mixta para todo tipo de terrenos.', available: true },
    { id: 6, name: 'Llanta Sólidas', category: 'llantas', price: 220000, image: '../assets/IMAGENES/neumatico9.jpg', description: 'Llanta sólida para vehículos pesados.', available: true },
    { id: 7, name: 'Llanta Estándar', category: 'llantas', price: 100000, image: '../assets/IMAGENES/neumatico10.avif', description: 'Llanta estándar para uso diario.', available: true },
    { id: 8, name: 'Llanta de Carga Extra', category: 'llantas', price: 250000, image: '../assets/IMAGENES/neumatico9.jpg', description: 'Llanta diseñada para soportar cargas pesadas.', available: true },

    // Tubos de escape
    { id: 9, name: 'Tubo Estándar', category: 'tubos-escape', price: 80000, image: '../assets/IMAGENES/tubo%20de%20escape11.jpg', description: 'Tubo de escape estándar para vehículos comunes.', available: true },
    { id: 10, name: 'Tubo de Alto Rendimiento', category: 'tubos-escape', price: 150000, image: '../assets/IMAGENES/tubo12.jpg', description: 'Tubo de escape diseñado para mejorar el rendimiento del motor.', available: true },
    { id: 11, name: 'Tubo para Carro Deportivo', category: 'tubos-escape', price: 250000, image: '../assets/IMAGENES/tubo11.jpg', description: 'Tubo de escape especial para autos deportivos.', available: true },
    { id: 12, name: 'Tubo de Acero Inoxidable', category: 'tubos-escape', price: 200000, image: '../assets/IMAGENES/tubo9.jpg', description: 'Tubo de escape resistente a la corrosión.', available: true },
    { id: 13, name: 'Tubo de Doble Salida', category: 'tubos-escape', price: 300000, image: '../assets/IMAGENES/tuboescape%232.png', description: 'Tubo de escape con doble salida para mayor potencia.', available: true },
    { id: 14, name: 'Tubo Estándar', category: 'tubos-escape', price: 90000, image: '../assets/IMAGENES/tubo13.jpg', description: 'Tubo de escape básico para vehículos comunes.', available: true },
    { id: 15, name: 'Tubo Estándar', category: 'tubos-escape', price: 95000, image: '../assets/IMAGENES/tubo%2014.jpg', description: 'Tubo de escape básico para vehículos comunes.', available: true },
    { id: 16, name: 'Tubo Estándar', category: 'tubos-escape', price: 100000, image: '../assets/IMAGENES/tubo%2015.jpg', description: 'Tubo de escape básico para vehículos comunes.', available: true },

    // Exploradoras
    { id: 17, name: 'Exploradora Estándar', category: 'exploradoras', price: 50000, image: '../assets/IMAGENES/exploradora%20%234.webp', description: 'Exploradora básica para uso diario.', available: true },
    { id: 18, name: 'Exploradora Deportiva', category: 'exploradoras', price: 120000, image: '../assets/IMAGENES/exploradora%233.png', description: 'Exploradora diseñada para vehículos deportivos.', available: true },
    { id: 19, name: 'Exploradora de Acero Inoxidable', category: 'exploradoras', price: 180000, image: '../assets/IMAGENES/exploradoras%20%235.webp', description: 'Exploradora resistente a la corrosión.', available: true },
    { id: 20, name: 'Exploradora de Doble Salida', category: 'exploradoras', price: 250000, image: '../assets/IMAGENES/explo2.jpg', description: 'Exploradora con doble salida para mayor potencia.', available: true },
    { id: 21, name: 'Exploradora de Alto Rendimiento', category: 'exploradoras', price: 300000, image: '../assets/IMAGENES/explo3.jpg', description: 'Exploradora de alto rendimiento para terrenos difíciles.', available: true },
    { id: 22, name: 'Exploradora para Camionetas', category: 'exploradoras', price: 280000, image: '../assets/IMAGENES/explo4.jpg', description: 'Exploradora robusta para camionetas y SUV.', available: true },
    { id: 23, name: 'Exploradora Personalizada', category: 'exploradoras', price: 350000, image: '../assets/IMAGENES/explo5.webp', description: 'Exploradora con diseño personalizado.', available: true },
    { id: 24, name: 'Exploradora de Lujo', category: 'exploradoras', price: 400000, image: '../assets/IMAGENES/explo7.webp', description: 'Exploradora de alta gama con acabados premium.', available: true },

    // Cámaras
    { id: 25, name: 'Cámara Estándar', category: 'camaras', price: 60000, image: '../assets/IMAGENES/camaar%20%234.jpeg', description: 'Cámara básica para vehículos comunes.', available: true },
    { id: 26, name: 'Cámara de Alta Resolución', category: 'camaras', price: 100000, image: '../assets/IMAGENES/camaara%20%233.webp', description: 'Cámara con alta calidad de imagen.', available: true },
    { id: 27, name: 'Cámara Deportiva', category: 'camaras', price: 150000, image: '../assets/IMAGENES/camara%20%232.png', description: 'Cámara diseñada para vehículos deportivos.', available: true },
    { id: 28, name: 'Cámara de Visión Nocturna', category: 'camaras', price: 200000, image: '../assets/IMAGENES/camara%20%235.webp', description: 'Cámara con visión nocturna para mayor seguridad.', available: true },
    { id: 29, name: 'Cámara 360°', category: 'camaras', price: 250000, image: '../assets/IMAGENES/camara%231.jpeg', description: 'Cámara con visión panorámica de 360 grados.', available: true },
    { id: 30, name: 'Cámara para Motos', category: 'camaras', price: 120000, image: '../assets/IMAGENES/camara9.webp', description: 'Cámara especial para motocicletas.', available: true },
    { id: 31, name: 'Cámara de Seguridad', category: 'camaras', price: 180000, image: '../assets/IMAGENES/camara10.jpg', description: 'Cámara de seguridad para vehículos.', available: true },
    { id: 32, name: 'Cámara de Lujo', category: 'camaras', price: 300000, image: '../assets/IMAGENES/cmara8.jpg', description: 'Cámara de alta gama con acabados premium.', available: true },

    // Tapetes
    { id: 33, name: 'Tapete Estándar', category: 'tapetes', price: 30000, image: '../assets/IMAGENES/tapete%20baul.png', description: 'Tapete básico para vehículos comunes.', available: true },
    { id: 34, name: 'Tapete de Goma', category: 'tapetes', price: 50000, image: '../assets/IMAGENES/tapetes%20%233.png', description: 'Tapete resistente y fácil de limpiar.', available: true },
    { id: 35, name: 'Tapete Personalizado', category: 'tapetes', price: 80000, image: '../assets/IMAGENES/tapetes%20de%20carro%20%232.jpg', description: 'Tapete con diseño personalizado.', available: true },
    { id: 36, name: 'Tapete de Lujo', category: 'tapetes', price: 120000, image: '../assets/IMAGENES/tapete8.webp', description: 'Tapete de alta gama con acabados premium.', available: true },
    { id: 37, name: 'Tapete Antideslizante', category: 'tapetes', price: 70000, image: '../assets/IMAGENES/tapete6.jpg', description: 'Tapete con superficie antideslizante.', available: true },
    { id: 38, name: 'Tapete para Camionetas', category: 'tapetes', price: 100000, image: '../assets/IMAGENES/Tapete5.jpg', description: 'Tapete robusto para camionetas y SUV.', available: true },
    { id: 39, name: 'Tapete de Felpa', category: 'tapetes', price: 90000, image: '../assets/IMAGENES/tapete4.avif', description: 'Tapete suave y cómodo para el interior del vehículo.', available: true },
    { id: 40, name: 'Tapete color rosa', category: 'tapetes', price: 110000, image: '../assets/IMAGENES/tapete7.webp', description: 'Tapete de caucho resistente al agua y al desgaste.', available: true },

    // Estribos
    { id: 41, name: 'Estribo Estándar', category: 'estribos', price: 80000, image: '../assets/IMAGENES/estribos%231.webp', description: 'Estribo básico para vehículos comunes.', available: true },
    { id: 42, name: 'Estribo Deportivo', category: 'estribos', price: 150000, image: '../assets/IMAGENES/estribos%232.jpeg', description: 'Estribo diseñado para vehículos deportivos.', available: true },
    { id: 43, name: 'Estribo de Acero Inoxidable', category: 'estribos', price: 200000, image: '../assets/IMAGENES/estribo%233.jpeg', description: 'Estribo resistente a la corrosión.', available: true },
    { id: 44, name: 'Estribo de Lujo', category: 'estribos', price: 250000, image: '../assets/IMAGENES/ESTRIBOS%234.png', description: 'Estribo de alta gama con acabados premium.', available: true },
    { id: 45, name: 'Estribo para Camionetas', category: 'estribos', price: 180000, image: '../assets/IMAGENES/estribos%235.webp', description: 'Estribo robusto para camionetas y SUV.', available: true },
    { id: 46, name: 'Estribo Personalizado', category: 'estribos', price: 220000, image: '../assets/IMAGENES/estribos1.jpg', description: 'Estribo con diseño personalizado.', available: true },
    { id: 47, name: 'Estribo Antideslizante', category: 'estribos', price: 160000, image: '../assets/IMAGENES/estribos2.webp', description: 'Estribo con superficie antideslizante.', available: true },
    { id: 48, name: 'Estribo de Carga Extra', category: 'estribos', price: 280000, image: '../assets/IMAGENES/estribos3.jpg', description: 'Estribo diseñado para soportar cargas pesadas.', available: true },

    // Perillas
    { id: 49, name: 'Perilla Estándar', category: 'perillas', price: 20000, image: '../assets/IMAGENES/perilla5.webp', description: 'Perilla básica para vehículos comunes.', available: true },
    { id: 50, name: 'Perilla Deportiva', category: 'perillas', price: 50000, image: '../assets/IMAGENES/perilladepo.jpg', description: 'Perilla diseñada para vehículos deportivos.', available: true },
    { id: 51, name: 'Perilla de Lujo', category: 'perillas', price: 80000, image: '../assets/IMAGENES/perillas%231.jpeg', description: 'Perilla de alta gama con acabados premium.', available: true },
    { id: 52, name: 'Perilla Personalizada', category: 'perillas', price: 70000, image: '../assets/IMAGENES/perilla%20%232.png', description: 'Perilla con diseño personalizado.', available: true },
    { id: 53, name: 'Perilla Antideslizante', category: 'perillas', price: 60000, image: '../assets/IMAGENES/perillaanti.webp', description: 'Perilla con superficie antideslizante.', available: true },
    { id: 54, name: 'Perilla Ergonómica', category: 'perillas', price: 90000, image: '../assets/IMAGENES/perillas2.webp', description: 'Perilla diseñada para mayor comodidad.', available: true },
    { id: 55, name: 'Perilla de Aluminio', category: 'perillas', price: 100000, image: '../assets/IMAGENES/perillas3.jpg', description: 'Perilla de aluminio resistente y ligera.', available: true },
    { id: 56, name: 'Perilla de Acero Inoxidable', category: 'perillas', price: 120000, image: '../assets/IMAGENES/perillas4.webp', description: 'Perilla de acero inoxidable resistente a la corrosión.', available: true },

    // Spoilers
    { id: 57, name: 'Spoiler Estándar', category: 'spoilers', price: 100000, image: '../assets/IMAGENES/Spoiler%231.jpg', description: 'Spoiler básico para vehículos comunes.', available: true },
    { id: 58, name: 'Spoiler Deportivo', category: 'spoilers', price: 200000, image: '../assets/IMAGENES/spoilers%232.png', description: 'Spoiler diseñado para vehículos deportivos.', available: true },
    { id: 59, name: 'Spoiler de Lujo', category: 'spoilers', price: 300000, image: '../assets/IMAGENES/spoilers%233.webp', description: 'Spoiler de alta gama con acabados premium.', available: true },
    { id: 60, name: 'Spoiler Personalizado', category: 'spoilers', price: 250000, image: '../assets/IMAGENES/spoilers%20%235.jpg', description: 'Spoiler con diseño personalizado.', available: true },
    { id: 61, name: 'Spoiler de Fibra de Carbono', category: 'spoilers', price: 350000, image: '../assets/IMAGENES/spoi2.jpg', description: 'Spoiler ligero y resistente de fibra de carbono.', available: true },
    { id: 62, name: 'Spoiler Ajustable', category: 'spoilers', price: 280000, image: '../assets/IMAGENES/spoi3.jpg', description: 'Spoiler con ángulo ajustable para mayor aerodinámica.', available: true },
    { id: 63, name: 'Spoiler para Camionetas', category: 'spoilers', price: 320000, image: '../assets/IMAGENES/spoi4.webp', description: 'Spoiler robusto para camionetas y SUV.', available: true },
    { id: 64, name: 'Spoiler de Carga Extra', category: 'spoilers', price: 400000, image: '../assets/IMAGENES/spoi5.jpg', description: 'Spoiler diseñado para soportar cargas pesadas.', available: true },

    // Retrovisores
    { id: 65, name: 'Retrovisor Estándar', category: 'retrovisores', price: 50000, image: '../assets/IMAGENES/retrovisores%20%231.jpg', description: 'Retrovisor básico para vehículos comunes.', available: true },
    { id: 66, name: 'Retrovisor Deportivo', category: 'retrovisores', price: 100000, image: '../assets/IMAGENES/retro6.jpg', description: 'Retrovisor diseñado para vehículos deportivos.', available: true },
    { id: 67, name: 'Retrovisor de Lujo', category: 'retrovisores', price: 150000, image: '../assets/IMAGENES/retro2.jpg', description: 'Retrovisor de alta gama con acabados premium.', available: true },
    { id: 68, name: 'Retrovisor Personalizado', category: 'retrovisores', price: 120000, image: '../assets/IMAGENES/retro3.webp', description: 'Retrovisor con diseño personalizado.', available: true },
    { id: 69, name: 'Retrovisor Antideslumbrante', category: 'retrovisores', price: 130000, image: '../assets/IMAGENES/retro4.jpg', description: 'Retrovisor con función antideslumbrante.', available: true },
    { id: 70, name: 'Retrovisor con Cámara', category: 'retrovisores', price: 200000, image: '../assets/IMAGENES/retro5.jpg', description: 'Retrovisor integrado con cámara de seguridad.', available: true },
    { id: 71, name: 'Retrovisor para Camionetas', category: 'retrovisores', price: 180000, image: '../assets/IMAGENES/retro6.jpg', description: 'Retrovisor robusto para camionetas y SUV.', available: true },
    { id: 72, name: 'Retrovisor de Carga Extra', category: 'retrovisores', price: 250000, image: '../assets/IMAGENES/retro8.jpg', description: 'Retrovisor diseñado para soportar cargas pesadas.', available: true },

    // Repuestos
    { id: 73, name: 'Repuesto Estándar', category: 'repuestos', price: 40000, image: '../assets/IMAGENES/repu1.jpg', description: 'Repuesto básico para vehículos comunes.', available: true },
    { id: 74, name: 'Repuesto Deportivo', category: 'repuestos', price: 80000, image: '../assets/IMAGENES/repu2.jpg', description: 'Repuesto diseñado para vehículos deportivos.', available: true },
    { id: 75, name: 'Repuesto de aceite', category: 'repuestos', price: 120000, image: '../assets/IMAGENES/repu3.jpg', description: 'Repuesto de aceite para todo tipo de carro', available: true },
    { id: 76, name: 'Repuesto de batería', category: 'repuestos', price: 100000, image: '../assets/IMAGENES/repu4.webp', description: 'Repuesto de baterías para carros.', available: true },
    { id: 77, name: 'Pastillas de frenos', category: 'repuestos', price: 150000, image: '../assets/IMAGENES/repu5.jpg', description: 'Repuesto robusto para camionetas y SUV.', available: true },
    { id: 78, name: 'Repuesto de motor', category: 'repuestos', price: 200000, image: '../assets/IMAGENES/repu6.jpg', description: 'Repuesto diseñado para motores de carros', available: true },
    { id: 79, name: 'Repuesto de Alta Resistencia', category: 'repuestos', price: 180000, image: '../assets/IMAGENES/repuesto7.jpg', description: 'Repuesto de alta resistencia para uso intensivo.', available: true },
    { id: 80, name: 'Repuesto de Acero Inoxidable', category: 'repuestos', price: 220000, image: '../assets/IMAGENES/repuesto8.jpg', description: 'Repuesto de acero inoxidable resistente a la corrosión.', available: true }
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

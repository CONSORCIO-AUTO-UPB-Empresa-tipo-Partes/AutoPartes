// CarritoController.js

// Muestra productos de una categoría
export function showProducts(category) {
    document.querySelectorAll('.product-section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById('category-section').style.display = 'none';
    const sectionToShow = document.getElementById(`${category}-section`);
    if (sectionToShow) {
        sectionToShow.style.display = 'block';
    } else {
        console.error(`Sección no encontrada: ${category}-section`);
    }
}

// Volver a la sección de categorías
export function showCategories() {
    document.querySelectorAll('.product-section').forEach(section => section.style.display = 'none');
    document.getElementById('category-section').style.display = 'block';
}

// Buscar una categoría
export function searchCategory(event) {
    event.preventDefault();
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const categories = {
        'llantas': 'llantas',
        'tubos de escape': 'tubos-escape',
        'exploradoras': 'exploradoras',
        'cámaras': 'camaras',
        'tapetes': 'tapetes',
        'estribos': 'estribos',
        'perillas': 'perillas',
        'spoilers': 'spoilers',
        'retrovisores': 'retrovisores',
        'repuestos': 'repuestos'
    };

    if (categories[searchTerm]) {
        showProducts(categories[searchTerm]);
    } else {
        alert('Categoría no encontrada');
    }
}

// Agregar producto al carrito
export function addToCart(productName) {
    const isLoggedIn = false; // Cambiar a true si el usuario está logueado
    if (!isLoggedIn) {
        document.getElementById('loginModal').style.display = 'flex';
    } else {
        alert(`${productName} añadido al carrito`);
    }
}

// Cerrar modal de login
export function closeModal() {
    document.getElementById('loginModal').style.display = 'none';
}

// Modo claro/oscuro
export function toggleMode() {
    const body = document.body;
    body.classList.toggle("modo-claro");

    if (body.classList.contains("modo-claro")) {
        localStorage.setItem("modo", "claro");
    } else {
        localStorage.setItem("modo", "oscuro");
    }
}

// Aplicar modo guardado en localStorage
export function aplicarModoGuardado() {
    const modoGuardado = localStorage.getItem("modo");
    if (modoGuardado === "claro") {
        document.body.classList.add("modo-claro");
    }
}

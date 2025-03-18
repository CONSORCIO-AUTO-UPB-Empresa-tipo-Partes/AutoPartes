// =============================================
// Funcionalidad del Modo Claro/Oscuro
// =============================================

function toggleMode() {
    const body = document.body;
    body.classList.toggle("modo-claro");

    // Guardar el modo en localStorage
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
    } else {
        document.body.classList.remove("modo-claro");
    }
}

// Aplicar el modo guardado al cargar la página
document.addEventListener("DOMContentLoaded", aplicarModoGuardado);

// =============================================
// Funcionalidad del Carrito
// =============================================

function updateQuantity(button, change) {
    let item = button.closest('.cart-item');
    let quantityElement = item.querySelector('.quantity');
    let availableElement = item.querySelector('.available');
    let price = parseInt(item.getAttribute('data-price'));
    let quantity = parseInt(quantityElement.textContent);
    let available = parseInt(availableElement.textContent);

    if (change > 0 && available > 0) {
        quantity++;
        available--;
    } else if (change < 0 && quantity > 1) {
        quantity--;
        available++;
    }

    quantityElement.textContent = quantity;
    availableElement.textContent = available;
    updateTotal();
}

function removeFromCart(button) {
    button.closest('.cart-item').remove();
    updateTotal();
}

function updateTotal() {
    let total = 0;
    document.querySelectorAll('.cart-item').forEach(item => {
        let quantity = parseInt(item.querySelector('.quantity').textContent);
        let price = parseInt(item.getAttribute('data-price'));
        total += quantity * price;
    });
    document.getElementById('total-price').textContent = total > 0 ? `$${total.toLocaleString()}` : '$0';
}

// =============================================
// Funcionalidad de Solicitar Devolución
// =============================================

function requestReturn(productName, deliveryDate, status) {
    const today = new Date(); // Fecha actual
    const delivery = new Date(deliveryDate); // Fecha de entrega
    const daysSinceDelivery = Math.floor((today - delivery) / (1000 * 60 * 60 * 24)); // Días desde la entrega

    // Verificar si el producto fue entregado
    if (status !== "Entregado") {
        alert("No se puede solicitar la devolución. El producto no ha sido entregado.");
        return; // Detener la función si no está entregado
    }

    // Verificar si han pasado más de 15 días desde la entrega
    if (daysSinceDelivery > 15) {
        alert("No se puede solicitar la devolución. Han pasado más de 15 días desde la entrega.");
        return; // Detener la función si no se cumple la condición
    }

    // Crear un objeto para la devolución
    const returnRequest = {
        productName: productName,
        date: new Date().toLocaleDateString(),
        status: "En proceso"
    };

    // Obtener las devoluciones existentes o inicializar un array vacío
    let returns = JSON.parse(localStorage.getItem("returns")) || [];
    returns.push(returnRequest); // Añadir la nueva devolución
    localStorage.setItem("returns", JSON.stringify(returns)); // Guardar en localStorage

    // Mostrar las devoluciones
    showReturns();
    alert(`Devolución solicitada para: ${productName}`);
}

function showReturns() {
    const returnsContainer = document.getElementById("returns-container");
    const returnsList = document.getElementById("returns-list");
    const returns = JSON.parse(localStorage.getItem("returns")) || [];

    if (returns.length > 0) {
        returnsContainer.style.display = "block"; // Mostrar el contenedor
        returnsList.innerHTML = returns.map(returnItem => `
            <div class="return-item">
                <h4>${returnItem.productName}</h4>
                <p><strong>Fecha de devolución:</strong> ${returnItem.date}</p>
                <p><strong>Estado:</strong> ${returnItem.status}</p>
            </div>
        `).join("");
    } else {
        returnsContainer.style.display = "none"; // Ocultar si no hay devoluciones
    }
}

// Cargar las devoluciones al iniciar la página
document.addEventListener("DOMContentLoaded", showReturns);

// =============================================
// Funcionalidad de Navegación (Categorías y Productos)
// =============================================

function showProducts(category) {
    // Oculta todas las secciones
    document.querySelectorAll('.product-section').forEach(section => {
        section.style.display = 'none';
    });
    // Oculta la sección de categorías
    document.getElementById('category-section').style.display = 'none';
    // Muestra la sección de la categoría seleccionada
    const sectionToShow = document.getElementById(`${category}-section`);
    if (sectionToShow) {
        sectionToShow.style.display = 'block';
    } else {
        console.error(`Sección no encontrada: ${category}-section`);
    }
}

function showCategories() {
    // Oculta todas las secciones de productos
    document.querySelectorAll('.product-section').forEach(section => {
        section.style.display = 'none';
    });
    // Muestra la sección de categorías
    document.getElementById('category-section').style.display = 'block';
}

function searchCategory(event) {
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

// =============================================
// Funcionalidad del Modal de Login
// =============================================

function addToCart(productName) {
    const isLoggedIn = false; // Cambiar a true si el usuario está logueado
    if (!isLoggedIn) {
        document.getElementById('loginModal').style.display = 'flex';
    } else {
        alert(`${productName} añadido al carrito`);
    }
}

function closeModal() {
    document.getElementById('loginModal').style.display = 'none';
}
// Función para cargar el carrito desde localStorage
    function loadCart() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartItemsContainer = document.getElementById('cart-items');
        cartItemsContainer.innerHTML = '';

        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.setAttribute('data-price', item.price);
            cartItem.setAttribute('data-index', index);

            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>Cantidad: <span class="quantity">${item.quantity}</span></p>
                    <p>Disponible: <span class="available">${item.available}</span> unidades</p>
                    <p>Precio: $${parseInt(item.price).toLocaleString()}</p>
                </div>
                <div class="cart-item-actions">
                    <button onclick="updateQuantity(this, -1)">➖</button>
                    <button onclick="updateQuantity(this, 1)">➕</button>
                    <button onclick="removeFromCart(this)">🗑️</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        updateTotal();
    }

    // Función para actualizar la cantidad de un producto
    function updateQuantity(button, change) {
        const item = button.closest('.cart-item');
        const quantityElement = item.querySelector('.quantity');
        const availableElement = item.querySelector('.available');
        const price = parseFloat(item.getAttribute('data-price')); // Convertir a número
        const index = parseInt(item.getAttribute('data-index'));
        let quantity = parseInt(quantityElement.textContent); // Convertir a número
        let available = parseInt(availableElement.textContent); // Convertir a número

        if (change > 0 && available > 0) {
            quantity++;
            available--;
        } else if (change < 0 && quantity > 1) {
            quantity--;
            available++;
        }

        quantityElement.textContent = quantity;
        availableElement.textContent = available;

        // Actualizar el carrito en localStorage
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart[index].quantity = quantity;
        cart[index].available = available;
        localStorage.setItem('cart', JSON.stringify(cart));

        updateTotal();
    }

    // Función para eliminar un producto del carrito
    function removeFromCart(button) {
        const item = button.closest('.cart-item');
        const index = parseInt(item.getAttribute('data-index'));

        // Eliminar el producto del carrito en localStorage
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));

        // Recargar el carrito
        loadCart();
    }

    // Función para actualizar el total
    function updateTotal() {
        let total = 0;
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.forEach(item => {
            total += item.quantity * item.price; // Multiplicar cantidad por precio
        });
        document.getElementById('total-price').textContent = `$${total.toLocaleString()}`;
    }

    // Función para continuar a la factura
    function continueToCheckout() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length === 0) {
            alert('El carrito está vacío.');
            return;
        }
        window.location.href = 'Factura.html';
    }

// Función para mostrar la sección de productos de una categoría
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

    // Función para volver a la sección de categorías
    function showCategories() {
        // Oculta todas las secciones de productos
        document.querySelectorAll('.product-section').forEach(section => {
            section.style.display = 'none';
        });
        // Muestra la sección de categorías
        document.getElementById('category-section').style.display = 'block';
    }

    // Función para buscar categorías
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
// View/carritoView.js

export const cartView = {
    // Renderizar el carrito en la interfaz
    renderCart(cart) {
        const cartItemsContainer = document.getElementById('cart-items');
        cartItemsContainer.innerHTML = '';

        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.setAttribute('data-price', item.price);

            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>Cantidad: <span class="quantity">${item.quantity}</span></p>
                    <p>Disponible: <span class="available">${item.available}</span> unidades</p>
                    <p>Precio: $${parseInt(item.price).toLocaleString()}</p>
                </div>
                <div class="cart-item-actions">
                    <button onclick="cartController.updateQuantity(${index}, -1)">➖</button>
                    <button onclick="cartController.updateQuantity(${index}, 1)">➕</button>
                    <button onclick="cartController.removeFromCart(${index})">🗑️</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        this.updateTotal(cart);
    },

    // Actualizar el total en la interfaz
    updateTotal(cart) {
        const total = cartModel.calculateTotal(cart);
        document.getElementById('total-price').textContent = total > 0 ? `$${total.toLocaleString()}` : '$0';
    },

    // Mostrar modal de inicio de sesión
    showLoginModal() {
        document.getElementById('loginModal').style.display = 'flex';
    },

    // Ocultar modal de inicio de sesión
    hideLoginModal() {
        document.getElementById('loginModal').style.display = 'none';
    },

    // Cambiar el modo claro/oscuro
    toggleMode() {
        const body = document.body;
        body.classList.toggle("modo-claro");
        localStorage.setItem("modo", body.classList.contains("modo-claro") ? "claro" : "oscuro");
    },

    // Aplicar el modo guardado
    aplicarModoGuardado() {
        const modoGuardado = localStorage.getItem("modo");
        if (modoGuardado === "claro") {
            document.body.classList.add("modo-claro");
        }
    },
};
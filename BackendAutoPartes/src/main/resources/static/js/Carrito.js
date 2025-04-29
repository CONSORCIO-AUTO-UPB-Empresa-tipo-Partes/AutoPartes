document.addEventListener('DOMContentLoaded', function() {
    cargarCarrito();
    calcularTotal();
});

function cargarCarrito() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById('cart-items');

    // Limpiar contenedor
    cartContainer.innerHTML = '';

    if (cartItems.length === 0) {
        cartContainer.innerHTML = '<p class="text-center">No hay productos en el carrito</p>';
        return;
    }

    // Agregar cada item al carrito
    cartItems.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.dataset.price = item.unitPrice;
        itemElement.dataset.index = index;

        itemElement.innerHTML = `
            <img src="${item.itemImage}" alt="${item.itemName}">
            <div class="cart-item-details">
                <h4>${item.itemName}</h4>
                <p>${item.itemDescription || ''}</p>
                <p>Cantidad: <span class="quantity">${item.quantity}</span></p>
                <p>Disponible: <span class="available">${item.available}</span> unidades</p>
                <p>Precio unitario: $${parseFloat(item.unitPrice).toLocaleString('es-CO')}</p>
                <p>Total: $${(parseFloat(item.unitPrice) * item.quantity).toLocaleString('es-CO')}</p>
            </div>
            <div class="cart-item-actions">
                <button onclick="updateQuantity(this, -1)">➖</button>
                <button onclick="updateQuantity(this, 1)">➕</button>
                <button onclick="removeFromCart(this)">🗑️</button>
            </div>
        `;

        cartContainer.appendChild(itemElement);
    });
}

function updateQuantity(button, delta) {
    const cartItem = button.closest('.cart-item');
    const index = parseInt(cartItem.dataset.index);
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (index >= 0 && index < cart.length) {
        // Aplicar cambio de cantidad
        const newQuantity = cart[index].quantity + delta;

        // Validar límites
        if (newQuantity <= 0) {
            removeFromCart(button);
            return;
        }

        if (newQuantity > cart[index].available) {
            alert(`Solo hay ${cart[index].available} unidades disponibles`);
            return;
        }

        // Actualizar cantidad
        cart[index].quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));

        // Actualizar UI
        cartItem.querySelector('.quantity').textContent = newQuantity;
        cartItem.querySelector('.cart-item-details p:last-child').textContent =
            `Total: $${(parseFloat(cart[index].unitPrice) * newQuantity).toLocaleString('es-CO')}`;

        calcularTotal();
    }
}

function removeFromCart(button) {
    const cartItem = button.closest('.cart-item');
    const index = parseInt(cartItem.dataset.index);
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (index >= 0 && index < cart.length) {
        // Eliminar item del array
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));

        // Eliminar elemento del DOM
        cartItem.remove();

        // Recargar carrito para actualizar índices
        cargarCarrito();
        calcularTotal();
    }
}

function calcularTotal() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let total = 0;

    cart.forEach(item => {
        total += parseFloat(item.unitPrice) * item.quantity;
    });

    document.getElementById('total-price').textContent = `$${total.toLocaleString('es-CO')}`;
}

function continueToCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        alert('El carrito está vacío');
        return;
    }

    // Aquí iría la lógica para redirigir al checkout o procesar la compra
    alert('Redirigiendo al proceso de pago...');
    // window.location.href = 'Checkout.html';
}

function toggleMode() {
    document.body.classList.toggle('dark-mode');
}

async function crearFacturaYActualizarStock() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('Debe iniciar sesión para continuar');
        return;
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert('El carrito está vacío');
        return;
    }

    const user = await obtenerUsuario(token);
    if (!user || !user.document) {
        alert('No se pudo obtener información del usuario');
        return;
    }

    // Construir ítems vendidos
    const items = cart.map(item => ({
        batchId: item.batchId,
        quantity: item.quantity,
        unitPrice: item.unitPrice
    }));

    const totalPrice = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

    const billRequest = {
        customerDocument: user.document,
        date: new Date().toISOString(), // ✅ ISO 8601 con fecha y hora
        items,
        totalPrice,
        hasDiscount: false,
        discountRate: 0
    };

    try {
        const response = await fetch('/api/bills', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token
            },
            body: JSON.stringify(billRequest)
        });

        if (response.ok) {
            const bill = await response.json(); // Obtener datos devueltos por el backend
            const idbill = bill.id; // Asume que el backend retorna { id: 123, ... }

            // Actualizar el inventario
            for (const item of cart) {
                await fetch(`/api/batches/sell/${item.batchId}?quantity=${item.quantity}`, {
                    method: 'PUT',
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                });
            }

            alert('¡Factura generada y stock actualizado!');
            localStorage.removeItem('cart');
            window.location.href = `/recibo.html?id=${idbill}`;

    } else {
            const errorMsg = await response.text();
            alert('Error al crear la factura: ' + errorMsg);
        }
    } catch (error) {
        console.error('Error al procesar la compra:', error);
        alert('Ocurrió un error inesperado');
    }
}

async function obtenerUsuario(token) {
    try {
        const response = await fetch('/api/auth/profile', {
            headers: { Authorization: 'Bearer ' + token }
        });
        if (response.ok) {
            return await response.json();
        }
    } catch (err) {
        console.error('Error al obtener perfil del usuario:', err);
    }
    return null;
}

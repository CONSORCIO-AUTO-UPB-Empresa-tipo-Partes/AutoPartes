// Función para cargar el carrito desde localStorage
    function loadCartFromLocalStorage() {
        const cartData = JSON.parse(localStorage.getItem('cart'));
        const cartItemsContainer = document.getElementById('cart-items');
        const payButton = document.querySelector('.invoice-summary button');

        if (cartData && cartData.length > 0) {
            cartData.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-item');
                cartItem.setAttribute('data-price', item.price);

                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>Cantidad: <span class="quantity">${item.quantity}</span></p>
                        <p>Precio: $${parseInt(item.price).toLocaleString()}</p>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItem);
            });

            // Habilitar el botón de "Pagar"
            payButton.disabled = false;
        } else {
            cartItemsContainer.innerHTML = '<p>No hay productos en el carrito.</p>';
            // Deshabilitar el botón de "Pagar"
            payButton.disabled = true;
        }

        // Calcular el total
        updateTotal();
    }

    function updateTotal() {
    let subtotal = 0;
    const cartItems = document.querySelectorAll('.cart-item');

    cartItems.forEach(item => {
        const quantity = parseInt(item.querySelector('.quantity').textContent);
        const price = parseInt(item.getAttribute('data-price'));
        subtotal += quantity * price;
    });

    const tax = subtotal * 0.19; // Suponiendo un impuesto del 19%
    const discountAmount = 0; // Aquí puedes agregar la lógica para aplicar descuentos
    const total = subtotal + tax - discountAmount;

    document.getElementById('subtotalWithoutTax').textContent = `$${subtotal.toLocaleString()}`;
    document.getElementById('tax').textContent = `$${tax.toLocaleString()}`;
    document.getElementById('discountAmount').textContent = `$${discountAmount.toLocaleString()}`;
    document.getElementById('total-price').textContent = `$${total.toLocaleString()}`;
}

    function pay() {
    const selectedPaymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
    const modal = document.getElementById('successModal');
    modal.style.display = 'block';

    // Actualizar la factura como pagada
    const invoiceSummary = document.querySelector('.invoice-summary');
    const subtotal = document.getElementById('subtotalWithoutTax').textContent;
    const tax = document.getElementById('tax').textContent;
    const discountAmount = document.getElementById('discountAmount').textContent;
    const total = document.getElementById('total-price').textContent;

    invoiceSummary.innerHTML = `
        <h3>Resumen de la factura</h3>
        <p>Subtotal sin impuestos: <span id="subtotalWithoutTax">${subtotal}</span></p>
        <p>Impuestos: <span id="tax">${tax}</span></p>
        <p>Descuento: <span id="discountAmount">${discountAmount}</span></p>
        <p>Total: <span id="total-price">${total}</span></p>
        <p style="color: #4CAF50; font-weight: bold;">Factura pagada</p>
    `;

    // Limpiar el carrito después del pago
    localStorage.removeItem('cart');
}

    // Función para cerrar el modal
    function closeModal() {
        const modal = document.getElementById('successModal');
        modal.style.display = 'none';
    }

    // Cargar el carrito al iniciar la página
    window.addEventListener('load', function () {
        loadCartFromLocalStorage();
        updateTotal();
    });
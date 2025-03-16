// Model/carritoModel.js

export const cartModel = {
    // Cargar el carrito desde localStorage
    loadCart() {
        return JSON.parse(localStorage.getItem('cart')) || [];
    },

    // Guardar el carrito en localStorage
    saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    },

    // Actualizar la cantidad de un producto en el carrito
    updateQuantity(cart, index, change) {
        const item = cart[index];
        if (change > 0 && item.available > 0) {
            item.quantity++;
            item.available--;
        } else if (change < 0 && item.quantity > 1) {
            item.quantity--;
            item.available++;
        }
        return cart;
    },

    // Eliminar un producto del carrito
    removeItem(cart, index) {
        cart.splice(index, 1);
        return cart;
    },

    // Calcular el total del carrito
    calculateTotal(cart) {
        return cart.reduce((total, item) => total + item.quantity * item.price, 0);
    },
};
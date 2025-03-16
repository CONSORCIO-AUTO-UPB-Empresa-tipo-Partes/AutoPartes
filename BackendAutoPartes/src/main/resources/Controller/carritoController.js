// Controller/carritoController.js

import { cartModel } from 'src/java/Model/carritoModel.js';
import { cartView } from 'src/java/View/carritoView.js';

export const cartController = {
    init() {
        const cart = cartModel.loadCart();
        cartView.renderCart(cart);
        cartView.aplicarModoGuardado();
    },
    updateQuantity(index, change) {
        let cart = cartModel.loadCart();
        cart = cartModel.updateQuantity(cart, index, change);
        cartModel.saveCart(cart);
        cartView.renderCart(cart);
    },
    removeFromCart(index) {
        let cart = cartModel.loadCart();
        cart = cartModel.removeItem(cart, index);
        cartModel.saveCart(cart);
        cartView.renderCart(cart);
    },
    continueToCheckout() {
        const cart = cartModel.loadCart();
        cartModel.saveCart(cart);
        window.location.href = 'Factura.html';
    },
    searchCategory(event) {
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
            cartView.showProducts(categories[searchTerm]);
        } else {
            alert('Categoría no encontrada');
        }
    },
    addToCart(productName) {
        const isLoggedIn = false; // Cambiar a true si el usuario está logueado
        if (!isLoggedIn) {
            cartView.showLoginModal();
        } else {
            alert(`${productName} añadido al carrito`);
        }
    },
    closeModal() {
        cartView.hideLoginModal();
    },
    toggleMode() {
        cartView.toggleMode();
    },
};

// Inicialización
window.addEventListener('load', () => {
    cartController.init();
});

// Hacer el controlador accesible globalmente
window.cartController = cartController;
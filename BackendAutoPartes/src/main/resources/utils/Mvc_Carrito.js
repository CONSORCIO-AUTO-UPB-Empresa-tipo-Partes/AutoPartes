// utils/carrito.js

import { obtenerCarrito, agregarProducto, eliminarProducto } from '../Model/carritoModel.js';
import { renderizarCarrito } from '../Controller/carritoController.js';

// Cargar carrito al inicio
document.addEventListener('DOMContentLoaded', () => {
  const carrito = obtenerCarrito();
  renderizarCarrito(carrito);
});

// Agregar producto al carrito
document.querySelector('#btnAgregar').addEventListener('click', (e) => {
  const idProducto = e.target.dataset.id;
  agregarProducto(idProducto);
  renderizarCarrito(obtenerCarrito());
});

// Eliminar producto del carrito
document.querySelector('#carrito').addEventListener('click', (e) => {
  if (e.target.classList.contains('btnEliminar')) {
    const idProducto = e.target.dataset.id;
    eliminarProducto(idProducto);
    renderizarCarrito(obtenerCarrito());
  }
});

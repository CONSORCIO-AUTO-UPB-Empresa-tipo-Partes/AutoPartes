package com.autopartes.BackendAutoPartes.service;

import com.autopartes.BackendAutoPartes.model.Batch;
import com.autopartes.BackendAutoPartes.model.CartItem;
import com.autopartes.BackendAutoPartes.repository.BatchRepository;
import com.autopartes.BackendAutoPartes.repository.CartRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {

    private final CartRepository cartRepository; // Dependencia para interactuar con la base de datos del carrito
    private final BatchRepository batchRepository; // Dependencia para interactuar con la base de datos de lotes

    // Constructor para inyectar las dependencias del repositorio
    public CartService(CartRepository cartRepository, BatchRepository batchRepository) {
        this.cartRepository = cartRepository;
        this.batchRepository = batchRepository;
    }

    /**
     * Método para agregar un ítem al carrito.
     * @param batchId Identificador del lote del producto.
     * @param quantity Cantidad del producto a agregar.
     * @return El objeto CartItem guardado en la base de datos.
     */
    public CartItem addToCart(Long batchId, int quantity) {
        // Busca el lote en la base de datos por su ID
        Batch batch = batchRepository.findById(batchId)
                .orElseThrow(() -> new RuntimeException("Lote no encontrado")); // Lanza una excepción si no encuentra el lote

        // Verifica si hay suficiente stock en el lote antes de agregar al carrito
        if (batch.getQuantity() < quantity) {
            throw new RuntimeException("Stock insuficiente en este lote"); // Si no hay suficiente stock, lanza una excepción
        }

        // Crea un nuevo objeto CartItem para agregar al carrito
        CartItem cartItem = new CartItem();
        cartItem.setBatch(batch); // Asigna el lote al item del carrito
        cartItem.setQuantity(quantity); // Establece la cantidad solicitada

        return cartRepository.save(cartItem); // Guarda el item
    }

    /**
     * Método para obtener todos los ítems del carrito.
     * @return Lista de ítems en el carrito.
     */
    public List<CartItem> getCartItems() {
        return cartRepository.findAll(); // Retorna todos los ítems guardados en la base de datos del carrito
    }

    /**
     * Método para realizar el checkout del carrito.
     * Se validan los stocks, se descuentan y se vacía el carrito.
     */
    public void checkoutCart() {
        // Obtiene todos los ítems del carrito
        List<CartItem> cartItems = cartRepository.findAll();

        // Recorre cada ítem en el carrito para procesar la compra
        for (CartItem item : cartItems) {
            // Busca el lote asociado al ítem en la base de datos
            Batch batch = batchRepository.findById(item.getBatch().getId())
                    .orElseThrow(() -> new RuntimeException("Lote no encontrado")); // Lanza una excepción si el lote no existe

            // Verifica si hay suficiente stock para completar la compra
            if (batch.getQuantity() < item.getQuantity()) {
                throw new RuntimeException("Stock insuficiente para completar la compra"); // Si no hay stock suficiente, lanza una excepción
            }

            // Resta la cantidad comprada del stock disponible en el lote
            batch.setQuantity(batch.getQuantity() - item.getQuantity());
            batchRepository.save(batch); // Guarda los cambios en la base de datos
        }

        cartRepository.deleteAll(); // Vacía el carrito eliminando todos los ítems
    }
}
package com.autopartes.BackendAutoPartes.service;

import com.autopartes.BackendAutoPartes.model.Batch;
import com.autopartes.BackendAutoPartes.model.CartItem;
import com.autopartes.BackendAutoPartes.repository.BatchRepository;
import com.autopartes.BackendAutoPartes.repository.CartRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CartServiceTest {

    @Mock
    private CartRepository cartRepository;

    @Mock
    private BatchRepository batchRepository;

    @InjectMocks
    private CartService cartService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAddToCart_Success() {
        // Simular un lote con suficiente stock
        Batch batch = new Batch();
        batch.setId(1L);
        batch.setQuantity(10);

        when(batchRepository.findById(1L)).thenReturn(Optional.of(batch));
        when(cartRepository.save(any(CartItem.class))).thenAnswer(invocation -> invocation.getArgument(0)); // Simular respuesta

        // Ejecutar método de prueba
        CartItem cartItem = cartService.addToCart(1L, 5);

        // Validaciones
        assertNotNull(cartItem, "El objeto cartItem no debería ser nulo");
        assertEquals(5, cartItem.getQuantity());
        verify(cartRepository, times(1)).save(cartItem);
    }

    @Test
    void testAddToCart_InsufficientStock() {
        // Simular un lote con stock insuficiente
        Batch batch = new Batch();
        batch.setId(1L);
        batch.setQuantity(2);

        when(batchRepository.findById(1L)).thenReturn(Optional.of(batch));

        // Verificar que lanza una excepción si el stock es insuficiente
        Exception exception = assertThrows(RuntimeException.class, () -> {
            cartService.addToCart(1L, 5);
        });

        assertEquals("Stock insuficiente en este lote", exception.getMessage());
    }

    @Test
    void testCheckoutCart_Success() {
        // Simular lote en stock
        Batch batch = new Batch();
        batch.setId(1L);
        batch.setQuantity(10);

        CartItem cartItem = new CartItem();
        cartItem.setBatch(batch);
        cartItem.setQuantity(5);

        when(cartRepository.findAll()).thenReturn(java.util.List.of(cartItem));
        when(batchRepository.findById(1L)).thenReturn(Optional.of(batch));
        when(batchRepository.save(any(Batch.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Ejecutar checkout
        cartService.checkoutCart();

        // Validar que el stock se ha reducido correctamente
        assertEquals(5, batch.getQuantity());
        verify(cartRepository, times(1)).deleteAll();
    }
}

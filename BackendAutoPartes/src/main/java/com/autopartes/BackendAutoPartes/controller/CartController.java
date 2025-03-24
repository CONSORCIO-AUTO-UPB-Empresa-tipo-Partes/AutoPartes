package com.autopartes.BackendAutoPartes.controller;

import com.autopartes.BackendAutoPartes.model.CartItem;
import com.autopartes.BackendAutoPartes.service.CartService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@AllArgsConstructor
public class CartController {
    private final CartService cartService;

    /**
     * Añade un producto al carrito.
     */
    @PostMapping("/add")
    public ResponseEntity<CartItem> addToCart(@RequestParam Long batchId, @RequestParam int quantity) {
        return ResponseEntity.ok(cartService.addToCart(batchId, quantity));
    }

    /**
     * Obtiene todos los productos en el carrito.
     */
    @GetMapping
    public ResponseEntity<List<CartItem>> getCartItems() {
        return ResponseEntity.ok(cartService.getCartItems());
    }

    /**
     * Finaliza la compra y descuenta stock.
     */
    @PostMapping("/checkout")
    public ResponseEntity<String> checkout() {
        cartService.checkoutCart();
        return ResponseEntity.ok("Compra realizada con éxito");
    }
}
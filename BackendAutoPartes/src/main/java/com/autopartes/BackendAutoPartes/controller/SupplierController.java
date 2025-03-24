package com.autopartes.BackendAutoPartes.controller;

import com.autopartes.BackendAutoPartes.model.Supplier;
import com.autopartes.BackendAutoPartes.service.SupplierService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller for handling supplier-related API requests.
 */
@RestController
@RequestMapping("/api/suppliers")
@AllArgsConstructor
public class SupplierController {
    private final SupplierService supplierService;
    /**
     * Registers a new supplier.
     *
     * @param supplier Supplier details.
     * @return The created supplier.
     */
    @PostMapping
    public ResponseEntity<Supplier> registerSupplier(@RequestBody Supplier supplier) {
        return ResponseEntity.ok(supplierService.registerSupplier(supplier));
    }
}

package com.autopartes.BackendAutoPartes.controller;

import com.autopartes.BackendAutoPartes.model.Supplier;
import com.autopartes.BackendAutoPartes.service.SupplierService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for handling supplier-related API requests.
 */
@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {
    private final SupplierService supplierService;

    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

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

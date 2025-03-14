package com.autopartes.BackendAutoPartes.service;

import com.autopartes.BackendAutoPartes.model.Supplier;
import com.autopartes.BackendAutoPartes.repository.SupplierRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Service for handling business logic related to Suppliers.
 */
@Service // Marks this class as a service component.
public class SupplierService {

    private final SupplierRepository supplierRepository; // Repository to access supplier data.

    // Constructor to inject the SupplierRepository.
    public SupplierService(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    /**
     * Registers a new supplier if it does not already exist.
     *
     * @param supplier The supplier to be registered.
     * @return The saved supplier.
     * @throws RuntimeException If the supplier already exists.
     */
    public Supplier registerSupplier(Supplier supplier) {
        // Check if a supplier with the same name already exists.
        Optional<Supplier> existingSupplier = supplierRepository.findByName(supplier.getName());
        if (existingSupplier.isPresent()) {
            throw new RuntimeException("The supplier is already registered");
        }
        return supplierRepository.save(supplier); // Save the new supplier.
    }

    /**
     * Checks if a supplier exists by ID.
     *
     * @param id The supplier ID.
     * @return True if the supplier exists, otherwise false.
     */
    public boolean supplierExists(Long id) {
        return supplierRepository.existsById(id);
    }
}
package com.autopartes.BackendAutoPartes.repository;

import com.autopartes.BackendAutoPartes.model.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for managing Supplier entities.
 */
@Repository // Marks this class as a Spring Data repository.
public interface SupplierRepository extends JpaRepository<Supplier, Long> {

    /**
     * Finds a supplier by name.
     *
     * @param name The supplier's name.
     * @return Optional containing the found supplier or empty if not found.
     */
    Optional<Supplier> findByName(String name);
}
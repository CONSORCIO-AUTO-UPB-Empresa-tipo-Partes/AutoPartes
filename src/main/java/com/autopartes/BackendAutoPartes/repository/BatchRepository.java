package com.autopartes.BackendAutoPartes.repository;

import com.autopartes.BackendAutoPartes.model.dto.Batch;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Repository for managing Batch entities.
 */
public interface BatchRepository extends JpaRepository<Batch, Integer> {


    /**
     * Finds a batch by quantity.
     *
     * @param quantity The batch's quantity.
     * @return List containing the found batch or empty if not found.
     */
    List<Batch> findByQuantityLessThan(int quantity);
}

package com.autopartes.BackendAutoPartes.repository;

import com.autopartes.BackendAutoPartes.model.Batch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for managing Lot entities.
 */
@Repository
public interface BatchRepository extends JpaRepository<Batch, Long> {
    /**
     * Finds lots with quantity less than the given value.
     *
     * @param quantity The quantity to compare.
     * @return List of lots with quantity less than the given value.
     */
    public List<Batch> findByQuantityLessThan(int quantity);

}

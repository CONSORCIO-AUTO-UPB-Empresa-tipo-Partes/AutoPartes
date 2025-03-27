package com.autopartes.BackendAutoPartes.repository;

import com.autopartes.BackendAutoPartes.model.dto.Billhasbatch;
import com.autopartes.BackendAutoPartes.model.dto.BillhasbatchId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Interface that extends JpaRepository for CRUD operations on the Billhasbatch entity.
 */
public interface BillhasbatchRepository extends JpaRepository<Billhasbatch, BillhasbatchId> {

    /**
     * Finds all billhasbatch entities by bill id.
     *
     * @param billId The bill's id.
     * @return List containing all billhasbatch entities with the given bill id.
     */
    List<Billhasbatch> findByBillIdbillId(Integer billId);

}

package com.autopartes.BackendAutoPartes.repository;

import com.autopartes.BackendAutoPartes.model.dto.Billhasbatch;
import com.autopartes.BackendAutoPartes.model.dto.BillhasbatchId;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Interface that extends JpaRepository for CRUD operations on the Billhasbatch entity.
 */
public interface BillhasbatchRepository extends JpaRepository<Billhasbatch, BillhasbatchId> {

}

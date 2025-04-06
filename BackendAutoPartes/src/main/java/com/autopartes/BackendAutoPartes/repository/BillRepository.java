package com.autopartes.BackendAutoPartes.repository;

import com.autopartes.BackendAutoPartes.model.dto.Bill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Interface that extends JpaRepository for CRUD operations on the Bill entity.
 */
public interface BillRepository extends JpaRepository<Bill, Integer> {

    /**
     * Finds all bills associated with a specific person ID document.
     *
     * @param iddocument The ID document of the person.
     * @return List of bills associated with the specified person ID document.
     */
    List<Bill> findByPersonIddocument_Iddocument(String iddocument);
}

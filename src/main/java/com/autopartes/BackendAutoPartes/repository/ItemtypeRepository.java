package com.autopartes.BackendAutoPartes.repository;

import com.autopartes.BackendAutoPartes.model.dto.Itemtype;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Interface that extends JpaRepository for CRUD operations on the Itemtype entity.
 */
public interface ItemtypeRepository extends JpaRepository<Itemtype, Integer> {

}

package com.autopartes.BackendAutoPartes.repository;

import com.autopartes.BackendAutoPartes.model.dto.Person;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Interface that extends JpaRepository for CRUD operations on the Person entity.
 */
public interface PersonRepository extends JpaRepository<Person, String> {

}

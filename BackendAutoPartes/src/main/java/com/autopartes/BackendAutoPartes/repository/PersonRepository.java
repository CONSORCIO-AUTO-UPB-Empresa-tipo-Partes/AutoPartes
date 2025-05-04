package com.autopartes.BackendAutoPartes.repository;

import com.autopartes.BackendAutoPartes.model.dto.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Interface that extends JpaRepository for CRUD operations on the Person entity.
 */
@Repository
public interface PersonRepository extends JpaRepository<Person, String> {
    List<Person> findByPersontype(String persontype);
    List<Person> findByPersontypeIn(List<String> persontypes);
}

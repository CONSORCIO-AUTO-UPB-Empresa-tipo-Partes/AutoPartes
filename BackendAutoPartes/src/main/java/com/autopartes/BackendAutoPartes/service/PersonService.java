package com.autopartes.BackendAutoPartes.service;

import com.autopartes.BackendAutoPartes.model.dto.Person;
import com.autopartes.BackendAutoPartes.repository.PersonRepository;
import com.autopartes.BackendAutoPartes.utils.ReusableServices;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service for managing Person entities.
 */
@Service
public class PersonService {

    /**
     * The repository for managing Person entities.
     */
    private final PersonRepository personRepository;

    /**
     * Constructor.
     *
     * @param personRepository The repository for managing Person entities.
     */
    public PersonService(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    /**
     * Finds all persons.
     *
     * @return List containing all persons.
     */
    public List<Person> findAll() {
        return personRepository.findAll();
    }

    /**
     * Finds a person by id.
     *
     * @param id The person's id.
     * @return Optional containing the found person or empty if not found.
     */
    public Optional<Person> findById(String id) {
        return personRepository.findById(id);
    }

    /**
     * Saves a person.
     *
     * @param person The person to save.
     * @return The saved person.
     */
    public Person save(Person person) {
        return personRepository.save(person);
    }

    /**
     * Deletes a person by id.
     *
     * @param id The person's id.
     */
    public void deleteById(String id) {
        personRepository.deleteById(id);
    }

    /**
     * Finds a person by name.
     *
     * @param name The person's name.
     * @return Optional containing the found person or empty if not found.
     */
    public Optional<Person> findByName(String name) {
            return ReusableServices.findByName("person_name", findAll(), Person::getPersonname);
    }

}

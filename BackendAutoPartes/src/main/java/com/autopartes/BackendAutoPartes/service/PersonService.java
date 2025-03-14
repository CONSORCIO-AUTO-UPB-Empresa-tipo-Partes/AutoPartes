package com.autopartes.BackendAutoPartes.service;

import com.autopartes.BackendAutoPartes.model.Person;
import com.autopartes.BackendAutoPartes.repository.PersonRepository;
import org.springframework.stereotype.Service;

@Service
public class PersonService {
    private final PersonRepository personRepository;

    public PersonService(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    public Person savePerson(Person person) {
        return personRepository.save(person);
    }
}

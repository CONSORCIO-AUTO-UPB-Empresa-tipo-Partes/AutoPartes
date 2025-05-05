package com.autopartes.BackendAutoPartes.controller;

import com.autopartes.BackendAutoPartes.model.dto.Person;
import com.autopartes.BackendAutoPartes.model.dto.User;
import com.autopartes.BackendAutoPartes.model.dto.Usertype;
import com.autopartes.BackendAutoPartes.model.dto.request.PersonRequest;
import com.autopartes.BackendAutoPartes.model.dto.response.PersonResponse;
import com.autopartes.BackendAutoPartes.repository.PersonRepository;
import com.autopartes.BackendAutoPartes.repository.UserRepository;
import com.autopartes.BackendAutoPartes.repository.UsertypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/persons")
public class PersonController {

    private static final Logger log = LoggerFactory.getLogger(PersonController.class); // Add logger

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UsertypeRepository userTypeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping
    public ResponseEntity<?> createPerson(@RequestBody PersonRequest request) {
        try {
            // Validar si ya existe una persona con ese documento
            if (personRepository.findById(request.getIddocument()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("error", "Ya existe una persona con ese documento"));
            }

            // Validar si ya existe un usuario con ese email
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("error", "Ya existe un usuario con ese correo electrónico"));
            }

            // Crear y guardar la persona
            Person person = new Person();
            person.setIddocument(request.getIddocument());
            person.setPersonname(request.getName() + " " + request.getLastname());
            person.setPhonenumber(request.getPhone());
            person.setTypedocument(request.getTypedocument());
            person.setPersonaddress(request.getAddress());
            person.setPersontype(request.getPersontype());

            personRepository.save(person);

            // Crear usuario si se proporcionó email y password
            if (request.getEmail() != null && request.getPassword() != null) {
                Usertype userType = userTypeRepository.findByUsertypename(request.getUsertype())
                        .orElseThrow(() -> new RuntimeException("Tipo de usuario no encontrado"));

                User user = new User();
                user.setEmail(request.getEmail());
                user.setPassword(passwordEncoder.encode(request.getPassword()));
                user.setPersonIddocument(person);
                user.setUsertypeIdtypeuser(userType);

                userRepository.save(user);
            }

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("message", "Persona creada exitosamente",
                            "id", person.getIddocument()));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<Person>> getAllPersons() {
        List<Person> persons = personRepository.findAll();
        return ResponseEntity.ok(persons);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPersonById(@PathVariable String id) {
        Optional<Person> person = personRepository.findById(id);

        if (person.isPresent()) {
            Person p = person.get();
            Optional<User> user = userRepository.findByPersonIddocument(p);

            PersonResponse response = new PersonResponse();
            response.setIddocument(p.getIddocument());
            response.setPersonname(p.getPersonname());
            response.setPhonenumber(p.getPhonenumber());
            response.setTypedocument(p.getTypedocument());
            response.setPersonaddress(p.getPersonaddress());
            response.setPersontype(p.getPersontype());

            if (user.isPresent()) {
                response.setEmail(user.get().getEmail());
                response.setUsertype(user.get().getUsertypeIdtypeuser().getUsertypename());
            }

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Persona no encontrada"));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePerson(@PathVariable String id, @RequestBody PersonRequest request) {
        try {
            Optional<Person> existingPerson = personRepository.findById(id);

            if (existingPerson.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Persona no encontrada"));
            }

            Person person = existingPerson.get();
            person.setPersonname(request.getName() + " " + request.getLastname());
            person.setPhonenumber(request.getPhone());
            person.setTypedocument(request.getTypedocument());
            person.setPersonaddress(request.getAddress());
            person.setPersontype(request.getPersontype());

            personRepository.save(person);

            // Actualizar usuario si existe
            Optional<User> existingUser = userRepository.findByPersonIddocument(person);

            if (existingUser.isPresent() && request.getEmail() != null) {
                User user = existingUser.get();

                // Verificar si otro usuario usa el mismo email
                Optional<User> userWithSameEmail = userRepository.findByEmail(request.getEmail());
                if (userWithSameEmail.isPresent() && !userWithSameEmail.get().getPersonIddocument().getIddocument().equals(id)) {
                    return ResponseEntity.status(HttpStatus.CONFLICT)
                            .body(Map.of("error", "El correo electrónico ya está en uso por otro usuario"));
                }

                user.setEmail(request.getEmail());

                if (request.getPassword() != null && !request.getPassword().isEmpty()) {
                    user.setPassword(passwordEncoder.encode(request.getPassword()));
                }

                if (request.getUsertype() != null) {
                    Usertype userType = userTypeRepository.findByUsertypename(request.getUsertype())
                            .orElseThrow(() -> new RuntimeException("Tipo de usuario no encontrado"));
                    user.setUsertypeIdtypeuser(userType);
                }

                userRepository.save(user);
            }

            return ResponseEntity.ok(Map.of("message", "Persona actualizada exitosamente"));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePerson(@PathVariable String id) {
        try {
            Optional<Person> person = personRepository.findById(id);

            if (person.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Persona no encontrada"));
            }

            // Buscar y eliminar el usuario asociado primero
            Optional<User> user = userRepository.findByPersonIddocument(person.get());
            if (user.isPresent()) {
                userRepository.delete(user.get());
            }

            personRepository.deleteById(id);

            return ResponseEntity.ok(Map.of("message", "Persona eliminada exitosamente"));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/employees")
    public ResponseEntity<List<PersonResponse>> getAllEmployees() {
        List<Person> employees = personRepository.findAll().stream()
                .filter(p -> p.getPersontype() != null && !p.getPersontype().equalsIgnoreCase("CLIENT"))
                .collect(Collectors.toList());

        List<PersonResponse> employeeResponses = employees.stream().map(person -> {
            PersonResponse response = new PersonResponse();
            response.setIddocument(person.getIddocument());
            response.setPersonname(person.getPersonname());
            response.setPhonenumber(person.getPhonenumber());
            response.setTypedocument(person.getTypedocument());
            response.setPersonaddress(person.getPersonaddress());
            response.setPersontype(person.getPersontype());

            Optional<User> userOpt = userRepository.findByPersonIddocument(person);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                response.setEmail(user.getEmail());
                if (user.getUsertypeIdtypeuser() != null) {
                    response.setUsertype(user.getUsertypeIdtypeuser().getUsertypename());
                } else {
                    response.setUsertype(null);
                }
            } else {
                response.setEmail(null);
                response.setUsertype(null);
            }
            return response;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(employeeResponses);
    }

    /**
     * Get all clients.
     * Filters persons to return only those with persontype 'CLIENTE'.
     *
     * @return The response entity with the list of clients.
     */
    @GetMapping("/clients")
    public ResponseEntity<List<PersonResponse>> getAllClients() {
        log.info("Attempting to fetch all persons from repository...");
        List<Person> allPersons = personRepository.findAll();
        log.info("Found {} total persons in the database.", allPersons.size());

        // Log persontype for the first few persons for debugging
        allPersons.stream().limit(10).forEach(p -> 
            log.debug("Person ID: {}, Raw PersonType: '{}'", p.getIddocument(), p.getPersontype())
        );

        List<Person> clients = allPersons.stream()
                .filter(p -> {
                    String personType = p.getPersontype();
                    boolean isClient = personType != null && personType.trim().equalsIgnoreCase("CLIENTE"); // Trim and compare with CLIENTE
                    if (!isClient) {
                        log.trace("Filtering out person ID: {} with trimmed type: '{}'", p.getIddocument(), (personType != null ? personType.trim() : "null"));
                    }
                    return isClient;
                })
                .collect(Collectors.toList());
        
        log.info("Filtered down to {} persons matching persontype 'CLIENTE'.", clients.size());

        List<PersonResponse> clientResponses = clients.stream().map(person -> {
            PersonResponse response = new PersonResponse();
            response.setIddocument(person.getIddocument());
            response.setPersonname(person.getPersonname());
            response.setPhonenumber(person.getPhonenumber());
            response.setTypedocument(person.getTypedocument());
            response.setPersonaddress(person.getPersonaddress());
            response.setPersontype(person.getPersontype()); // Keep original type in response

            Optional<User> userOpt = userRepository.findByPersonIddocument(person);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                response.setEmail(user.getEmail());
                if (user.getUsertypeIdtypeuser() != null) {
                    response.setUsertype(user.getUsertypeIdtypeuser().getUsertypename());
                } else {
                    response.setUsertype(null);
                }
            } else {
                response.setEmail(null);
                response.setUsertype(null);
            }
            return response;
        }).collect(Collectors.toList());

        log.info("Returning {} client responses.", clientResponses.size());
        return ResponseEntity.ok(clientResponses);
    }
}
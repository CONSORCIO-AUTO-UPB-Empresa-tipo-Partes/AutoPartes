package com.autopartes.BackendAutoPartes.service;

import com.autopartes.BackendAutoPartes.model.dto.Person;
import com.autopartes.BackendAutoPartes.model.dto.User;
import com.autopartes.BackendAutoPartes.model.dto.request.EmployeeRequest;
import com.autopartes.BackendAutoPartes.model.dto.response.EmployeeResponse;
import com.autopartes.BackendAutoPartes.repository.PersonRepository;
import com.autopartes.BackendAutoPartes.repository.UserRepository;
import com.autopartes.BackendAutoPartes.repository.UsertypeRepository;
import com.autopartes.BackendAutoPartes.model.dto.Usertype;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    private final PersonRepository personRepository;
    private final UserRepository userRepository;
    private final UsertypeRepository userTypeRepository;
    private final PasswordEncoder passwordEncoder;

    public EmployeeService(PersonRepository personRepository, 
                             UserRepository userRepository,
                             UsertypeRepository userTypeRepository,
                             PasswordEncoder passwordEncoder) {
        this.personRepository = personRepository;
        this.userRepository = userRepository;
        this.userTypeRepository = userTypeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public Optional<EmployeeResponse> createEmployee(EmployeeRequest request) {
        // Check if user already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent() ||
            personRepository.findById(request.getDocumentNumber()).isPresent()) {
            return Optional.empty();
        }

        // Create and save person
        Person person = new Person();
        person.setIddocument(request.getDocumentNumber());
        person.setPersonname(request.getName() + " " + request.getLastname());
        person.setPhonenumber(request.getPhone());
        person.setTypedocument(request.getDocumentType());
        person.setPersonaddress(request.getAddress());
        person.setPersontype("EMPLOYEE"); // Set person type as EMPLOYEE
        
        Person savedPerson = personRepository.save(person);

        // Get user type
        Usertype userType = userTypeRepository.findByUsertypename(request.getPosition())
                .orElseThrow(() -> new RuntimeException("Tipo de usuario no encontrado: " + request.getPosition()));

        // Create and save user
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPersonIddocument(savedPerson);
        user.setUsertypeIdtypeuser(userType);
        
        User savedUser = userRepository.save(user);

        // Create response
        return Optional.of(mapToEmployeeResponse(savedPerson, savedUser));
    }

    public List<EmployeeResponse> getAllEmployees() {
        List<Person> employees = personRepository.findByPersontypeIn(List.of("EMPLOYEE", "ADMIN"));
        
        return employees.stream()
                .map(person -> {
                    User user = userRepository.findByPersonIddocument(person)
                            .orElseThrow(() -> new RuntimeException("Usuario no encontrado para persona: " + person.getIddocument()));
                    return mapToEmployeeResponse(person, user);
                })
                .collect(Collectors.toList());
    }

    public Optional<EmployeeResponse> getEmployeeById(String id) {
        return personRepository.findById(id)
                .filter(person -> person.getPersontype().equals("EMPLOYEE") || person.getPersontype().equals("ADMIN"))
                .flatMap(person -> userRepository.findByPersonIddocument(person)
                        .map(user -> mapToEmployeeResponse(person, user)));
    }

    @Transactional
    public Optional<EmployeeResponse> updateEmployee(String id, EmployeeRequest request) {
        return personRepository.findById(id)
                .filter(person -> person.getPersontype().equals("EMPLOYEE") || person.getPersontype().equals("ADMIN"))
                .flatMap(person -> {
                    User user = userRepository.findByPersonIddocument(person)
                            .orElseThrow(() -> new RuntimeException("Usuario no encontrado para persona: " + id));
                    
                    // Update person details
                    person.setPersonname(request.getName() + " " + request.getLastname());
                    person.setPhonenumber(request.getPhone());
                    person.setTypedocument(request.getDocumentType());
                    person.setPersonaddress(request.getAddress());
                    
                    // Update user details
                    if (request.getPassword() != null && !request.getPassword().isEmpty()) {
                        user.setPassword(passwordEncoder.encode(request.getPassword()));
                    }
                    
                    // Update user type if necessary
                    if (!user.getUsertypeIdtypeuser().getUsertypename().equals(request.getPosition())) {
                        Usertype userType = userTypeRepository.findByUsertypename(request.getPosition())
                                .orElseThrow(() -> new RuntimeException("Tipo de usuario no encontrado: " + request.getPosition()));
                        user.setUsertypeIdtypeuser(userType);
                    }
                    
                    Person updatedPerson = personRepository.save(person);
                    User updatedUser = userRepository.save(user);
                    
                    return Optional.of(mapToEmployeeResponse(updatedPerson, updatedUser));
                });
    }

    @Transactional
    public boolean deleteEmployee(String id) {
        return personRepository.findById(id)
                .filter(person -> person.getPersontype().equals("EMPLOYEE") || person.getPersontype().equals("ADMIN"))
                .map(person -> {
                    User user = userRepository.findByPersonIddocument(person)
                            .orElseThrow(() -> new RuntimeException("Usuario no encontrado para persona: " + id));
                    
                    userRepository.delete(user);
                    personRepository.delete(person);
                    return true;
                })
                .orElse(false);
    }
    
    private EmployeeResponse mapToEmployeeResponse(Person person, User user) {
        String fullName = person.getPersonname();
        String firstName = fullName.contains(" ") ? fullName.split(" ")[0] : fullName;
        String lastName = fullName.contains(" ") ? fullName.substring(fullName.indexOf(" ") + 1) : "";
        
        return EmployeeResponse.builder()
                .documentNumber(person.getIddocument())
                .name(firstName)
                .lastname(lastName)
                .email(user.getEmail())
                .phone(person.getPhonenumber())
                .address(person.getPersonaddress())
                .documentType(person.getTypedocument())
                .position(user.getUsertypeIdtypeuser().getUsertypename())
                .build();
    }
}
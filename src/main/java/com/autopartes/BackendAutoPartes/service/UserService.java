package com.autopartes.BackendAutoPartes.service;

import com.autopartes.BackendAutoPartes.model.dto.*;
import com.autopartes.BackendAutoPartes.model.dto.request.RegisterRequest;
import com.autopartes.BackendAutoPartes.repository.PersonRepository;
import com.autopartes.BackendAutoPartes.repository.UserRepository;
import com.autopartes.BackendAutoPartes.security.JwtUtils;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;


/**
 * Service for managing User entities.
 */
@Service
public class UserService {

    /**
     * The repository for managing User entities.
     */
    private final UserRepository userRepository;

    /**
     * The password encoder.
     */
    private final BCryptPasswordEncoder passwordEncoder;

    private final PersonRepository personRepository;

    private final JwtUtils jwtUtils;

    /**
     * Constructs a new UserService with the specified dependencies.
     *
     * @param userRepository The repository for managing User entities.
     * @param passwordEncoder The password encoder for hashing passwords.
     * @param personRepository The repository for managing Person entities.
     * @param jwtUtils The utility class for handling JWT operations.
     */
    public UserService(UserRepository userRepository,
                       BCryptPasswordEncoder passwordEncoder,
                       PersonRepository personRepository, JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.jwtUtils = jwtUtils;
        this.passwordEncoder = passwordEncoder;
        this.personRepository = personRepository;
    }

    /**
     * Finds all users.
     *
     * @return List containing all users.
     */
    public Optional<User> findByEmail(String email) {
        return userRepository.findById(email);
    }

    /**
     * Saves a user.
     *
     * @param user The user to save.
     * @return The saved user.
     */
    public User save(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    /**
     * Deletes a user by email.
     *
     * @param email The user's email.
     */
    public void deleteByEmail(String email) {
        userRepository.deleteById(email);
    }

    /**
     * Logs in a user by validating their credentials and generating a JWT token.
     *
     * @param email The user's email.
     * @param password The user's password.
     * @return Optional containing the generated JWT token or empty if credentials invalid.
     */
    public Optional<String> login(String email, String password) {
        return userRepository.findById(email)
                .filter(user -> passwordEncoder.matches(password, user.getPassword()))
                .map(user -> {
                    String role = "ROLE_" + user.getUsertypeIdtypeuser().getUsertypename().toUpperCase();
                    return jwtUtils.generateToken(user.getEmail(), role);
                });
    }


    /**
     * Retrieves a user by their email.
     *
     * @param email The user's email.
     * @return Optional containing the user or empty if not found.
     */
    private Optional<User> getUserByEmail(String email) {
        return userRepository.findById(email);
    }

    /**
     * Changes the user type for a given user.
     *
     * @param email The user's email.
     * @param newUserTypeId The ID of the new user type.
     * @return Optional containing the updated user or empty if user not found.
     */
    public Optional<User> changeUserType(String email, Integer newUserTypeId) {
        return getUserByEmail(email).map(user -> {
            Usertype newUserType = new Usertype();
            newUserType.setId(newUserTypeId);
            user.setUsertypeIdtypeuser(newUserType);
            return userRepository.save(user);
        });
    }

    /**
     * Changes the permissions of a user by updating their user type.
     *
     * @param email The user's email.
     * @param newUserTypeId The ID of the new user type that defines the permissions.
     * @return Optional containing the updated user or empty if user not found.
     * @throws IllegalArgumentException if newUserTypeId is null.
     */
    public Optional<User> changeUserPermissions(String email, Integer newUserTypeId) {
        if (newUserTypeId == null) {
            throw new IllegalArgumentException("User type ID cannot be null");
        }

        return getUserByEmail(email).map(user -> {
            Usertype newPermissions = new Usertype();
            newPermissions.setId(newUserTypeId);
            user.setUsertypeIdtypeuser(newPermissions);
            return userRepository.save(user);
        });
    }

    /**
     * Updates user password.
     *
     * @param email The user's email.
     * @param oldPassword The current password.
     * @param newPassword The new password.
     * @return Optional containing the updated user or empty if credentials invalid.
     */
    public Optional<User> updatePassword(String email, String oldPassword, String newPassword) {
        return userRepository.findById(email)
                .filter(user -> passwordEncoder.matches(oldPassword, user.getPassword()))
                .map(user -> {
                    user.setPassword(passwordEncoder.encode(newPassword));
                    return userRepository.save(user);
                });
    }

    /**
     * Registers a new user.
     *
     * @param user The user to register.
     * @return Optional containing the registered user or empty if user already exists.
     */
    public Optional<User> register(User user) {
        if (userRepository.existsById(user.getEmail())) {
            return Optional.empty(); // Ya existe
        }

        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);

        return Optional.of(userRepository.save(user));
    }

    public Optional<User> register(RegisterRequest request) {
        if (userRepository.existsById(request.getEmail())) {
            return Optional.empty();
        }

        Person person = new Person();
        person.setIddocument(request.getIddocument());
        person.setPersonname(request.getPersonname());
        person.setPhonenumber(request.getPhonenumber());
        person.setTypedocument(request.getTypedocument());
        person.setPersonaddress(request.getPersonaddress());
        person.setPersontype(request.getPersontype());

        personRepository.save(person);

        Usertype usertype = new Usertype();
        usertype.setId(request.getUsertypeId());

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPersonIddocument(person);
        user.setUsertypeIdtypeuser(usertype);

        return Optional.of(userRepository.save(user));
    }

    public String getUserTypeByEmail(String email) {
        return userRepository.findById(email)
                .map(user -> user.getUsertypeIdtypeuser().getUsertypename())
                .orElse("Unknown");
    }

    public boolean isTokenValid(String token) {
        return jwtUtils.validateToken(token);
    }

    //obtener el email del usuario a partir del token
    public String getEmailFromToken(String token) {
        return jwtUtils.extractUsername(token);
    }
}
package com.autopartes.BackendAutoPartes.service;

import com.autopartes.BackendAutoPartes.model.dto.*;
import com.autopartes.BackendAutoPartes.model.dto.request.RegisterRequest;
import com.autopartes.BackendAutoPartes.repository.PersonRepository;
import com.autopartes.BackendAutoPartes.repository.UserRepository;
import com.autopartes.BackendAutoPartes.repository.UsertokenRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

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
     * The repository for managing Usertoken entities.
     */
    private final UsertokenRepository tokenRepository;
    /**
     * The password encoder.
     */
    private final BCryptPasswordEncoder passwordEncoder;

    private final PersonRepository personRepository;

    /**
     * Constructor.
     *
     * @param userRepository The repository for managing User entities.
     * @param tokenRepository The repository for managing Usertoken entities.
     * @param passwordEncoder The password encoder.
     */
    public UserService(UserRepository userRepository,
                       UsertokenRepository tokenRepository,
                       BCryptPasswordEncoder passwordEncoder,
                       PersonRepository personRepository) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
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
        userRepository.save(user);
        return user;
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
     * Login a user.
     *
     * @param email The user's email.
     * @param password The user's password.
     * @return Optional containing the found user or empty if not found.
     */
    public Optional<User> login(String email, String password) {
        return userRepository.findById(email)
                .filter(user -> passwordEncoder.matches(password, user.getPassword()));
    }


    /**
     * Generate and save a token for a user.
     *
     * @param user The user to generate the token for.
     * @return The generated token.
     */
    public String generateAndSaveToken(User user) {
        Usertoken token = new Usertoken();
        token.setToken(UUID.randomUUID().toString());
        token.setCreatedat(Instant.now());
        token.setExpiresat(Instant.now().plus(2, ChronoUnit.HOURS));
        token.setUsertokenscol(true);

        Usertoken savedToken = tokenRepository.save(token);

        user.setUsertokensIdtokens(savedToken);
        userRepository.save(user);

        return savedToken.getToken();
    }

    /**
     * Check if a token is valid.
     *
     * @param tokenStr The token to check.
     * @return True if the token is valid, false otherwise.
     */
    public boolean isTokenValid(String tokenStr) {
        Optional<Usertoken> tokenOpt = tokenRepository.findAll().stream()
                .filter(t -> t.getToken().equals(tokenStr))
                .findFirst();

        return tokenOpt.isPresent() &&
                tokenOpt.get().getExpiresat().isAfter(Instant.now());
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
        return login(email, oldPassword).map(user -> {
            user.setPassword(newPassword);
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

        Usertoken token = new Usertoken();
        token.setToken(UUID.randomUUID().toString());
        token.setCreatedat(Instant.now());
        token.setExpiresat(Instant.now().plus(2, ChronoUnit.HOURS));
        token.setUsertokenscol(true);
        tokenRepository.save(token);

        user.setUsertokensIdtokens(token);
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

        Usertoken token = new Usertoken();
        token.setToken(UUID.randomUUID().toString());
        token.setCreatedat(Instant.now());
        token.setExpiresat(Instant.now().plus(2, ChronoUnit.HOURS));
        token.setUsertokenscol(true);
        tokenRepository.save(token);

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPersonIddocument(person);
        user.setUsertypeIdtypeuser(usertype);
        user.setUsertokensIdtokens(token);

        return Optional.of(userRepository.save(user));
    }

}

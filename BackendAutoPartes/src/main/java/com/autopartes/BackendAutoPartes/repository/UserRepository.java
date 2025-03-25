package com.autopartes.BackendAutoPartes.repository;

import com.autopartes.BackendAutoPartes.model.dto.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Interface that extends JpaRepository for CRUD operations on the User entity.
 */
public interface UserRepository extends JpaRepository<User, String> {

    /**
     * Finds a user by email and password.
     *
     * @param email The user's email.
     * @param password The user's password.
     * @return Optional containing the found user or empty if not found.
     */
    Optional<User> findByEmailAndPassword(String email, String password);

}

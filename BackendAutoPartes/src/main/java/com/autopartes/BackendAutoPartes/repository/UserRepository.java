package com.autopartes.BackendAutoPartes.repository;

import com.autopartes.BackendAutoPartes.model.dto.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {

    /**
     * Finds a user by their email address.
     *
     * @param email The email address of the user.
     * @return An Optional containing the User if found, or empty if not found.
     */
    @EntityGraph(attributePaths = {"usertypeIdtypeuser"})
    Optional<User> findByEmail(String email);

}
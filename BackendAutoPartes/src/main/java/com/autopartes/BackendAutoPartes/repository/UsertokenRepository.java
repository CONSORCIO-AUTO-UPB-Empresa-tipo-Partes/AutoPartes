package com.autopartes.BackendAutoPartes.repository;

import com.autopartes.BackendAutoPartes.model.dto.Usertoken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Interface that extends JpaRepository for CRUD operations on the Usertoken entity.
 */
public interface UsertokenRepository extends JpaRepository<Usertoken, Integer> {

    /**
     * Finds a user token by token.
     *
     * @param token The user's token.
     * @return Optional containing the found user token or empty if not found.
     */
    Optional<Usertoken> findByToken(String token);

}

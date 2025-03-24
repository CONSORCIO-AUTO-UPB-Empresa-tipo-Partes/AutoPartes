package com.autopartes.BackendAutoPartes.repository;

import com.autopartes.BackendAutoPartes.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    // Nuevo método para buscar usuario por ID
    Optional<User> findById(Long id);
}
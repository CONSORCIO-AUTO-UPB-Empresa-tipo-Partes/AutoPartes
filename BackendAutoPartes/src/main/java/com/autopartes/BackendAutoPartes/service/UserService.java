package com.autopartes.BackendAutoPartes.service;

import com.autopartes.BackendAutoPartes.model.User;
import com.autopartes.BackendAutoPartes.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Servicio para la gestión de usuarios.
 * <p>
 * Proporciona métodos para registrar usuarios, buscar por email y buscar por identificador único.
 * Además, valida que el ID ingresado tenga el formato correcto.
 */
@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Registra un nuevo usuario en la base de datos.
     * Verifica que el correo electrónico no esté ya registrado.
     *
     * @param user Usuario a registrar.
     * @return Usuario registrado.
     * @throws RuntimeException si el email ya existe.
     */
    public User registerUser(User user) {
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        return userRepository.save(user);
    }

    /**
     * Busca un usuario por su dirección de correo electrónico.
     *
     * @param email Email del usuario.
     * @return Un Optional<User> con el usuario encontrado, si existe.
     */
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    /**
     * Busca un usuario por su identificador único (ID).
     * Valida que el ID sea un número positivo antes de la búsqueda.
     *
     * @param id Identificador único del usuario.
     * @return Un Optional<User> con el usuario encontrado, si existe.
     * @throws IllegalArgumentException si el ID es inválido.
     */
    public Optional<User> getUserById(Long id) {
        // Validación del ID: debe ser un número positivo
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("El identificador debe ser un número positivo.");
        }
        // Búsqueda del usuario en la base de datos
        return userRepository.findById(id);
    }
}

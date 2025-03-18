package com.autopartes.BackendAutoPartes.controller;

import com.autopartes.BackendAutoPartes.model.User;
import com.autopartes.BackendAutoPartes.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

/**
 * Controlador REST para la gestión de usuarios.
 * Proporciona endpoints para registrar, buscar por email y buscar por identificador único.
 */
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Endpoint para registrar un nuevo usuario.
     *
     * @param user Usuario a registrar.
     * @return Respuesta con el usuario registrado.
     */
    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        User newUser = userService.registerUser(user);
        return ResponseEntity.ok(newUser);
    }

    /**
     * Endpoint para buscar un usuario por su dirección de correo electrónico.
     *
     * @param email Email del usuario a buscar.
     * @return Respuesta con el usuario encontrado o mensaje de error si no existe.
     */
    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        return userService.getUserByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Endpoint para buscar un usuario por su identificador único (ID).
     * Valida que el ID tenga el formato correcto antes de la búsqueda.
     *
     * @param id Identificador del usuario a buscar.
     * @return Respuesta con el usuario encontrado o mensaje de error si no existe.
     */
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        try {
            // Llamada al servicio para buscar el usuario por ID
            Optional<User> user = userService.getUserById(id);
            return user.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            // Manejo de error si el ID no es válido
            return ResponseEntity.badRequest().body(null);
        }
    }
}
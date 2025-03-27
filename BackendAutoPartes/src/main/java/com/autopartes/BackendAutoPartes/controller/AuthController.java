package com.autopartes.BackendAutoPartes.controller;

import com.autopartes.BackendAutoPartes.model.dto.response.AuthResponse;
import com.autopartes.BackendAutoPartes.model.dto.request.LoginRequest;
import com.autopartes.BackendAutoPartes.model.dto.request.RegisterRequest;
import com.autopartes.BackendAutoPartes.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


/**
 * Controller for handling authentication requests.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    /**
     * The UserService to delegate the authentication requests to.
     */
    private final UserService userService;

    /**
     * Constructor.
     *
     * @param userService The UserService to delegate the authentication requests to.
     */
    public AuthController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Handles the login request.
     *
     * @param loginRequest The login request.
     * @return The response entity containing the authentication response.
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        return userService.login(loginRequest.getEmail(), loginRequest.getPassword())
                .map(user -> {
                    String token = userService.generateAndSaveToken(user);
                    AuthResponse authResponse = new AuthResponse(
                            token,
                            user.getUsertokensIdtokens().getExpiresat(),
                            user.getEmail(),
                            user.getUsertypeIdtypeuser().getUsertypename()
                    );
                    return ResponseEntity.ok().body(authResponse);
                })
                .orElse(ResponseEntity.status(401).body(
                        new AuthResponse(null, null, null, "Credenciales inválidas")
                ));
    }

    /**
     * Handles the token validation request.
     *
     * @param token The token to validate.
     * @return The response entity containing the validation result.
     */
    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestParam String token) {
        boolean valid = userService.isTokenValid(token);
        return ResponseEntity.ok().body(valid ? "Token válido" : "Token inválido o expirado");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        System.out.println("Entrando a register con: " + request.getEmail());

        return userService.register(request)
                .map(savedUser -> ResponseEntity.ok("Usuario registrado correctamente"))
                .orElse(ResponseEntity.status(409).body("El correo ya está registrado"));
    }

    /**
     * Handles exceptions.
     *
     * @param ex The exception.
     * @return The response entity containing the error message.
     */
    @ExceptionHandler
    public ResponseEntity<?> handleException(Exception ex) {
        return ResponseEntity.badRequest().body("Error: " + ex.getMessage());
    }

}
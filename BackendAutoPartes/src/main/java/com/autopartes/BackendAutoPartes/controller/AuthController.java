package com.autopartes.BackendAutoPartes.controller;

import com.autopartes.BackendAutoPartes.dto.LoginRequest;
import com.autopartes.BackendAutoPartes.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5500")
public class AuthController {
    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<String> token = userService.authenticate(request.getEmail(), request.getPassword());

        if (token.isPresent()) {
            return ResponseEntity.ok(Map.of(
                    "message", "Inicio de sesión exitoso",
                    "token", token.get(),
                    "redirect", "Catalogo.html"
            ));
        } else {
            return ResponseEntity.status(401).body(Map.of("error", "Credenciales incorrectas"));
        }
    }
}

package com.autopartes.BackendAutoPartes.controller;

import com.autopartes.BackendAutoPartes.dto.LoginRequest;
import com.autopartes.BackendAutoPartes.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://127.0.0.1:5500") // Permite el acceso desde el frontend local
public class AuthController {
    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        boolean authenticated = userService.authenticate(request.getEmail(), request.getPassword());

        if (authenticated) {
            return ResponseEntity.ok(Map.of(
                    "message", "Inicio de sesión exitoso",
                    "redirect", "Catalogo.html"
            ));
        } else {
            return ResponseEntity.status(401).body(Map.of("error", "Credenciales incorrectas"));
        }
    }
}

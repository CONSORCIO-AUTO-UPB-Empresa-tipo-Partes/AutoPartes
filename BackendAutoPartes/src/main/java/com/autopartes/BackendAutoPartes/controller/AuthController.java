package com.autopartes.BackendAutoPartes.controller;

import com.autopartes.BackendAutoPartes.model.dto.Person;
import com.autopartes.BackendAutoPartes.model.dto.User;
import com.autopartes.BackendAutoPartes.model.dto.response.AuthResponse;
import com.autopartes.BackendAutoPartes.model.dto.request.LoginRequest;
import com.autopartes.BackendAutoPartes.model.dto.request.RegisterRequest;
import com.autopartes.BackendAutoPartes.repository.PersonRepository;
import com.autopartes.BackendAutoPartes.repository.UserRepository;
import com.autopartes.BackendAutoPartes.security.JwtUtils;
import com.autopartes.BackendAutoPartes.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;


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
    private final JwtUtils jwtUtils;
    private final PersonRepository personRepository;
    private final UserRepository userRepository;

    /**
     * Constructor for AuthController.
     *
     * @param userService The UserService to delegate the authentication requests to.
     * @param jwtUtils The utility class for handling JWT operations.
     * @param personRepository The repository for managing Person entities.
     * @param userRepository 
     */
    public AuthController(UserService userService, JwtUtils jwtUtils, PersonRepository personRepository, UserRepository userRespository, UserRepository userRepository) {
        this.userService = userService;
        this.jwtUtils = jwtUtils;
        this.personRepository = personRepository;
        this.userRepository = userRepository;
    }

    /**
     * Handles the login request.
     *
     * @param loginRequest The login request containing email and password.
     * @return The response entity containing the authentication token and user information.
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        return userService.login(loginRequest.getEmail(), loginRequest.getPassword())
                .map(token -> {
                    Instant expiresAt = jwtUtils.extractExpiration(token).toInstant();
                    String userType = userService.getUserTypeByEmail(loginRequest.getEmail());

                    AuthResponse response = new AuthResponse(
                            token,
                            expiresAt,
                            loginRequest.getEmail(),
                            userType
                    );
                    return ResponseEntity.ok(response);
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
        return ResponseEntity.ok().body(Map.of("message", valid ? "Token válido" : "Token inválido o expirado"));
    }

    /**
     * Handles the registration request.
     *
     * @param request The registration request containing user information.
     * @return The response entity containing the registration result.
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        System.out.println("Entrando a register con: " + request.getEmail());

        return userService.register(request)
                .map(savedUser -> ResponseEntity.ok(Map.of("message", "Usuario registrado correctamente")))
                .orElse(ResponseEntity.status(409).body(Map.of("error", "El correo ya está registrado")));
    }

    /**
     * Handles exceptions.
     *
     * @param ex The exception.
     * @return The response entity containing the error message.
     */
    @ExceptionHandler
    public ResponseEntity<?> handleException(Exception ex) {
        return ResponseEntity.badRequest().body(Map.of("error", "Error: " + ex.getMessage()));
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUserInfo() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userService.findByEmail(username)
                .map(user -> ResponseEntity.ok().body(
                        Map.of(
                                "email", user.getEmail(),
                                "userType", user.getUsertypeIdtypeuser().getUsertypename()
                        )
                ))
                .orElse(ResponseEntity.status(401).build());
    }

    /**
     * Logout a user by invalidating their token
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            // JWT is stateless - client simply discards the token
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }

    /**
     * Get user profile information.
     *
     * @param authHeader The authorization header containing the JWT token.
     * @return The response entity containing the user profile information.
     */
    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Map.of("error", "Token no proporcionado"));
        }

        String token = authHeader.substring(7);
        String email = jwtUtils.extractUsername(token);

        return userService.findByEmail(email)
                .map(user -> {
                    Person p = user.getPersonIddocument();
                    return ResponseEntity.ok().body(Map.of(
                            "name", p.getPersonname().split(" ")[0],
                            "lastname", p.getPersonname().substring(p.getPersonname().indexOf(" ") + 1),
                            "email", user.getEmail(),
                            "phone", p.getPhonenumber(),
                            "address", p.getPersonaddress(),
                            "documentType", p.getTypedocument(),
                            "document", p.getIddocument()
                    ));
                })
                .orElse(ResponseEntity.status(404).body(Map.of("error", "Usuario no encontrado")));
    }

    /**
     * Update user profile information.
     *
     * @param authHeader The authorization header containing the JWT token.
     * @param body The request body containing the updated profile information.
     * @return The response entity indicating the result of the update operation.
     */
    @PutMapping("/profile")
    public ResponseEntity<?> updateUserProfile(@RequestHeader("Authorization") String authHeader,
                                               @RequestBody Map<String, String> body) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body("Token no proporcionado");
        }

        String token = authHeader.substring(7);
        String email = jwtUtils.extractUsername(token);

        return userService.findByEmail(email)
                .map(user -> {
                    Person p = user.getPersonIddocument();
                    p.setPersonname(body.get("name") + " " + body.get("lastname"));
                    p.setPhonenumber(body.get("phone"));
                    p.setPersonaddress(body.get("address"));
                    p.setTypedocument(body.get("documentType"));
                    p.setIddocument(body.get("document"));

                    personRepository.save(p); // Guarda cambios
                    return ResponseEntity.ok("Perfil actualizado");
                })
                .orElse(ResponseEntity.status(404).body("Usuario no encontrado"));
    }

     @GetMapping("/user-info")
    public ResponseEntity<?> getUserInfo(@RequestHeader("Authorization") String authHeader,
                                        @RequestParam(required = false) String email) {
        // Extraer el token
        String token = authHeader.replace("Bearer ", "");
        
        // Si no se proporciona email, obtenerlo del token
        if (email == null || email.isEmpty()) {
            email = jwtUtils.extractUsername(token);
        }
        
        // Verificar si el token es válido
        if (!jwtUtils.validateToken(token)) {
            return ResponseEntity.status(401).body(Map.of("error", "Token inválido"));
        }
        
        Optional<User> userOptional = userRepository.findByEmail(email);
        
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            Person person = user.getPersonIddocument();
            
            Map<String, Object> userData = new HashMap<>();
            userData.put("email", user.getEmail());
            userData.put("userType", user.getUsertypeIdtypeuser().getUsertypename());
            
            if (person != null) {
                String[] nameParts = person.getPersonname().split(" ", 2);
                userData.put("name", nameParts[0]);
                userData.put("lastname", nameParts.length > 1 ? nameParts[1] : "");
                userData.put("phone", person.getPhonenumber());
                userData.put("address", person.getPersonaddress());
                userData.put("documentType", person.getTypedocument());
                userData.put("document", person.getIddocument());
            }
            
            return ResponseEntity.ok(userData);
        } else {
            return ResponseEntity.status(404).body(Map.of("error", "Usuario no encontrado"));
        }
    }
    

}
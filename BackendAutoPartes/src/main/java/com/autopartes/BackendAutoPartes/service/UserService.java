package com.autopartes.BackendAutoPartes.service;

import com.autopartes.BackendAutoPartes.model.User;
import com.autopartes.BackendAutoPartes.repository.UserRepository;
import com.autopartes.BackendAutoPartes.security.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserService(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder(); // Encriptador de contraseñas
        this.jwtUtil = jwtUtil;
    }

    /**
     * Registra un nuevo usuario con contraseña encriptada.
     */
    public User registerUser(User user) {
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("El correo ya está registrado.");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword())); // Encriptar la contraseña
        return userRepository.save(user);
    }

    /**
     * Autenticación del usuario y generación de JWT.
     */
    public Optional<String> authenticate(String email, String rawPassword) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent() && passwordEncoder.matches(rawPassword, user.get().getPassword())) {
            return Optional.of(jwtUtil.generateToken(email)); // Devuelve un JWT en caso de éxito
        }
        return Optional.empty();
    }
}

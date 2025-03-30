package com.autopartes.BackendAutoPartes.service;

import com.autopartes.BackendAutoPartes.model.dto.User;
import com.autopartes.BackendAutoPartes.repository.UserRepository;
import com.autopartes.BackendAutoPartes.repository.UsertokenRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Service for managing user context.
 * This service provides methods to retrieve user information based on tokens.
 */
@Service
public class UserContextService {

    private final UserRepository userRepository;
    private final UsertokenRepository tokenRepository;

    /**
     * Constructor.
     *
     * @param userRepository The repository for managing User entities.
     * @param tokenRepository The repository for managing Usertoken entities.
     */
    public UserContextService(UserRepository userRepository, UsertokenRepository tokenRepository) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
    }

    /**
     * Retrieves the user associated with the given token.
     *
     * @param token The token to look up.
     * @return An Optional containing the User if found, or empty if not.
     */
    public Optional<User> getUserFromToken(String token) {
        return tokenRepository.findByToken(token)
                .flatMap(userToken -> userRepository.findByUsertokensIdtokens(userToken));
    }

    /**
     * Retrieves the user type from the token.
     *
     * @param token The token to extract the user type from.
     * @return The user type, or null if not found.
     */
    public String getUserTypeFromToken(String token) {
        return getUserFromToken(token)
                .map(user -> user.getUsertypeIdtypeuser().getUsertypename())
                .orElse(null);
    }
}
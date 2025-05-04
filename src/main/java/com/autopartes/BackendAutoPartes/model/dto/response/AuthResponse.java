package com.autopartes.BackendAutoPartes.model.dto.response;

import java.time.Instant;

/**
 * Represents the response returned after a successful login.
 */
public record AuthResponse(
        String token,
        Instant expiresAt,
        String email,
        String userType
) {}

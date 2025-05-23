package com.autopartes.BackendAutoPartes.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

/**
 * Utility class for generating and validating JWT tokens.
 */
@Component
public class JwtUtils {

    private static final String SECRET_KEY = "clave-super-secreta-de-256-bits-para-autopartes-upb-2025!!";

    private final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    private static final long EXPIRATION_TIME = 86400000;

    /**
     * Generates a JWT token for the given username and role.
     *
     * @param username The username to include in the token.
     * @param role The role to include in the token.
     * @return The generated JWT token.
     */
    public String generateToken(String username, String role) {
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role) // 👈 Agregamos el rol
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }


    /**
     * Validates the given JWT token.
     *
     * @param token The token to validate.
     * @return True if the token is valid, false otherwise.
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    /**
     * Extracts the username from the given JWT token.
     *
     * @param token The token to extract the username from.
     * @return The extracted username.
     */
    public String extractUsername(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    /**
     * Extracts the role from the given JWT token.
     *
     * @param token The token to extract the role from.
     * @return The extracted role.
     */
    public String extractRole(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.get("role", String.class);
    }

    /**
     * Extracts the expiration date from the given JWT token.
     *
     * @param token The token to extract the expiration date from.
     * @return The extracted expiration date.
     */
    public Date extractExpiration(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();
    }

}

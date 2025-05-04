package com.autopartes.BackendAutoPartes.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

/**
 * JwtFilter is a filter that checks for JWT tokens in the request headers.
 * If a valid token is found, it sets the authentication in the security context.
 */
@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    private final UserDetailsService userDetailsService;

    /**
     * Constructor for JwtFilter.
     *
     * @param jwtUtils The utility class for generating and validating JWT tokens.
     * @param userDetailsService The service for loading user details.
     */
    public JwtFilter(JwtUtils jwtUtils, UserDetailsService userDetailsService) {
        this.jwtUtils = jwtUtils;
        this.userDetailsService = userDetailsService;
    }

    /**
     * Filters the incoming request to check for a JWT token.
     * If a valid token is found, it sets the authentication in the security context.
     *
     * @param request The incoming HTTP request.
     * @param response The HTTP response.
     * @param filterChain The filter chain to continue processing the request.
     * @throws ServletException If an error occurs during filtering.
     * @throws IOException If an I/O error occurs during filtering.
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        String token = null;
        String username = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            username = jwtUtils.extractUsername(token);
            System.out.println("[JwtFilter] Token recibido: " + token);
            System.out.println("[JwtFilter] Usuario extraído del token: " + username);
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            if (jwtUtils.validateToken(token)) {
                var userDetails = userDetailsService.loadUserByUsername(username);
                System.out.println("[JwtFilter] UserDetails encontrado: " + userDetails.getUsername());
                System.out.println("[JwtFilter] Autoridades: " + userDetails.getAuthorities());

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
                System.out.println("[JwtFilter] Autenticación seteada en contexto.");
            } else {
                System.out.println("[JwtFilter] Token inválido");
            }
        } else {
            System.out.println("[JwtFilter] No se estableció autenticación en contexto");
        }

        filterChain.doFilter(request, response);
    }


}

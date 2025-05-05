package com.autopartes.BackendAutoPartes.config;

import com.autopartes.BackendAutoPartes.security.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.http.HttpMethod;

/**
 * Security configuration class for the application.
 * This class configures the security settings for the application, including CSRF protection,
 * authorization rules, and JWT filter.
 */
@Configuration
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**", "/css/**", "/js/**", "/img/**", "/*.html", "/favicon.ico").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll() // Allow GET for products
                        .requestMatchers(HttpMethod.POST, "/api/products").hasAnyRole("ADMINISTRADOR", "BODEGUERO") 
                        .requestMatchers(HttpMethod.PUT, "/api/products/**").hasAnyRole("ADMINISTRADOR", "BODEGUERO") 
                        .requestMatchers(HttpMethod.DELETE, "/api/products/**").hasAnyRole("ADMINISTRADOR", "BODEGUERO") 
                        .requestMatchers("/api/persons/**").hasAnyRole("ADMINISTRADOR", "SECRETARIA") 
                        .requestMatchers(HttpMethod.POST, "/api/bills").hasAnyRole("ADMINISTRADOR", "CLIENTE")
                        .requestMatchers(HttpMethod.GET, "/api/bills/customer/{document}").hasAnyRole("ADMINISTRADOR", "CLIENTE")
                        .requestMatchers(HttpMethod.GET, "/api/bills/{id}").hasAnyRole("ADMINISTRADOR", "CLIENTE")
                        .requestMatchers("/api/bills/**").hasRole("ADMINISTRADOR") 
                        .requestMatchers("/api/usertype/**").hasRole("ADMINISTRADOR") 
                        .requestMatchers("/api/providers/**").hasAnyRole("ADMINISTRADOR", "BODEGUERO") 
                        .requestMatchers("/api/batch/**").hasAnyRole("ADMINISTRADOR", "BODEGUERO") 
                        .requestMatchers("/api/returns/**").hasAnyRole("ADMINISTRADOR", "BODEGUERO") 
                        .requestMatchers("/uploads/images/**").permitAll() // Exclude uploads/images from JWT filter
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}

package com.autopartes.BackendAutoPartes.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Configuration class for the password encoder.
 */
@Configuration
public class PasswordEncoderConfig {

    /**
     * Creates a new BCryptPasswordEncoder.
     *
     * @return The BCryptPasswordEncoder.
     */
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

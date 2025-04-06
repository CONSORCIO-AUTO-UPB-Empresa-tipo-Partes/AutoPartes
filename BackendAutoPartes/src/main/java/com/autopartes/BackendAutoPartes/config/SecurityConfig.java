package com.autopartes.BackendAutoPartes.config;

import com.autopartes.BackendAutoPartes.security.JwtFilter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Security configuration class for the application.
 * This class configures the security settings for the application, including CSRF protection,
 * authorization rules, and JWT filter.
 */
@Configuration
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    /**
     * Configures the security filter chain for the application.
     *
     * @param http The HttpSecurity object to configure.
     * @return The configured SecurityFilterChain.
     * @throws Exception If an error occurs during configuration.
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/auth/**",
                                "/css/**", "/js/**", "/img/**", "/static/**",
                                "/InicioSesionCliente.html",
                                "/Registro.html",
                                "/CatalogoPrincipal.html",
                                "/PrincipalUltimo.html",
                                "/Contacto.html",
                                "/Catalogo.html",
                                "/Perfil.html",
                                "/Carrito.html",
                                "/Historial_Compras.html",

                                //Para desarrollo, NO SE ME VAYA A OLVIDAR QUITAR ESTA MIERDA DIOS MIO
                                "/api/batches/**",
                                "/api/itemtypes/**",
                                "/api/providers/**"
                        ).permitAll()
                        .requestMatchers(
                                "/api/catalog/**",
                                "/api/bills/**",
                                "/api/auth/profile"
                        ).hasAnyRole("CLIENTE", "BODEGUERO", "ADMINISTRADOR")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

}

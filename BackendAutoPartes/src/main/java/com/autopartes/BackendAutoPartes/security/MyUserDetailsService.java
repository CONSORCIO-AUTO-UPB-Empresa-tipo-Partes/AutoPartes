package com.autopartes.BackendAutoPartes.security;

import com.autopartes.BackendAutoPartes.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service for loading user details.
 * Implements UserDetailsService to provide user information for authentication.
 */
@Service
public class MyUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public MyUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Loads user details by username (email).
     *
     * @param username The username (email) of the user.
     * @return UserDetails object containing user information.
     * @throws UsernameNotFoundException If the user is not found.
     */
    @Override
    public UserDetails loadUserByUsername(String username) {
        var user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("No se encontró el usuario"));

        String role = "ROLE_" + user.getUsertypeIdtypeuser().getUsertypename().toUpperCase();
        System.out.println("[MyUserDetailsService] Usuario: " + username + " | Rol: " + role);

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                List.of(new SimpleGrantedAuthority(role))
        );
    }


}

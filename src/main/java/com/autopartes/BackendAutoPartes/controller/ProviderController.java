package com.autopartes.BackendAutoPartes.controller;

import com.autopartes.BackendAutoPartes.model.dto.Provider;
import com.autopartes.BackendAutoPartes.service.ProviderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for managing Provider entities.
 */
@RestController
@RequestMapping("/api/providers")
public class ProviderController {
    private final ProviderService providerService;

    /**
     * Constructor.
     *
     * @param providerService The service for managing Provider entities.
     */
    public ProviderController(ProviderService providerService) {
        this.providerService = providerService;
    }

    /**
     * Gets all providers.
     *
     * @return List containing all providers.
     */
    @GetMapping
    public ResponseEntity<List<Provider>> getAllProviders() {
        return ResponseEntity.ok(providerService.findAll());
    }

    /**
     * Gets a provider by ID.
     *
     * @param id The ID of the provider.
     * @return The provider with the specified ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Provider> getProviderById(@PathVariable Integer id) {
        return providerService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Gets a provider by name.
     *
     * @param name The name of the provider.
     * @return The provider with the specified name.
     */
    @GetMapping("/name/{name}")
    public ResponseEntity<Provider> getProviderByName(@PathVariable("name") String name) {
        return providerService.findByName(name)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Creates a new provider.
     *
     * @param provider The provider data.
     * @return The created provider.
     */
    @PostMapping
    public ResponseEntity<Provider> createProvider(@Valid @RequestBody Provider provider)
    {
        return ResponseEntity.status(HttpStatus.CREATED).body(providerService.save(provider));
    }

    /**
     * Updates an existing provider by name.
     *
     * @param name The name of the provider to update.
     * @param provider The new provider data.
     * @return The updated provider if found, or 404 if not found.
     */
    @PutMapping("/name/{name}")
    public ResponseEntity<Provider> updateProviderByName(
            @PathVariable String name,
            @RequestBody Provider provider) {
        return providerService.updateByName(name, provider)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Updates an existing provider by ID.
     *
     * @param id The ID of the provider to update.
     * @return The updated provider if found, or 404 if not found.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProvider(@PathVariable Integer id) {
        providerService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
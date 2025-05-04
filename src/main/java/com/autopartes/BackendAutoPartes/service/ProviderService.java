package com.autopartes.BackendAutoPartes.service;

import com.autopartes.BackendAutoPartes.model.dto.Provider;
import com.autopartes.BackendAutoPartes.repository.ProviderRepository;
import com.autopartes.BackendAutoPartes.utils.ReusableServices;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service for managing Provider entities.
 */
@Service
public class ProviderService {

    /**
     * The repository for managing Provider entities.
     */
    private final ProviderRepository providerRepository;

    /**
     * Constructor.
     *
     * @param providerRepository The repository for managing Provider entities.
     */
    public ProviderService(ProviderRepository providerRepository) {
        this.providerRepository = providerRepository;
    }

    /**
     * Finds all providers.
     *
     * @return List containing all providers.
     */
    public List<Provider> findAll() {
        return providerRepository.findAll();
    }

    /**
     * Finds a provider by id.
     *
     * @param id The provider's id.
     * @return Optional containing the found provider or empty if not found.
     */
    public Optional<Provider> findById(Integer id) {
        return providerRepository.findById(id);
    }

    /**
     * Saves a provider.
     *
     * @param provider The provider to save.
     * @return The saved provider.
     */
    public Provider save(Provider provider) {
        return providerRepository.save(provider);
    }

    /**
     * Deletes a provider by id.
     *
     * @param id The provider's id.
     */
    public void deleteById(Integer id) {
        providerRepository.deleteById(id);
    }

    /**
     * Finds a provider by name.
     *
     * @param name The provider's name.
     * @return Optional containing the found provider or empty if not found.
     */
    public Optional<Provider> findByName(String name) {
            return ReusableServices.findByName("provider_name", findAll(), Provider::getName);
    }

    /**
     * Updates a provider by name.
     *
     * @param name The provider's name.
     * @param provider The provider to update.
     * @return Optional containing the updated provider or empty if not found.
     */
    public Optional<Provider> updateByName(String name, Provider provider) {
        List<Provider> providers = providerRepository.findAll();
        for (Provider provider1 : providers) {
            if (provider1.getName().equals(name)) {
                provider1.setName(provider.getName());
                return Optional.of(providerRepository.save(provider1));
            }
        }
        return Optional.empty();
    }


}

package com.autopartes.BackendAutoPartes.repository;

import com.autopartes.BackendAutoPartes.model.dto.Provider;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Interface that extends JpaRepository for CRUD operations on the Provider entity.
 */
public interface ProviderRepository extends JpaRepository<Provider, Integer> {

}

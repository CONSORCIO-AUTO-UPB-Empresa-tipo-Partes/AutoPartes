package com.autopartes.BackendAutoPartes.controller;

import com.autopartes.BackendAutoPartes.model.dto.response.BatchResponse;
import com.autopartes.BackendAutoPartes.observer.CatalogUpdateObserver;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

/**
 * Controller for the catalog.
 */
@RestController
@RequestMapping("/api/catalog")
public class CatalogController {
    private final CatalogUpdateObserver catalogObserver;

    /**
     * Constructor.
     *
     * @param catalogObserver The observer for the catalog.
     */
    public CatalogController(CatalogUpdateObserver catalogObserver) {
        this.catalogObserver = catalogObserver;
    }

    /**
     * Gets the current catalog.
     *
     * @return The current catalog.
     */
    @GetMapping
    public ResponseEntity<List<BatchResponse>> getCurrentCatalog() {
        return ResponseEntity.ok(catalogObserver.getCurrentCatalog());
    }
}
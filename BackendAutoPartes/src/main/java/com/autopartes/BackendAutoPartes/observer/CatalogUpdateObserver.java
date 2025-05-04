package com.autopartes.BackendAutoPartes.observer;

import com.autopartes.BackendAutoPartes.model.dto.response.BatchResponse;
import com.autopartes.BackendAutoPartes.service.BatchService;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * Observer for catalog updates.
 */
@Component
public class CatalogUpdateObserver implements CatalogObserver {
    private final BatchService batchService;

    private volatile List<BatchResponse> catalogCache = new CopyOnWriteArrayList<>();
    private volatile boolean isCacheInitialized = false;

    public CatalogUpdateObserver(BatchService batchService,
                                 CatalogObserverService observerService) {
        this.batchService = batchService;
        observerService.addObserver(this);
    }

    /**
     * Called when the catalog changes.
     *
     * @param event The event that occurred.
     */
    @Override
    public void onCatalogChange(CatalogChangeEvent event) {
        switch (event.getType()) {
            case BATCH_ADDED:
            case BATCH_UPDATED:
            case BATCH_DELETED:
            case ITEM_SOLD:
                refreshCatalog();
                break;
            case ITEM_TYPE_ADDED:
            case ITEM_TYPE_UPDATED:
            case ITEM_TYPE_DELETED:
                refreshCatalog();
                break;
        }
    }

    /**
     * Refreshes the catalog cache.
     */
    private void refreshCatalog() {
        catalogCache = batchService.findAll();
        isCacheInitialized = true;
    }

    /**
     * Gets the current catalog.
     *
     * @return The current catalog.
     */
    public List<BatchResponse> getCurrentCatalog() {
        if (!isCacheInitialized) {
            refreshCatalog();
        }
        return catalogCache;
    }
}
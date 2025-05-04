package com.autopartes.BackendAutoPartes.observer;

/**
 * Interface for catalog observers.
 */
public interface CatalogObserver {

    /**
     * Called when a catalog change event occurs.
     *
     * @param event The event that occurred.
     */
    void onCatalogChange(CatalogChangeEvent event);
}
package com.autopartes.BackendAutoPartes.observer;

import org.springframework.stereotype.Component;
import java.util.ArrayList;
import java.util.List;

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
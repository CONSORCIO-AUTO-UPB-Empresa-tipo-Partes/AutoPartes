package com.autopartes.BackendAutoPartes.observer;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Service for managing catalog observers.
 */
@Component
public class CatalogObserverService {

    /**
     * List of observers.
     */
    private final List<CatalogObserver> observers = new ArrayList<>();

    /**
     * Adds an observer to the list of observers.
     *
     * @param observer The observer to add.
     */
    public void addObserver(CatalogObserver observer) {
        observers.add(observer);
    }

    /**
     * Removes an observer from the list of observers.
     *
     * @param observer The observer to remove.
     */
    public void removeObserver(CatalogObserver observer) {
        observers.remove(observer);
    }

    /**
     * Notifies all observers that the catalog has changed.
     *
     * @param event The event that occurred.
     */
    public void notifyCatalogChanged(CatalogChangeEvent event) {
        for (CatalogObserver observer : observers) {
            observer.onCatalogChange(event);
        }
    }
}
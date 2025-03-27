package com.autopartes.BackendAutoPartes.service;

import com.autopartes.BackendAutoPartes.model.dto.Itemtype;
import com.autopartes.BackendAutoPartes.model.dto.request.ItemtypeRequest;
import com.autopartes.BackendAutoPartes.observer.CatalogChangeEvent;
import com.autopartes.BackendAutoPartes.observer.CatalogObserverService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for managing Itemtype entities.
 */
@Service
public class ItemtypeServiceObserver {
    private final ItemtypeService itemtypeService;
    private final CatalogObserverService observerService;

    /**
     * Constructor.
     *
     * @param itemtypeService The service for managing Itemtype entities.
     * @param observerService The service for managing CatalogObserverService entities.
     */
    public ItemtypeServiceObserver(ItemtypeService itemtypeService, CatalogObserverService observerService) {
        this.itemtypeService = itemtypeService;
        this.observerService = observerService;
    }

    /**
     * Saves an itemtype.
     *
     * @param itemtypeRequest The itemtype to save.
     * @return The saved itemtype.
     */
    @Transactional
    public Itemtype save(ItemtypeRequest itemtypeRequest) {
        Itemtype result = itemtypeService.save(itemtypeRequest);
        observerService.notifyCatalogChanged(
            new CatalogChangeEvent(CatalogChangeEvent.ChangeType.ITEM_TYPE_ADDED, result)
        );
        return result;
    }

    /*
     * Deletes an itemtype by id.
     *
     * @param id The itemtype's id.
     */
    @Transactional
    public void deleteById(Integer id) {
        itemtypeService.findById(id).ifPresent(itemType -> {
            itemtypeService.deleteById(id);
            observerService.notifyCatalogChanged(
                new CatalogChangeEvent(CatalogChangeEvent.ChangeType.ITEM_TYPE_DELETED, itemType)
            );
        });
    }
}
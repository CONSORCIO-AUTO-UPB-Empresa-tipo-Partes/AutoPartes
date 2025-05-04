package com.autopartes.BackendAutoPartes.service;

import com.autopartes.BackendAutoPartes.model.dto.request.BatchRequest;
import com.autopartes.BackendAutoPartes.model.dto.response.BatchResponse;
import com.autopartes.BackendAutoPartes.observer.CatalogChangeEvent;
import com.autopartes.BackendAutoPartes.observer.CatalogObserverService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Service for managing Batch entities.
 */
@Service
public class BatchServiceObserver {
    private final BatchService batchService;
    private final CatalogObserverService observerService;

    /**
     * Constructor.
     *
     * @param batchService The service for managing Batch entities.
     * @param observerService The service for managing CatalogObserverService entities.
     */
    public BatchServiceObserver(BatchService batchService, CatalogObserverService observerService) {
        this.batchService = batchService;
        this.observerService = observerService;
    }

    /**
     * Creates a batch.
     *
     * @param request The batch to create.
     * @return The created batch.
     */
    @Transactional
    public Optional<BatchResponse> createBatch(BatchRequest request) {
        Optional<BatchResponse> result = batchService.createBatch(request);
        result.ifPresent(batch ->
            observerService.notifyCatalogChanged(
                new CatalogChangeEvent(CatalogChangeEvent.ChangeType.BATCH_ADDED, batch)
            )
        );
        return result;
    }

    /**
     * Updates a batch.
     *
     * @param id The batch's id.
     * @param request The batch to update.
     * @return The updated batch.
     */
    @Transactional
    public Optional<BatchResponse> updateBatch(Integer id, BatchRequest request) {
        Optional<BatchResponse> result = batchService.updateBatch(id, request);
        result.ifPresent(batch ->
            observerService.notifyCatalogChanged(
                new CatalogChangeEvent(CatalogChangeEvent.ChangeType.BATCH_UPDATED, batch)
            )
        );
        return result;
    }

    /**
     * Deletes a batch by id.
     *
     * @param id The batch's id.
     */
    @Transactional
    public void deleteById(Integer id) {
        batchService.findById(id).ifPresent(batch -> {
            batchService.deleteById(id);
            observerService.notifyCatalogChanged(
                new CatalogChangeEvent(CatalogChangeEvent.ChangeType.BATCH_DELETED, batch)
            );
        });
    }
}
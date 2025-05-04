package com.autopartes.BackendAutoPartes.service;

import com.autopartes.BackendAutoPartes.model.dto.request.BillCreateRequest;
import com.autopartes.BackendAutoPartes.model.dto.response.BillResponse;
import com.autopartes.BackendAutoPartes.observer.CatalogChangeEvent;
import com.autopartes.BackendAutoPartes.observer.CatalogObserverService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Service for managing Bill entities.
 */
@Service
public class BillServiceObserver {

    private final BillService billService;
    private final CatalogObserverService observerService;

    /**
     * Constructor.
     *
     * @param billService The service for managing Bill entities.
     * @param observerService The service for managing CatalogObserverService entities.
     */
    public BillServiceObserver(BillService billService, CatalogObserverService observerService) {
        this.billService = billService;
        this.observerService = observerService;
    }

    /**
     * Creates a bill.
     *
     * @param request The bill to create.
     * @return The created bill.
     */
    @Transactional
    public Optional<BillResponse> createBill(BillCreateRequest request) {
        Optional<BillResponse> result = billService.createBill(request);
        result.ifPresent(bill ->
            observerService.notifyCatalogChanged(
                new CatalogChangeEvent(CatalogChangeEvent.ChangeType.ITEM_SOLD, bill)
            )
        );
        return result;
    }
}
package com.autopartes.BackendAutoPartes.service;

import com.autopartes.BackendAutoPartes.model.dto.Batch;
import com.autopartes.BackendAutoPartes.model.dto.Itemtype;
import com.autopartes.BackendAutoPartes.model.dto.Provider;
import com.autopartes.BackendAutoPartes.model.dto.request.BatchRequest;
import com.autopartes.BackendAutoPartes.model.dto.response.BatchResponse;
import com.autopartes.BackendAutoPartes.repository.BatchRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

/**
 * Service for managing Batch entities.
 */
@Service
public class BatchService {
    private final BatchRepository batchRepository;
    private final ProviderService providerService;
    private final ItemtypeService itemtypeService;

    public BatchService(BatchRepository batchRepository,
                        ProviderService providerService,
                        ItemtypeService itemtypeService) {
        this.batchRepository = batchRepository;
        this.providerService = providerService;
        this.itemtypeService = itemtypeService;
    }

    public List<BatchResponse> findAll() {
        return batchRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    public Optional<BatchResponse> findById(Integer id) {
        return batchRepository.findById(id)
                .map(this::mapToResponse);
    }

    public Optional<BatchResponse> createBatch(BatchRequest request) {
        return validateBatchRequest(request)
                .flatMap(req -> {
                    Optional<Provider> providerOpt = providerService.findById(req.getProviderId());
                    Optional<Itemtype> itemOpt = itemtypeService.findById(req.getItemId());

                    if (providerOpt.isEmpty() || itemOpt.isEmpty()) {
                        return Optional.empty();
                    }

                    Batch batch = new Batch();
                    updateBatchFromRequest(batch, req);
                    batch.setInitialquantity(req.getQuantity());
                    batch.setProviderIdprovider(providerOpt.get());
                    batch.setItemIditem(itemOpt.get());

                    return Optional.of(mapToResponse(batchRepository.save(batch)));
                });
    }

    public Optional<BatchResponse> updateBatch(Integer id, BatchRequest request) {
        return batchRepository.findById(id)
                .map(batch -> {
                    validateQuantity(request.getQuantity(), batch.getInitialquantity());
                    updateBatchFromRequest(batch, request);
                    return mapToResponse(batchRepository.save(batch));
                });
    }

    public void deleteById(Integer id) {
        batchRepository.deleteById(id);
    }

    public List<BatchResponse> findAllByItemTypeNameSortedByDate(String itemTypeName) {
        return batchRepository.findAll().stream()
                .filter(batch -> batch.getItemIditem().getItemname().equals(itemTypeName))
                .sorted((b1, b2) -> b1.getDatearrival().compareTo(b2.getDatearrival()))
                .map(this::mapToResponse)
                .toList();
    }

    public Optional<Integer> findIdByItemTypeName(String itemTypeName) {
        return batchRepository.findAll().stream()
                .filter(batch -> batch.getItemIditem().getItemname().equals(itemTypeName))
                .map(Batch::getIdbatch)
                .findFirst();
    }

    public BigDecimal getTotalPurchasePriceByMonth(int year, int month) {
        validateMonth(month);
        return batchRepository.findAll().stream()
                .filter(batch -> isInYearAndMonth(batch, year, month))
                .map(Batch::getPurchaseprice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private void updateBatchFromRequest(Batch batch, BatchRequest request) {
        batch.setDatearrival(request.getDatearrival());
        batch.setQuantity(request.getQuantity());
        batch.setPurchaseprice(request.getPurchaseprice());
        batch.setUnitpurchaseprice(request.getUnitpurchaseprice());
        batch.setUnitsaleprice(request.getUnitsaleprice());
        batch.setMonthsofwarranty(request.getMonthsofwarranty());
        batch.setItemdescription(request.getItemdescription());
        batch.setWarrantyindays(request.getWarrantyindays());
        batch.setHavewarranty(Boolean.TRUE.equals(request.getHavewarranty()));
    }

    private BatchResponse mapToResponse(Batch batch) {
        BatchResponse response = new BatchResponse();
        response.setId(batch.getIdbatch());
        response.setDatearrival(batch.getDatearrival());
        response.setQuantity(batch.getQuantity());
        response.setPurchaseprice(batch.getPurchaseprice());
        response.setUnitpurchaseprice(batch.getUnitpurchaseprice());
        response.setUnitsaleprice(batch.getUnitsaleprice());
        response.setItemdescription(batch.getItemdescription());
        response.setItemName(batch.getItemIditem().getItemname());
        response.setProviderName(batch.getProviderIdprovider().getName());
        return response;
    }

    private Optional<BatchRequest> validateBatchRequest(BatchRequest request) {
        if (request.getQuantity() < 0) {
            return Optional.empty();
        }
        return Optional.of(request);
    }

    private void validateQuantity(Integer newQuantity, Integer initialQuantity) {
        if (newQuantity < 0) {
            throw new IllegalArgumentException("Quantity cannot be negative");
        }
        if (newQuantity > initialQuantity) {
            throw new IllegalArgumentException("Quantity cannot exceed initial quantity");
        }
    }

    private void validateMonth(int month) {
        if (month < 1 || month > 12) {
            throw new IllegalArgumentException("Month must be between 1 and 12");
        }
    }

    private boolean isInYearAndMonth(Batch batch, int year, int month) {
        var batchDate = batch.getDatearrival().atZone(ZoneId.systemDefault());
        return batchDate.getYear() == year && batchDate.getMonthValue() == month;
    }
}
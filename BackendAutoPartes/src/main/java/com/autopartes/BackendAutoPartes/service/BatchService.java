package com.autopartes.BackendAutoPartes.service;

import com.autopartes.BackendAutoPartes.model.dto.Batch;
import com.autopartes.BackendAutoPartes.model.dto.Itemtype;
import com.autopartes.BackendAutoPartes.model.dto.Provider;
import com.autopartes.BackendAutoPartes.model.dto.request.BatchRequest;
import com.autopartes.BackendAutoPartes.model.dto.response.BatchResponse;
import com.autopartes.BackendAutoPartes.repository.BatchRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
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

    /**
     * Constructor.
     *
     * @param batchRepository The repository for managing Batch entities.
     * @param providerService The service for managing Provider entities.
     * @param itemtypeService The service for managing Itemtype entities.
     */
    public BatchService(BatchRepository batchRepository,
                        ProviderService providerService,
                        ItemtypeService itemtypeService) {
        this.batchRepository = batchRepository;
        this.providerService = providerService;
        this.itemtypeService = itemtypeService;
    }

    /**
     * Finds all batches.
     *
     * @return List containing all batches.
     */
    public List<BatchResponse> findAll() {
        return batchRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    /**
     * Finds a batch by its ID.
     *
     * @param id The ID of the batch to find.
     * @return An Optional containing the found batch, or empty if not found.
     */
    public Optional<BatchResponse> findById(Integer id) {
        return batchRepository.findById(id)
                .map(this::mapToResponse);
    }

    /**
     * Creates a new batch.
     *
     * @param request The batch to create.
     * @return An Optional containing the created batch, or empty if validation fails.
     */
    public Optional<BatchResponse> createBatch(BatchRequest request) {
        return validateBatchRequest(request)
                .flatMap(req -> {
                    Optional<Provider> providerOpt = providerService.findById(req.getProviderId());
                    Optional<Itemtype> itemOpt = itemtypeService.findById(req.getItemId());

                    if (providerOpt.isEmpty() || itemOpt.isEmpty()) {
                        return Optional.empty();
                    }

                    Batch batch = new Batch();
                    batch.setDatearrival(Instant.now());

                    updateBatchFromRequest(batch, req);
                    batch.setInitialquantity(req.getQuantity());
                    batch.setProviderIdprovider(providerOpt.get());
                    batch.setItemIditem(itemOpt.get());

                    return Optional.of(mapToResponse(batchRepository.save(batch)));
                });
    }

    /**
     * Updates an existing batch.
     *
     * @param id The ID of the batch to update.
     * @param request The updated batch data.
     * @return An Optional containing the updated batch, or empty if not found.
     */
    public Optional<BatchResponse> updateBatch(Integer id, BatchRequest request) {
        return batchRepository.findById(id)
                .map(batch -> {
                    validateQuantity(request.getQuantity(), batch.getInitialquantity());
                    updateBatchFromRequest(batch, request);
                    return mapToResponse(batchRepository.save(batch));
                });
    }

    /**
     * Deletes a batch by its ID.
     *
     * @param id The ID of the batch to delete.
     */
    public void deleteById(Integer id) {
        batchRepository.deleteById(id);
    }

    /**
     * Finds all batches by item type name, sorted by date.
     *
     * @param itemTypeName The name of the item type.
     * @return List containing all batches for the specified item type, sorted by date.
     */
    public List<BatchResponse> findAllByItemTypeNameSortedByDate(String itemTypeName) {
        return batchRepository.findAll().stream()
                .filter(batch -> batch.getItemIditem().getItemname().equals(itemTypeName))
                .sorted((b1, b2) -> b1.getDatearrival().compareTo(b2.getDatearrival()))
                .map(this::mapToResponse)
                .toList();
    }

    /**
     * Finds the ID of a batch by item type name.
     *
     * @param itemTypeName The name of the item type.
     * @return An Optional containing the ID of the batch, or empty if not found.
     */
    public Optional<Integer> findIdByItemTypeName(String itemTypeName) {
        return batchRepository.findAll().stream()
                .filter(batch -> batch.getItemIditem().getItemname().equals(itemTypeName))
                .map(Batch::getIdbatch)
                .findFirst();
    }

    /**
     * Calculates the total purchase price of batches for a given month and year.
     *
     * @param year The year to filter by.
     * @param month The month to filter by.
     * @return The total purchase price for the specified month and year.
     */
    public BigDecimal getTotalPurchasePriceByMonth(int year, int month) {
        validateMonth(month);
        return batchRepository.findAll().stream()
                .filter(batch -> isInYearAndMonth(batch, year, month))
                .map(Batch::getPurchaseprice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Finds all batches by provider ID.
     *
     * @param providerId The ID of the provider.
     * @return List containing all batches for the specified provider.
     */
    private void updateBatchFromRequest(Batch batch, BatchRequest request) {
        batch.setQuantity(request.getQuantity());
        batch.setPurchaseprice(request.getPurchaseprice());
        batch.setUnitpurchaseprice(request.getUnitpurchaseprice());
        batch.setUnitsaleprice(request.getUnitsaleprice());
        batch.setMonthsofwarranty(request.getMonthsofwarranty());
        batch.setItemdescription(request.getItemdescription());
        batch.setWarrantyindays(request.getWarrantyindays());
        batch.setHavewarranty(Boolean.TRUE.equals(request.getHavewarranty()));
    }

    /**
     * Maps a Batch entity to a BatchResponse DTO.
     *
     * @param batch The Batch entity to map.
     * @return The mapped BatchResponse DTO.
     */
    private BatchResponse mapToResponse(Batch batch) {
        BatchResponse response = new BatchResponse();
        response.setId(batch.getIdbatch());
        response.setDatearrival(batch.getDatearrival());
        response.setQuantity(batch.getQuantity());
        response.setPurchaseprice(batch.getPurchaseprice());
        response.setUnitpurchaseprice(batch.getUnitpurchaseprice());
        response.setUnitsaleprice(batch.getUnitsaleprice());
        response.setMonthsofwarranty(batch.getMonthsofwarranty());
        response.setItemdescription(batch.getItemdescription());
        response.setItemName(batch.getItemIditem().getItemname());
        response.setProviderName(batch.getProviderIdprovider().getName());
        response.setWarrantyindays(batch.getWarrantyindays());
        response.setHavewarranty(batch.getHavewarranty());
        response.setInitialquantity(batch.getInitialquantity());
        return response;
    }

    /**
     * Validates the batch request.
     *
     * @param request The batch request to validate.
     * @return An Optional containing the validated request, or empty if validation fails.
     */
    private Optional<BatchRequest> validateBatchRequest(BatchRequest request) {
        if (request.getQuantity() < 0) {
            return Optional.empty();
        }
        return Optional.of(request);
    }

    /**
     * Validates the quantity.
     *
     * @param newQuantity The new quantity to validate.
     * @param initialQuantity The initial quantity to compare against.
     */
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

    /**
     * Checks if the batch date is in the specified year and month.
     *
     * @param batch The batch to check.
     * @param year The year to check against.
     * @param month The month to check against.
     * @return True if the batch date is in the specified year and month, false otherwise.
     */
    private boolean isInYearAndMonth(Batch batch, int year, int month) {
        var batchDate = batch.getDatearrival().atZone(ZoneId.systemDefault());
        return batchDate.getYear() == year && batchDate.getMonthValue() == month;
    }

    /**
     * Sells a batch by reducing its quantity.
     *
     * @param id The ID of the batch to sell.
     * @param quantity The quantity to sell.
     * @return An Optional containing the updated batch, or empty if not found.
     */
    public Optional<BatchResponse> sellBatch(Integer id, Integer quantity) {
        return batchRepository.findById(id)
                .map(batch -> {
                    validateQuantity(quantity, batch.getInitialquantity());
                    batch.setInitialquantity(batch.getInitialquantity() - quantity);
                    return mapToResponse(batchRepository.save(batch));
                });
    }
    
}
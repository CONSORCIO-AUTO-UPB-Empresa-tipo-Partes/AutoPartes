package com.autopartes.BackendAutoPartes.service;

import com.autopartes.BackendAutoPartes.model.dto.Batch;
import com.autopartes.BackendAutoPartes.model.dto.Itemtype;
import com.autopartes.BackendAutoPartes.model.dto.Provider;
import com.autopartes.BackendAutoPartes.model.dto.request.BatchRequest;
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

    /**
     * The repository for managing Batch entities.
     */
    private final BatchRepository batchRepository;

    private final ProviderService providerService;
    private final ItemtypeService itemtypeService;


    /**
     * Constructor.
     *
     * @param batchRepository The repository for managing Batch entities.
     */
    public BatchService(BatchRepository batchRepository, ProviderService providerService, ItemtypeService itemtypeService) {
        this.batchRepository = batchRepository;
        this.providerService = providerService;
        this.itemtypeService = itemtypeService;
    }

    /**
     * Finds all batches.
     *
     * @return List containing all batches.
     */
    public List<Batch> findAll() {
        return batchRepository.findAll();
    }

    /**
     * Finds a batch by id.
     *
     * @param id The batch's id.
     * @return Optional containing the found batch or empty if not found.
     */
    public Optional<Batch> findById(Integer id) {
        return batchRepository.findById(id);
    }

    /**
     * Saves a batch.
     *
     * @param batch The batch to save.
     * @return The saved batch.
     */
    public Batch save(Batch batch) {
        return batchRepository.save(batch);
    }

    /**
     * Deletes a batch by id.
     *
     * @param id The batch's id.
     */
    public void deleteById(Integer id) {
        batchRepository.deleteById(id);
    }

    /**
     * Finds all batches by itemtype name and sorts them by arrival date.
     *
     * @param itemTypeName The name of the itemtype to search for.
     * @return List of batches associated with the given itemtype name, sorted by arrival date.
     */
    public List<Batch> findAllByItemTypeNameSortedByDate(String itemTypeName) {
        return batchRepository.findAll().stream()
                .filter(batch -> batch.getItemIditem().getItemname().equals(itemTypeName))
                .sorted((b1, b2) -> b1.getDatearrival().compareTo(b2.getDatearrival()))
                .toList();
    }

    /**
     * Finds batch ID by itemtype name.
     *
     * @param itemTypeName The name of the itemtype to search for.
     * @return Optional containing the batch ID or empty if not found.
     */
    public Optional<Integer> findIdByItemTypeName(String itemTypeName) {
        return batchRepository.findAll().stream()
                .filter(batch -> batch.getItemIditem().getItemname().equals(itemTypeName))
                .map(Batch::getIdbatch)
                .findFirst();
    }

    /**
     * Updates the quantity of a batch.
     *
     * @param id The batch's id.
     * @param newQuantity The new quantity to set.
     * @return Optional containing the updated batch or empty if not found.
     * @throws IllegalArgumentException if newQuantity is negative or greater than initialquantity
     */
    public Optional<Batch> updateQuantityById(Integer id, Integer newQuantity) {
        return batchRepository.findById(id).map(batch -> {
            if (newQuantity < 0) {
                throw new IllegalArgumentException("Quantity cannot be negative");
            }
            if (newQuantity > batch.getInitialquantity()) {
                throw new IllegalArgumentException("Quantity cannot exceed initial quantity");
            }
            batch.setQuantity(newQuantity);
            return batchRepository.save(batch);
        });
    }

    /**
     * Calculates the total purchase price of batches for a specific month and year.
     *
     * @param year The year to filter by.
     * @param month The month to filter by (1-12).
     * @return The total purchase price of all batches in the specified month.
     * @throws IllegalArgumentException if month is not between 1 and 12
     */
    public BigDecimal getTotalPurchasePriceByMonth(int year, int month) {
        if (month < 1 || month > 12) {
            throw new IllegalArgumentException("Month must be between 1 and 12");
        }

        return batchRepository.findAll().stream()
                .filter(batch -> {
                    var batchDate = batch.getDatearrival()
                            .atZone(ZoneId.systemDefault());
                    return batchDate.getYear() == year &&
                            batchDate.getMonthValue() == month;
                })
                .map(Batch::getPurchaseprice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Creates a new batch from a request.
     *
     * @param request The request containing the batch data.
     * @return Optional containing the created batch or empty if provider or itemtype not found.
     */
    public Optional<Batch> createFromRequest(BatchRequest request) {
        Optional<Provider> providerOpt = providerService.findById(request.getProviderId());
        Optional<Itemtype> itemOpt = itemtypeService.findById(request.getItemId());

        if (providerOpt.isEmpty() || itemOpt.isEmpty()) return Optional.empty();

        Batch batch = new Batch();
        batch.setDatearrival(request.getDatearrival());
        batch.setQuantity(request.getQuantity());
        batch.setInitialquantity(request.getQuantity()); // inicial
        batch.setPurchaseprice(request.getPurchaseprice());
        batch.setUnitpurchaseprice(request.getUnitpurchaseprice());
        batch.setUnitsaleprice(request.getUnitsaleprice());
        batch.setMonthsofwarranty(request.getMonthsofwarranty());
        batch.setItemdescription(request.getItemdescription());
        batch.setWarrantyindays(request.getWarrantyindays());
        batch.setHavewarranty(Boolean.TRUE.equals(request.getHavewarranty()));

        batch.setProviderIdprovider(providerOpt.get());
        batch.setItemIditem(itemOpt.get());

        return Optional.of(batchRepository.save(batch));
    }

}

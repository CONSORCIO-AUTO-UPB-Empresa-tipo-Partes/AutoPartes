package com.autopartes.BackendAutoPartes.service;

import com.autopartes.BackendAutoPartes.model.dto.*;
import com.autopartes.BackendAutoPartes.model.dto.request.BillCreateRequest;
import com.autopartes.BackendAutoPartes.model.dto.request.ItemSold;
import com.autopartes.BackendAutoPartes.model.dto.response.BatchResponse;
import com.autopartes.BackendAutoPartes.model.dto.response.BillItemResponse;
import com.autopartes.BackendAutoPartes.model.dto.response.BillResponse;
import com.autopartes.BackendAutoPartes.repository.BatchRepository;
import com.autopartes.BackendAutoPartes.repository.BillRepository;
import com.autopartes.BackendAutoPartes.repository.BillhasbatchRepository;
import jakarta.validation.Valid;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Service for managing Bill entities.
 */
@Service
public class BillService {

    private final BillRepository billRepository;
    private final PersonService personRespository;
    private final BatchService batchService;
    private final BatchRepository batchRepository;
    private final BillhasbatchRepository billhasbatchRepository;

    /**
     * Constructor.
     *
     * @param billRepository The repository for managing Bill entities.
     * @param personRespository The service for managing Person entities.
     * @param batchService The service for managing Batch entities.
     * @param batchRepository The repository for managing Batch entities.
     * @param billhasbatchRepository The repository for managing Billhasbatch entities.
     */
    public BillService(BillRepository billRepository,
                       PersonService personRespository,
                       BatchService batchService,
                       BatchRepository batchRepository,
                       BillhasbatchRepository billhasbatchRepository) {
        this.billRepository = billRepository;
        this.personRespository = personRespository;
        this.batchService = batchService;
        this.batchRepository = batchRepository;
        this.billhasbatchRepository = billhasbatchRepository;
    }

    /**
     * Finds all bills.
     *
     * @return List containing all bills.
     */
    public List<BillResponse> findAllBills() {
        return billRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    /**
     * Finds a bill by id.
     *
     * @param id The bill's id.
     * @return Optional containing the found bill or empty if not found.
     */
    public Optional<BillResponse> findBillById(Integer id) {
        return billRepository.findById(id)
                .map(this::mapToResponse);
    }

    /**
     * Saves a bill.
     *
     * @param bill The bill to save.
     * @return The saved bill.
     */
    public Bill save(Bill bill) {
        return billRepository.save(bill);
    }

    /**
     * Deletes a bill by id.
     *
     * @param id The bill's id.
     */
    public void deleteById(Integer id) {
        billRepository.deleteById(id);
    }


    /**
     * Finds the total price of all bills for a given month.
     *
     * @param year The year.
     * @param month The month.
     * @return The total price of all bills for the given month.
     */
    public BigDecimal getTotalPriceByMonthWithOutTax(int year, int month) {
        if (month < 1 || month > 12) {
            throw new IllegalArgumentException("Month must be between 1 and 12");
        }

        return billRepository.findAll().stream()
                .filter(bill -> {
                    var billDate = bill.getBilldate()
                            .atZone(ZoneId.systemDefault());
                    return billDate.getYear() == year &&
                            billDate.getMonthValue() == month;
                })
                .map(Bill::getTotalpricewithouttax)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Creates a bill.
     *
     * @param request The bill creation request.
     * @return The created bill or empty if the customer is not found.
     */
    @Transactional
    public Optional<BillResponse> createBill(@Valid BillCreateRequest request) {
        Optional<Person> personOpt = personRespository.findById(request.getCustomerDocument());
        if (personOpt.isEmpty()) return Optional.empty();

        Bill bill = new Bill();
        bill.setPersonIddocument(personOpt.get());
        bill.setBilldate(request.getDate() != null
                ? request.getDate().atZone(ZoneId.systemDefault()).toInstant()
                : java.time.Instant.now());

        BigDecimal totalPrice = BigDecimal.ZERO;
        List<Billhasbatch> billItems = new ArrayList<>();

        for (ItemSold itemRequest : request.getItems()) {
            Optional<BatchResponse> batchOpt = batchService.findById(itemRequest.getBatchId());
            if (batchOpt.isEmpty()) return Optional.empty();

            BatchResponse batchResponse = batchOpt.get();
            Optional<Batch> batchEntityOpt = batchRepository.findById(batchResponse.getId());
            if (batchEntityOpt.isEmpty()) return Optional.empty();
            Batch batch = batchEntityOpt.get();

            if (batch.getQuantity() < itemRequest.getQuantity()) {
                return Optional.empty();
            }

            Billhasbatch billItem = new Billhasbatch();
            billItem.setId(new BillhasbatchId());
            billItem.setBatchIdbatch(batch);
            billItem.setAmountsold(itemRequest.getQuantity());

            BigDecimal itemTotal = batch.getUnitsaleprice()
                    .multiply(BigDecimal.valueOf(itemRequest.getQuantity()));

            totalPrice = totalPrice.add(itemTotal);
            billItems.add(billItem);

            batch.setQuantity(batch.getQuantity() - itemRequest.getQuantity());
            batchRepository.save(batch);
        }

        bill.setTotalprice(totalPrice);

        BigDecimal tax = totalPrice.multiply(new BigDecimal("0.19"));
        BigDecimal priceWithoutTax = totalPrice.subtract(tax);

        bill.setTax(tax);
        bill.setTotalpricewithouttax(priceWithoutTax);

        if (request.isHasDiscount()) {
            bill.setHavediscount(true);
            bill.setDiscountrate(request.getDiscountRate());

            BigDecimal discountAmount = totalPrice.multiply(
                    request.getDiscountRate().divide(new BigDecimal("100")));
            bill.setTotalprice(totalPrice.subtract(discountAmount));
        } else {
            bill.setHavediscount(false);
        }

        Bill savedBill = billRepository.save(bill);

        for (Billhasbatch item : billItems) {
            item.setBillIdbill(savedBill);
            item.getId().setBillIdbill(savedBill.getId());
            item.getId().setBatchIdbatch(item.getBatchIdbatch().getIdbatch());
            billhasbatchRepository.save(item);
        }

        return Optional.of(mapToResponse(savedBill));
    }

    /**
     * Maps a bill to a response.
     *
     * @param bill The bill to map.
     * @return The mapped response.
     */
    public BillResponse mapToResponse(Bill bill) {
        BillResponse response = new BillResponse();
        response.setId(bill.getId());
        response.setBillDate(bill.getBilldate());
        response.setTotalPrice(bill.getTotalprice());
        response.setTax(bill.getTax());
        response.setTotalPriceWithoutTax(bill.getTotalpricewithouttax());
        response.setHasDiscount(bill.getHavediscount());
        response.setDiscountRate(bill.getDiscountrate());
        response.setCustomerDocument(bill.getPersonIddocument().getIddocument());
        response.setCustomerName(bill.getPersonIddocument().getPersonname());

        // Get items associated with this bill
        List<Billhasbatch> billItems = billhasbatchRepository.findByBillIdbillId(bill.getId());
        List<BillItemResponse> itemResponses = billItems.stream()
                .map(item -> {
                    BillItemResponse itemResponse = new BillItemResponse();
                    Batch batch = item.getBatchIdbatch();
                    itemResponse.setBatchId(batch.getIdbatch());
                    itemResponse.setItemName(batch.getItemIditem().getItemname());
                    itemResponse.setItemDescription(batch.getItemdescription());
                    itemResponse.setQuantitySold(item.getAmountsold());
                    itemResponse.setUnitPrice(batch.getUnitsaleprice());
                    itemResponse.setTotalPrice(batch.getUnitsaleprice()
                            .multiply(BigDecimal.valueOf(item.getAmountsold())));
                    return itemResponse;
                })
                .toList();

        response.setItems(itemResponses);
        return response;
    }

    /**
     * Finds bills by customer document.
     *
     * @param customerDocument The customer's document.
     * @return List containing the found bills.
     */
    public List<BillResponse> findBillsByCustomerDocument(String customerDocument) {
        System.out.println("🔎 Buscando facturas para documento: " + customerDocument);
        List<Bill> bills = billRepository.findByPersonIddocument_Iddocument(customerDocument);
        System.out.println("📄 Facturas encontradas: " + bills.size());
        return bills.stream().map(this::mapToResponse).toList();
    }

}
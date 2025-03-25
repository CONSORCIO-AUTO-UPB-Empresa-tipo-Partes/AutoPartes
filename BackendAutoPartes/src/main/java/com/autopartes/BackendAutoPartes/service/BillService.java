package com.autopartes.BackendAutoPartes.service;

import com.autopartes.BackendAutoPartes.model.dto.Bill;
import com.autopartes.BackendAutoPartes.model.dto.Person;
import com.autopartes.BackendAutoPartes.model.dto.request.BillCreateRequest;
import com.autopartes.BackendAutoPartes.repository.BillRepository;
import jakarta.validation.Valid;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

/**
 * Service for managing Bill entities.
 */
@Service
public class BillService {

    /**
     * The repository for managing Bill entities.
     */
    private final BillRepository billRepository;

    private final PersonService personRespository;

    /**
     * Constructor.
     *
     * @param billRepository The repository for managing Bill entities.
     */
    public BillService(BillRepository billRepository, PersonService personRespository) {
        this.billRepository = billRepository;
        this.personRespository = personRespository;
    }

    /**
     * Finds all bills.
     *
     * @return List containing all bills.
     */
    public List<Bill> findAll() {
        return billRepository.findAll();
    }

    /**
     * Finds a bill by id.
     *
     * @param id The bill's id.
     * @return Optional containing the found bill or empty if not found.
     */
    public Optional<Bill> findById(Integer id) {
        return billRepository.findById(id);
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
     * Finds bills by customer document, sorted by date in descending order.
     *
     * @param document The customer's document number.
     * @return List of bills associated with the given customer document, sorted by date.
     */
    public List<Bill> findBillsByCustomerDocument(String document) {
        return billRepository.findAll().stream()
                .filter(bill -> bill.getPersonIddocument().getIddocument().equals(document))
                .sorted((b1, b2) -> b2.getBilldate().compareTo(b1.getBilldate()))
                .toList();
    }

    /**
     * Calculates the total sum of bills for a specific month and year without tax.
     *
     * @param year The year to filter by.
     * @param month The month to filter by (1-12).
     * @return The total sum of all bills in the specified month.
     * @throws IllegalArgumentException if month is not between 1 and 12
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
     * Creates a new bill.
     *
     * @param request The bill request.
     * @return Optional containing the created bill or empty if the customer was not found.
     */
    public Optional<Bill> createBill(@Valid BillCreateRequest request) {
        Optional<Person> personOpt = personRespository.findById(request.getCustomerDocument());
        if (personOpt.isEmpty()) return Optional.empty();

        Bill bill = new Bill();
        bill.setPersonIddocument(personOpt.get());
        bill.setTotalprice(request.getTotalPrice());

        // Lógica para calcular impuestos (ejemplo)
        BigDecimal tax = request.getTotalPrice().multiply(new BigDecimal("0.19"));
        BigDecimal priceWithoutTax = request.getTotalPrice().subtract(tax);

        bill.setTax(tax);
        bill.setTotalpricewithouttax(priceWithoutTax);
        bill.setBilldate(request.getDate().atZone(ZoneId.systemDefault()).toInstant());

        return Optional.of(billRepository.save(bill));
    }
}
package com.autopartes.BackendAutoPartes.controller;

import com.autopartes.BackendAutoPartes.model.dto.Bill;
import com.autopartes.BackendAutoPartes.model.dto.request.BillCreateRequest;
import com.autopartes.BackendAutoPartes.model.dto.response.BillResponse;
import com.autopartes.BackendAutoPartes.service.BillService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Controller for managing Bill entities.
 */
@RestController
@RequestMapping("/api/bills")
public class BillController {
    private final BillService billService;

    /**
     * Constructor.
     *
     * @param billService The service for managing Bill entities.
     */
    public BillController(BillService billService) {
        this.billService = billService;
    }

    /**
     * Gets all bills.
     *
     * @return List containing all bills.
     */
    @GetMapping("/bills")
    public ResponseEntity<List<BillResponse>> getAllBills() {
        return ResponseEntity.ok(billService.findAllBills());
    }

    /**
     * Gets a bill by its ID.
     *
     * @param id The ID of the bill.
     * @return The bill with the specified ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<BillResponse> getBillById(@PathVariable Integer id) {
        return billService.findBillById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Creates a new bill.
     *
     * @param request The request containing the bill data.
     * @return The created bill.
     */
    @PostMapping
    public ResponseEntity<?> createBill(@Valid @RequestBody BillCreateRequest request) {
        return billService.createBill(request)
                .map(saved -> ResponseEntity.status(201).body("Factura creada"))
                .orElse(ResponseEntity.badRequest().body("Cliente no encontrado"));
    }

    /**
     * Deletes a bill by its ID.
     *
     * @param id The ID of the bill to delete.
     * @return Response entity indicating the result of the operation.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBill(@PathVariable Integer id) {
        billService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Gets all bills by customer document.
     *
     * @param document The document of the customer.
     * @return List containing all bills for the specified customer.
     */
    @GetMapping("/customer/{document}")
    public ResponseEntity<List<BillResponse>> getBillsByCustomerDocument(@PathVariable String document) {
        List<BillResponse> bills = billService.findBillsByCustomerDocument(document);
        return ResponseEntity.ok(bills != null ? bills : List.of());
    }

    /**
     * Gets the total price of all bills for a specific month and year.
     *
     * @param year The year.
     * @param month The month.
     * @return The total price of all bills for the specified month and year.
     */
    @GetMapping("/total/{year}/{month}")
    public ResponseEntity<BigDecimal> getTotalPriceByMonth(
            @PathVariable int year,
            @PathVariable int month) {
        return ResponseEntity.ok(billService.getTotalPriceByMonthWithOutTax(year, month));
    }

}
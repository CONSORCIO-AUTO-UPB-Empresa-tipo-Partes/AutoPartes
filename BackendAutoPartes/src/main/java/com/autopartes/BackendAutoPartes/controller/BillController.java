package com.autopartes.BackendAutoPartes.controller;

import com.autopartes.BackendAutoPartes.model.dto.Bill;
import com.autopartes.BackendAutoPartes.model.dto.request.BillCreateRequest;
import com.autopartes.BackendAutoPartes.service.BillService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/bills")
public class BillController {
    private final BillService billService;

    public BillController(BillService billService) {
        this.billService = billService;
    }

    @GetMapping
    public ResponseEntity<List<Bill>> getAllBills() {
        return ResponseEntity.ok(billService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Bill> getBillById(@PathVariable Integer id) {
        return billService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/bill")
    public ResponseEntity<?> createBill(@Valid @RequestBody BillCreateRequest request) {
        return billService.createBill(request)
                .map(saved -> ResponseEntity.status(201).body("Factura creada"))
                .orElse(ResponseEntity.badRequest().body("Cliente no encontrado"));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBill(@PathVariable Integer id) {
        billService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/customer/{document}")
    public ResponseEntity<List<Bill>> getBillsByCustomerDocument(@PathVariable String document) {
        return ResponseEntity.ok(billService.findBillsByCustomerDocument(document));
    }

    @GetMapping("/total/{year}/{month}")
    public ResponseEntity<BigDecimal> getTotalPriceByMonth(
            @PathVariable int year,
            @PathVariable int month) {
        return ResponseEntity.ok(billService.getTotalPriceByMonthWithOutTax(year, month));
    }
}
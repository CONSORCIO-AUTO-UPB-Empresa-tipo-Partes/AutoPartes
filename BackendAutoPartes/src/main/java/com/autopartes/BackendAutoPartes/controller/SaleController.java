package com.autopartes.BackendAutoPartes.controller;

import com.autopartes.BackendAutoPartes.dto.SaleItem;
import com.autopartes.BackendAutoPartes.dto.SaleRequest;
import com.autopartes.BackendAutoPartes.model.Bill;
import com.autopartes.BackendAutoPartes.service.SaleService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/sales")
@AllArgsConstructor
public class SaleController {
    private final SaleService saleService;
    @PostMapping("/create")
    public ResponseEntity<Bill> createBill(@RequestBody SaleRequest saleRequest) {
        List<Long> batchIds = saleRequest.getItems().stream()
                .map(SaleItem::getBatchId)
                .collect(Collectors.toList());

        List<Integer> quantities = saleRequest.getItems().stream()
                .map(SaleItem::getQuantity)
                .collect(Collectors.toList());

        Long personId = saleRequest.getBuyer().getId(); // Extraer el ID de la persona

        Bill bill = saleService.createBill(personId, batchIds, quantities);
        return ResponseEntity.ok(bill);
    }
}

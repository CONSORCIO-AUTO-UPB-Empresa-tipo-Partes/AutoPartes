package com.autopartes.BackendAutoPartes.controller;

import com.autopartes.BackendAutoPartes.model.dto.request.BatchRequest;
import com.autopartes.BackendAutoPartes.model.dto.response.BatchResponse;
import com.autopartes.BackendAutoPartes.service.BatchService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/batches")
public class BatchController {
    private final BatchService batchService;

    public BatchController(BatchService batchService) {
        this.batchService = batchService;
    }

    @GetMapping
    public ResponseEntity<List<BatchResponse>> getAllBatches() {
        return ResponseEntity.ok(batchService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BatchResponse> getBatchById(@PathVariable Integer id) {
        return batchService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<BatchResponse> createBatch(@Valid @RequestBody BatchRequest request) {
        return batchService.createBatch(request)
                .map(batch -> ResponseEntity.status(201).body(batch))
                .orElse(ResponseEntity.badRequest().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<BatchResponse> updateBatch(
            @PathVariable Integer id,
            @Valid @RequestBody BatchRequest request) {
        return batchService.updateBatch(id, request)
                .map(batch -> ResponseEntity.ok(batch))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBatch(@PathVariable Integer id) {
        batchService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/itemtype/{name}")
    public ResponseEntity<List<BatchResponse>> getBatchesByItemTypeName(@PathVariable String name) {
        return ResponseEntity.ok(batchService.findAllByItemTypeNameSortedByDate(name));
    }

    @GetMapping("/total/{year}/{month}")
    public ResponseEntity<BigDecimal> getTotalPurchasePriceByMonth(
            @PathVariable int year,
            @PathVariable int month) {
        return ResponseEntity.ok(batchService.getTotalPurchasePriceByMonth(year, month));
    }
}
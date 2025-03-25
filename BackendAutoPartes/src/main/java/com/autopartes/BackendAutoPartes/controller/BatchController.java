package com.autopartes.BackendAutoPartes.controller;

import com.autopartes.BackendAutoPartes.model.dto.Batch;
import com.autopartes.BackendAutoPartes.model.dto.request.BatchRequest;
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

    @GetMapping("/allbatches")
    public ResponseEntity<List<Batch>> getAllBatches() {
        return ResponseEntity.ok(batchService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Batch> getBatchById(@PathVariable Integer id) {
        return batchService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/batch")
    public ResponseEntity<Batch> createBatch(@Valid @RequestBody BatchRequest request) {
        return batchService.createFromRequest(request)
                .map(batch -> ResponseEntity.status(201).body(batch))
                .orElse(ResponseEntity.badRequest().build());
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBatch(@PathVariable Integer id) {
        batchService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/itemtype/{name}")
    public ResponseEntity<List<Batch>> getBatchesByItemTypeName(@PathVariable String name) {
        return ResponseEntity.ok(batchService.findAllByItemTypeNameSortedByDate(name));
    }

    @PutMapping("/{id}/quantity/{quantity}")
    public ResponseEntity<Batch> updateQuantity(@PathVariable Integer id, @PathVariable Integer quantity) {
        return batchService.updateQuantityById(id, quantity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/total/{year}/{month}")
    public ResponseEntity<BigDecimal> getTotalPurchasePriceByMonth(
            @PathVariable int year,
            @PathVariable int month) {
        return ResponseEntity.ok(batchService.getTotalPurchasePriceByMonth(year, month));
    }
}
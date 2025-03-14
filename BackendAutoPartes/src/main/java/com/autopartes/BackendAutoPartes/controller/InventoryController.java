package com.autopartes.BackendAutoPartes.controller;

import com.autopartes.BackendAutoPartes.model.InventoryMovement;
import com.autopartes.BackendAutoPartes.model.MovementType;
import com.autopartes.BackendAutoPartes.service.InventoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {
    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @PostMapping("/movement")
    public ResponseEntity<InventoryMovement> registerMovement(@RequestParam Long lotId,
                                                              @RequestParam MovementType movementType,
                                                              @RequestParam int quantity,
                                                              @RequestParam(required = false) Long destinationLotId) {
        return ResponseEntity.ok(inventoryService.registerMovement(lotId, movementType, quantity, destinationLotId));
    }
}

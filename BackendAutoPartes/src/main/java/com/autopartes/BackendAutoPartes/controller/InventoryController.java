package com.autopartes.BackendAutoPartes.controller;

import com.autopartes.BackendAutoPartes.model.InventoryMovement;
import com.autopartes.BackendAutoPartes.model.MovementType;
import com.autopartes.BackendAutoPartes.service.InventoryService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/inventory")
@AllArgsConstructor
public class InventoryController {
    private final InventoryService inventoryService;

    @PostMapping("/movement")
    public ResponseEntity<InventoryMovement> registerMovement(@RequestParam Long lotId,
                                                              @RequestParam MovementType movementType,
                                                              @RequestParam int quantity,
                                                              @RequestParam(required = false) Long destinationLotId) {
        return ResponseEntity.ok(inventoryService.registerMovement(lotId, movementType, quantity, destinationLotId));
    }
}

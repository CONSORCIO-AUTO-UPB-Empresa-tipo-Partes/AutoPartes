package com.autopartes.BackendAutoPartes.service;

import com.autopartes.BackendAutoPartes.model.Batch;
import com.autopartes.BackendAutoPartes.model.InventoryMovement;
import com.autopartes.BackendAutoPartes.model.MovementType;
import com.autopartes.BackendAutoPartes.repository.BatchRepository;
import com.autopartes.BackendAutoPartes.repository.InventoryMovementRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InventoryService {
    private final InventoryMovementRepository inventoryMovementRepository;
    private final BatchRepository batchRepository;
    private volatile double lowStockThreshold = 0.15; // umbral de Stock bajo 15% por defecto


    public InventoryService(InventoryMovementRepository inventoryMovementRepository, BatchRepository batchRepository) {
        this.inventoryMovementRepository = inventoryMovementRepository;
        this.batchRepository = batchRepository;
    }

    public InventoryMovement registerMovement(Long lotId, MovementType movementType, int quantity, Long destinationLotId) {
        Batch batch = batchRepository.findById(lotId)
                .orElseThrow(() -> new RuntimeException("Lot not found"));

        if (movementType == MovementType.SALIDA) {
            // ❗ Validar que haya stock suficiente antes de una salida
            if (batch.getQuantity() < quantity) {
                throw new RuntimeException("Insufficient stock for this operation");
            }
            batch.setQuantity(batch.getQuantity() - quantity);
        } else if (movementType == MovementType.INGRESO) {
            batch.setQuantity(batch.getQuantity() + quantity);
        } else if (movementType == MovementType.TRASLADO) {
            // ❗ Validar stock antes de trasladar
            if (batch.getQuantity() < quantity) {
                throw new RuntimeException("Insufficient stock for transfer");
            }

            Batch destinationBatch = batchRepository.findById(destinationLotId)
                    .orElseThrow(() -> new RuntimeException("Destination lot not found"));

            batch.setQuantity(batch.getQuantity() - quantity);
            destinationBatch.setQuantity(destinationBatch.getQuantity() + quantity);
            batchRepository.save(destinationBatch);
        }

        batchRepository.save(batch);

        InventoryMovement movement = new InventoryMovement();
        movement.setBatch(batch);
        movement.setMovementType(movementType);
        movement.setQuantity(quantity);
        movement.setMovementDate(LocalDate.now());

        if (movementType == MovementType.TRASLADO) {
            movement.setDestinationBatch(batchRepository.findById(destinationLotId).orElse(null));
        }

        return inventoryMovementRepository.save(movement);
    }

    /*
    setLowStockThreshold: este metodo permite cambiar el umbral del Stock bajo
     inicialmente se definio como el 15% del stock, sin embargo si en algun momento la orgizacion
     desea bajarlo o subirlo con este metodo set lo puede hacer */
    public void setLowStockThreshold(double newThreshold) {
        //se debe ingresar en forma decimal entre cero y uno claramente para no poner un umbral erroneo
        // en caso contrario se captura el error
        if (newThreshold < 0 || newThreshold > 1) {
            throw new IllegalArgumentException("El umbral debe estar entre 0 y 1");
        }
        this.lowStockThreshold = newThreshold;
    }

    /**
     * Obtiene los lotes con stock bajo.
     * Se considera stock bajo si la cantidad actual es menor al 15% de la cantidad inicial del lote.
     */
    public List<Batch> getLowStockLots() {
        return batchRepository.findAll().stream()
                .filter(lot -> lot.getQuantity() < (lot.getInitialQuantity() * lowStockThreshold))
                .collect(Collectors.toList());
    }
}
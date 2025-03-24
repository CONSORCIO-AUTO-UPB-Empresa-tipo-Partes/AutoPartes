package com.autopartes.BackendAutoPartes.service;

import com.autopartes.BackendAutoPartes.model.Batch;
import com.autopartes.BackendAutoPartes.model.ItemType;
import com.autopartes.BackendAutoPartes.model.Supplier;
import com.autopartes.BackendAutoPartes.repository.BatchRepository;
import com.autopartes.BackendAutoPartes.repository.ItemTypeRepository;
import com.autopartes.BackendAutoPartes.repository.SupplierRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.UUID;

/**
 * Service for handling business logic related to Lots.
 */
@Service
public class BatchService {
    private final BatchRepository batchRepository;
    private final SupplierRepository supplierRepository;
    private final ItemTypeRepository itemTypeRepository;

    public BatchService(BatchRepository batchRepository, SupplierRepository supplierRepository, ItemTypeRepository itemTypeRepository) {
        this.batchRepository = batchRepository;
        this.supplierRepository = supplierRepository;
        this.itemTypeRepository = itemTypeRepository;
    }

    /**
     * Creates a new batch with automatic sale price calculation.
     */
    public Batch createLot(Long supplierId, Long itemId, int quantity, double purchasePrice,
                           String warranty, String description, double trm) {
        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        ItemType itemType = itemTypeRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        // Validar si el proveedor vende este producto
        if (!supplier.getItemTypes().contains(itemType)) {
            throw new RuntimeException("Supplier does not sell this item");
        }

        Batch batch = new Batch();
        batch.setLotCode(UUID.randomUUID().toString());
        batch.setDate(LocalDate.now());
        batch.setSupplier(supplier);
        batch.setQuantity(quantity);
        batch.setItemType(itemType);
        batch.setPurchasePrice(purchasePrice); // 🔹 Se calcula el salePrice automáticamente.
        batch.setWarranty(warranty);
        batch.setDescription(description);
        batch.setTrm(trm);

        return batchRepository.save(batch);
    }//createLot

    /**
     * Calcula el precio final de un lote en pesos colombianos utilizando la TRM (Tasa Representativa del Mercado).
     *
     * @param batchId El ID del lote que se desea calcular.
     * @param confirm Indica si el usuario confirma la operación. Si es `true`, se realiza el cálculo; si es `false`, se devuelve `null`.
     * @return El precio final en pesos colombianos si `confirm` es `true`. Devuelve `null` si `confirm` es `false`.
     * @throws RuntimeException Si el lote con el `batchId` especificado no se encuentra en la base de datos.
     */
    public Double calculateFinalPrice(Long batchId, boolean confirm) {
        return batchRepository.findById(batchId) // Busca el lote en la base de datos
                .map(batch -> confirm ? batch.getPurchasePrice() * batch.getTrm() : null) // Si confirm es true, calcula el precio final
                .orElseThrow(() -> new RuntimeException("Lote no encontrado")); // Lanza una excepción si el lote no existe
    }//calculateFinalPrice

}
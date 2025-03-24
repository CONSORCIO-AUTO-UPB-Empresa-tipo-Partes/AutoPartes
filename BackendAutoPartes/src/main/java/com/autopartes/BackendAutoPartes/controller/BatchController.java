package com.autopartes.BackendAutoPartes.controller;

import com.autopartes.BackendAutoPartes.model.Batch;
import com.autopartes.BackendAutoPartes.service.BatchService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador para gestionar las operaciones relacionadas con los lotes.
 */
@RestController
@RequestMapping("/api/lots")
@AllArgsConstructor //hacerle esto a los constructores
public class BatchController {
    private final BatchService batchService;

    /**
     * Crea un nuevo lote con los datos proporcionados.
     *
     * @param supplierId    ID del proveedor.
     * @param itemId        ID del tipo de producto.
     * @param quantity      Cantidad de productos en el lote.
     * @param purchasePrice Precio de compra por unidad.
     *                      //@param salePrice     Precio de venta por unidad.
     * @param warranty      Información sobre la garantía del producto.
     * @param description   Descripción adicional del lote.
     * @param trm           Tasa Representativa del Mercado (TRM) en el momento de la compra.
     * @return `ResponseEntity` con el lote creado.
     */
    @PostMapping
    public ResponseEntity<Batch> createLot(@RequestParam Long supplierId, @RequestParam Long itemId,
                                           @RequestParam int quantity, @RequestParam double purchasePrice,
                                           @RequestParam String warranty, @RequestParam String description,
                                           @RequestParam double trm) {
        return ResponseEntity.ok(batchService.createLot(supplierId, itemId, quantity, purchasePrice,
                warranty, description, trm));
    }

    /**
     * Calcula el precio final de un lote en pesos colombianos utilizando la TRM.
     *
     * @param id      ID del lote cuyo precio se desea calcular.
     * @param confirm Indica si el usuario confirma la operación (`true` para calcular el precio, `false` para rechazar).
     * @return `ResponseEntity` con el precio final si `confirm` es `true`. Si `confirm` es `false`, devuelve un estado `400 Bad Request`.
     */
    @GetMapping("/{id}/calculate-price")
    public ResponseEntity<Double> calculateFinalPrice(@PathVariable Long id, @RequestParam boolean confirm) {
        Double finalPrice = batchService.calculateFinalPrice(id, confirm); // Llama al servicio para calcular el precio final

        if (finalPrice != null) {
            return ResponseEntity.ok(finalPrice); // Devuelve el precio final con estado 200 OK
        } else {
            return ResponseEntity.badRequest().body(null); // Devuelve un error 400 si confirm es false
        }
    }//calculateFinalPrice
}
package com.autopartes.BackendAutoPartes.controller;

import com.autopartes.BackendAutoPartes.model.ItemType;
import com.autopartes.BackendAutoPartes.service.ItemTypeService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controlador REST para gestionar los tipos de ítems.
 * Proporciona endpoints para buscar, obtener y gestionar los tipos de ítems.
 */
@RestController
@RequestMapping("/api/itemtypes") // Se mantiene esta ruta base ya que es más específica
@AllArgsConstructor
public class ItemTypeController {
    private final ItemTypeService itemTypeService;

    /**
     * Obtiene todos los tipos de ítems disponibles.
     *
     * @return Lista de todos los ItemType.
     */
    @GetMapping
    public ResponseEntity<List<ItemType>> getAllItemTypes() {
        return ResponseEntity.ok(itemTypeService.getAllItemTypes());
    }

    /**
     * Obtiene todos los productos disponibles (alias de getAllItemTypes).
     *
     * @return Lista de todos los productos.
     */
    @GetMapping("/products")
    public ResponseEntity<List<ItemType>> getAllProducts() {
        return ResponseEntity.ok(itemTypeService.getAllItemTypes());
    }

    /**
     * Busca ítems por nombre.
     *
     * @param name Nombre o parte del nombre del ítem a buscar.
     * @return Lista de ítems que coincidan con el criterio de búsqueda.
     */
    @GetMapping("/search/name")
    public ResponseEntity<List<ItemType>> searchByName(@RequestParam String name) {
        return ResponseEntity.ok(itemTypeService.searchByName(name));
    }

    /**
     * Busca ítems por código.
     * @param code Código o parte del código del ítem a buscar.
     * @return Lista de ítems que coincidan con el criterio de búsqueda.
     */
    /*@GetMapping("/search/code")
    public ResponseEntity<List<ItemType>> searchByCode(@RequestParam String code) {
        return ResponseEntity.ok(itemTypeService.searchByCode(code));
    }*/

    /**
     * Busca ítems por categoría.
     * @param category Categoría o parte de la categoría del ítem a buscar.
     * @return Lista de ítems que coincidan con el criterio de búsqueda.
     */
    /*@GetMapping("/search/category")
    public ResponseEntity<List<ItemType>> searchByCategory(@RequestParam String category) {
        return ResponseEntity.ok(itemTypeService.searchByCategory(category));
    }*/
}

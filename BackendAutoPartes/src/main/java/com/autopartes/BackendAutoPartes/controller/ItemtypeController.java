package com.autopartes.BackendAutoPartes.controller;

import com.autopartes.BackendAutoPartes.model.dto.Itemtype;
import com.autopartes.BackendAutoPartes.model.dto.request.ItemtypeRequest;
import com.autopartes.BackendAutoPartes.service.ItemtypeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/itemtypes")
public class ItemtypeController {
    private final ItemtypeService itemtypeService;

    /**
     * Constructor.
     *
     * @param itemtypeService The service for managing Itemtype entities.
     */
    public ItemtypeController(ItemtypeService itemtypeService) {
        this.itemtypeService = itemtypeService;
    }

    /**
     * Finds all itemtypes.
     *
     * @return List containing all itemtypes.
     */
    @GetMapping
    public ResponseEntity<List<Itemtype>> getAllItemTypes() {
        return ResponseEntity.ok(itemtypeService.findAll());
    }

    /**
     * Finds an itemtype by id.
     *
     * @param id The itemtype's id.
     * @return Optional containing the found itemtype or empty if not found.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Itemtype> getItemTypeById(@PathVariable Integer id) {
        return itemtypeService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Finds an itemtype by name.
     *
     * @param name The itemtype's name.
     * @return Optional containing the found itemtype or empty if not found.
     */
    @GetMapping("/name/{name}")
    public ResponseEntity<Itemtype> getItemTypeByName(@PathVariable String name) {
        return itemtypeService.findByName(name)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Saves an itemtype.
     *
     * @param itemtypeRequest The itemtype to save.
     * @return The saved itemtype.
     */
    @PostMapping
    public ResponseEntity<Itemtype> createItemType(@RequestBody ItemtypeRequest itemtypeRequest) {
        return ResponseEntity.ok(itemtypeService.save(itemtypeRequest));
    }

    /**
     * Deletes an itemtype by id.
     *
     * @param id The itemtype's id.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItemType(@PathVariable Integer id) {
        itemtypeService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}
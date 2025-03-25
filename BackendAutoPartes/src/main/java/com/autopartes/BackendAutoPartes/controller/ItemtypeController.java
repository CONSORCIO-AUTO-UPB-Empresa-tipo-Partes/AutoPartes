package com.autopartes.BackendAutoPartes.controller;

import com.autopartes.BackendAutoPartes.model.dto.Itemtype;
import com.autopartes.BackendAutoPartes.service.ItemtypeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/itemtypes")
public class ItemtypeController {
    private final ItemtypeService itemtypeService;

    public ItemtypeController(ItemtypeService itemtypeService) {
        this.itemtypeService = itemtypeService;
    }

    @GetMapping
    public ResponseEntity<List<Itemtype>> getAllItemTypes() {
        return ResponseEntity.ok(itemtypeService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Itemtype> getItemTypeById(@PathVariable Integer id) {
        return itemtypeService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<Itemtype> getItemTypeByName(@PathVariable String name) {
        return itemtypeService.findByName(name)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Itemtype> createItemType(@RequestBody Itemtype itemtype) {
        return ResponseEntity.ok(itemtypeService.save(itemtype));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItemType(@PathVariable Integer id) {
        itemtypeService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
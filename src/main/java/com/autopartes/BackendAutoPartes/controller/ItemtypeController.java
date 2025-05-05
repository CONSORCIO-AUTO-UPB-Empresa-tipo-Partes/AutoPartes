package com.autopartes.BackendAutoPartes.controller;

import com.autopartes.BackendAutoPartes.model.dto.Itemtype;
import com.autopartes.BackendAutoPartes.model.dto.request.ItemtypeRequest;
import com.autopartes.BackendAutoPartes.observer.CatalogChangeEvent;
import com.autopartes.BackendAutoPartes.observer.CatalogObserverService;
import com.autopartes.BackendAutoPartes.service.ItemtypeService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/itemtypes")
public class ItemtypeController {
    private final ItemtypeService itemtypeService;
    private final CatalogObserverService observerService;

    @Value("${app.upload.dir:${user.home}/uploads/images}")
    private String uploadDir;

    public ItemtypeController(ItemtypeService itemtypeService, CatalogObserverService observerService) {
        this.itemtypeService = itemtypeService;
        this.observerService = observerService;
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

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Itemtype> createItemType(
            @RequestParam("itemname") String itemname,
            @RequestParam(value = "image", required = false) MultipartFile image) {

        try {
            ItemtypeRequest itemtypeRequest = new ItemtypeRequest();
            itemtypeRequest.setItemname(itemname);

            String imagePath = null;
            if (image != null && !image.isEmpty()) {
                imagePath = saveImage(image);
                itemtypeRequest.setImagepath(imagePath);
            }

            Itemtype savedItemtype = itemtypeService.save(itemtypeRequest);

            // Notify observers about the change
            observerService.notifyCatalogChanged(
                new CatalogChangeEvent(CatalogChangeEvent.ChangeType.ITEM_TYPE_ADDED, savedItemtype)
            );

            return ResponseEntity.ok(savedItemtype);
        } catch (IOException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Itemtype> updateItemType(
            @PathVariable Integer id,
            @RequestParam("itemname") String itemname,
            @RequestParam(value = "image", required = false) MultipartFile image) {

        return (ResponseEntity<Itemtype>) itemtypeService.findById(id).map(existingItemtype -> {
            try {
                ItemtypeRequest itemtypeRequest = new ItemtypeRequest();
                itemtypeRequest.setItemname(itemname);

                // If a new image is provided, save it and update the path
                if (image != null && !image.isEmpty()) {
                    // Delete old image if exists
                    if (existingItemtype.getImagepath() != null && !existingItemtype.getImagepath().isEmpty()) {
                        deleteImageFile(existingItemtype.getImagepath());
                    }

                    String imagePath = saveImage(image);
                    itemtypeRequest.setImagepath(imagePath);
                } else {
                    // Keep existing image path
                    itemtypeRequest.setImagepath(existingItemtype.getImagepath());
                }

                Itemtype updatedItemtype = itemtypeService.update(id, itemtypeRequest);

                // Notify observers about the change
                observerService.notifyCatalogChanged(
                    new CatalogChangeEvent(CatalogChangeEvent.ChangeType.ITEM_TYPE_UPDATED, updatedItemtype)
                );

                return ResponseEntity.ok(updatedItemtype);
            } catch (IOException e) {
                return ResponseEntity.badRequest().build();
            }
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItemType(@PathVariable Integer id) {
        return itemtypeService.findById(id).map(itemtype -> {
            // Delete associated image file if exists
            if (itemtype.getImagepath() != null && !itemtype.getImagepath().isEmpty()) {
                deleteImageFile(itemtype.getImagepath());
            }

            itemtypeService.deleteById(id);

            // Notify observers about the change
            observerService.notifyCatalogChanged(
                new CatalogChangeEvent(CatalogChangeEvent.ChangeType.ITEM_TYPE_DELETED, itemtype)
            );

            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}/image")
    public ResponseEntity<Itemtype> deleteImage(@PathVariable Integer id) {
        return itemtypeService.findById(id).map(itemtype -> {
            // Delete file if exists
            if (itemtype.getImagepath() != null && !itemtype.getImagepath().isEmpty()) {
                deleteImageFile(itemtype.getImagepath());

                // Update entity to remove image path
                ItemtypeRequest request = new ItemtypeRequest();
                request.setItemname(itemtype.getItemname());
                request.setImagepath(null);

                Itemtype updatedItemtype = itemtypeService.update(id, request);

                // Notify observers about the change
                observerService.notifyCatalogChanged(
                    new CatalogChangeEvent(CatalogChangeEvent.ChangeType.ITEM_TYPE_UPDATED, updatedItemtype)
                );

                return ResponseEntity.ok(updatedItemtype);
            }

            return ResponseEntity.ok(itemtype);
        }).orElse(ResponseEntity.notFound().build());
    }

    private String saveImage(MultipartFile image) throws IOException {
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String filename = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
        Path filePath = uploadPath.resolve(filename);

        Files.copy(image.getInputStream(), filePath);

        // Cambiar el prefijo de la ruta devuelta para que sea consistente con la ubicación real
        return "/uploads/images/" + filename;
    }

    private void deleteImageFile(String imagePath) {
        if (imagePath != null && !imagePath.isEmpty() && imagePath.startsWith("/images/")) {
            try {
                String filename = imagePath.substring("/images/".length());
                Path filePath = Paths.get(uploadDir).resolve(filename);
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                // Log error but continue
                System.err.println("Error deleting image file: " + e.getMessage());
            }
        }
    }
}
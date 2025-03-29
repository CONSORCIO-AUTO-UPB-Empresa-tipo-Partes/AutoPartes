package com.autopartes.BackendAutoPartes.controller;

 import com.autopartes.BackendAutoPartes.model.dto.Itemtype;
 import com.autopartes.BackendAutoPartes.model.dto.response.BatchResponse;
 import com.autopartes.BackendAutoPartes.model.dto.response.ItemtypeWithBatchesResponse;
 import com.autopartes.BackendAutoPartes.observer.CatalogUpdateObserver;
 import com.autopartes.BackendAutoPartes.service.ItemtypeService;
 import org.springframework.http.ResponseEntity;
 import org.springframework.web.bind.annotation.GetMapping;
 import org.springframework.web.bind.annotation.RequestMapping;
 import org.springframework.web.bind.annotation.RestController;

 import java.util.ArrayList;
 import java.util.List;
 import java.util.Map;
 import java.util.stream.Collectors;

 /**
  * Controller for the catalog.
  */
 @RestController
 @RequestMapping("/api/catalog")
 public class CatalogController {
     private final CatalogUpdateObserver catalogObserver;
     private final ItemtypeService itemtypeService;

     /**
      * Constructor.
      *
      * @param catalogObserver The observer for the catalog.
      * @param itemtypeService The service for item types.
      */
     public CatalogController(CatalogUpdateObserver catalogObserver, ItemtypeService itemtypeService) {
         this.catalogObserver = catalogObserver;
         this.itemtypeService = itemtypeService;
     }

     /**
      * Gets the current catalog.
      *
      * @return The current catalog.
      */
     @GetMapping
     public ResponseEntity<List<BatchResponse>> getCurrentCatalog() {
         return ResponseEntity.ok(catalogObserver.getCurrentCatalog());
     }

     /**
      * Gets all item types with their respective batches.
      *
      * @return A list of item types with their associated batches.
      */
     @GetMapping("/itemtypes-with-batches")
     public ResponseEntity<List<ItemtypeWithBatchesResponse>> getItemTypesWithBatches() {
         // Get all item types
         List<Itemtype> itemTypes = itemtypeService.findAll();

         // Get all batches in the catalog
         List<BatchResponse> allBatches = catalogObserver.getCurrentCatalog();

         // Group batches by item type name
         Map<String, List<BatchResponse>> batchesByItemTypeName = allBatches.stream()
                 .collect(Collectors.groupingBy(BatchResponse::getItemName));

         // Create response objects
         List<ItemtypeWithBatchesResponse> response = itemTypes.stream()
                 .map(itemType -> {
                     List<BatchResponse> batches = batchesByItemTypeName.getOrDefault(itemType.getItemname(), new ArrayList<>());
                     return new ItemtypeWithBatchesResponse(itemType, batches);
                 })
                 .collect(Collectors.toList());

         return ResponseEntity.ok(response);
     }
 }
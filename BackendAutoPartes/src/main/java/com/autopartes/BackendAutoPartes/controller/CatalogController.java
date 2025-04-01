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

         @RestController
         @RequestMapping("/api/catalog")
         public class CatalogController {
             private final CatalogUpdateObserver catalogObserver;
             private final ItemtypeService itemtypeService;

             public CatalogController(CatalogUpdateObserver catalogObserver, ItemtypeService itemtypeService) {
                 this.catalogObserver = catalogObserver;
                 this.itemtypeService = itemtypeService;
             }

             @GetMapping
             public ResponseEntity<List<BatchResponse>> getCurrentCatalog() {
                 return ResponseEntity.ok(catalogObserver.getCurrentCatalog());
             }

             @GetMapping("/itemtypes-with-batches")
             public ResponseEntity<List<ItemtypeWithBatchesResponse>> getItemTypesWithBatches() {
                 List<Itemtype> itemTypes = itemtypeService.findAll();
                 List<BatchResponse> allBatches = catalogObserver.getCurrentCatalog();
                 Map<String, List<BatchResponse>> batchesByItemTypeName = allBatches.stream()
                         .collect(Collectors.groupingBy(BatchResponse::getItemName));

                 List<ItemtypeWithBatchesResponse> response = itemTypes.stream()
                         .map(itemType -> {
                             List<BatchResponse> batches = batchesByItemTypeName.getOrDefault(itemType.getItemname(), new ArrayList<>());
                             return new ItemtypeWithBatchesResponse(itemType, batches);
                         })
                         .collect(Collectors.toList());

                 return ResponseEntity.ok(response);
             }
         }
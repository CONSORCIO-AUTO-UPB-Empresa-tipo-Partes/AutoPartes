//package com.autopartes.BackendAutoPartes.service;
//
//import com.autopartes.BackendAutoPartes.model.MovementType;
//import com.autopartes.BackendAutoPartes.repository.BatchRepository;
//import com.autopartes.BackendAutoPartes.repository.InventoryMovementRepository;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.MockitoAnnotations;
//
//import java.util.Optional;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.Mockito.*;
//
//class InventoryServiceTest {
//
//    @Mock
//    private InventoryMovementRepository inventoryMovementRepository;
//
//    @Mock
//    private BatchRepository batchRepository;
//
//    @InjectMocks
//    private InventoryService inventoryService;
//
//    @BeforeEach
//    void setUp() {
//        MockitoAnnotations.openMocks(this);
//    }
//
//    @Test
//    void testRegisterMovement_Success() {
//        // Simular un lote con suficiente stock
//        Batch batch = new Batch();
//        batch.setId(1L);
//        batch.setQuantity(10);
//
//        when(batchRepository.findById(1L)).thenReturn(Optional.of(batch));
//        when(batchRepository.save(any(Batch.class))).thenAnswer(invocation -> invocation.getArgument(0));
//        when(inventoryMovementRepository.save(any(InventoryMovement.class))).thenAnswer(invocation -> invocation.getArgument(0));
//
//        // Ejecutar el método de prueba
//        InventoryMovement movement = inventoryService.registerMovement(1L, MovementType.SALIDA, 5, null);
//
//        // Validaciones
//        assertNotNull(movement, "El objeto movement no debería ser nulo");
//        assertEquals(5, movement.getQuantity());
//        verify(batchRepository, times(1)).save(batch);
//        verify(inventoryMovementRepository, times(1)).save(any(InventoryMovement.class));
//    }
//
//    @Test
//    void testRegisterMovement_InsufficientStock() {
//        // Simular un lote con stock insuficiente
//        Batch batch = new Batch();
//        batch.setId(1L);
//        batch.setQuantity(3);
//
//        when(batchRepository.findById(1L)).thenReturn(Optional.of(batch));
//
//        // Verificar que lanza una excepción si el stock es insuficiente
//        Exception exception = assertThrows(RuntimeException.class, () -> {
//            inventoryService.registerMovement(1L, MovementType.SALIDA, 5, null);
//        });
//
//        assertEquals("Insufficient stock for this operation", exception.getMessage());
//    }
//
//    @Test
//    void testRegisterMovement_WithDestinationLot_Success() {
//        // Simular lotes de origen y destino
//        Batch sourceBatch = new Batch();
//        sourceBatch.setId(1L);
//        sourceBatch.setQuantity(10);
//
//        Batch destinationBatch = new Batch();
//        destinationBatch.setId(2L);
//        destinationBatch.setQuantity(5);
//
//        when(batchRepository.findById(1L)).thenReturn(Optional.of(sourceBatch));
//        when(batchRepository.findById(2L)).thenReturn(Optional.of(destinationBatch));
//        when(batchRepository.save(any(Batch.class))).thenAnswer(invocation -> invocation.getArgument(0));
//        when(inventoryMovementRepository.save(any(InventoryMovement.class))).thenAnswer(invocation -> invocation.getArgument(0));
//
//        // Ejecutar el método de prueba
//        InventoryMovement movement = inventoryService.registerMovement(1L, MovementType.TRASLADO, 5, 2L);
//
//        // Validaciones
//        assertNotNull(movement, "El objeto movement no debería ser nulo");
//        assertEquals(5, sourceBatch.getQuantity()); // Verificar que se redujo en el lote de origen
//        assertEquals(10, destinationBatch.getQuantity()); // Verificar que se incrementó en el lote de destino
//        verify(batchRepository, times(2)).save(any(Batch.class));
//        verify(inventoryMovementRepository, times(1)).save(any(InventoryMovement.class));
//    }
//}

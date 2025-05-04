//package com.autopartes.BackendAutoPartes.service;
//
//import com.autopartes.BackendAutoPartes.model.dto.Bill;
//import com.autopartes.BackendAutoPartes.model.dto.Person;
//import com.autopartes.BackendAutoPartes.model.dto.SaleItem;
//import com.autopartes.BackendAutoPartes.repository.BatchRepository;
//import com.autopartes.BackendAutoPartes.repository.BillHasBatchRepository;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.MockitoAnnotations;
//
//import java.util.ArrayList;
//import java.util.List;
//import java.util.Optional;
//
//import static org.junit.jupiter.api.Assertions.assertNotNull;
//import static org.mockito.Mockito.*;
//
//class SaleServiceTest {
//
//    @Mock
//    private BillRepository billRepository;
//
//    @Mock
//    private BatchRepository batchRepository;
//
//    @Mock
//    private BillHasBatchRepository billHasBatchRepository;
//
//    @Mock
//    private PersonRepository personRepository;
//
//    @InjectMocks
//    private SaleService saleService;
//
//    @BeforeEach
//    void setUp() {
//        MockitoAnnotations.openMocks(this);
//    }
//
//    @Test
//    void testCreateBill_Success() {
//        // 🔹 Configuración del comprador (Person)
//        Person buyer = new Person();
//        buyer.setId(1L);
//        buyer.setName("Juan Pérez");
//
//        // 🔹 Configuración de lotes disponibles en inventario
//        Batch batch1 = new Batch();
//        batch1.setId(1L);
//        batch1.setQuantity(10);
//        batch1.setSalePrice(100.0); // Precio unitario
//
//        Batch batch2 = new Batch();
//        batch2.setId(2L);
//        batch2.setQuantity(5);
//        batch2.setSalePrice(150.0); // Precio unitario
//
//        // 🔹 Configuración de ítems en la venta
//        SaleItem item1 = new SaleItem();
//        item1.setBatchId(1L);
//        item1.setQuantity(2); // 2 unidades de batch1
//
//        SaleItem item2 = new SaleItem();
//        item2.setBatchId(2L);
//        item2.setQuantity(1); // 1 unidad de batch2
//
//        // 🔹 Simulación de la base de datos con Mockito
//        when(batchRepository.findById(1L)).thenReturn(Optional.of(batch1));
//        when(batchRepository.findById(2L)).thenReturn(Optional.of(batch2));
//        when(personRepository.findById(1L)).thenReturn(Optional.of(buyer));
//
//        Bill mockBill = new Bill();
//        mockBill.setBillHasBatches(new ArrayList<>()); // 🔹 Aseguramos que la lista no sea null
//
//        when(billRepository.save(any())).thenReturn(mockBill);
//
//        // 🔹 Llamamos al método que estamos probando
//        Bill bill = saleService.createBill(buyer.getId(), List.of(1L, 2L), List.of(2, 1));
//
//        // 🔹 Validaciones de la factura generada
//        assertNotNull(bill, "La factura no debe ser nula");
//        assertNotNull(bill.getBillHasBatches(), "La lista de items vendidos no debe ser nula");
//        assertEquals(2, bill.getBillHasBatches().size(), "Debe contener 2 productos vendidos");
//        assertEquals(350.0, bill.getSubtotalWithoutTax(), 0.001, "El subtotal sin impuestos debe ser correcto");
//
//        // 🔹 Verificar que los lotes fueron actualizados correctamente
//        assertEquals(8, batch1.getQuantity(), "Stock de batch1 debe haberse reducido a 8");
//        assertEquals(4, batch2.getQuantity(), "Stock de batch2 debe haberse reducido a 4");
//
//        // 🔹 Verificar que los métodos de repositorio fueron llamados
//        verify(billRepository, times(1)).save(any(Bill.class));
//        verify(batchRepository, times(2)).save(any(Batch.class));
//        verify(billHasBatchRepository, times(1)).saveAll(any());
//    }
//}
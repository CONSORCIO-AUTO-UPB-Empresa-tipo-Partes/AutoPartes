package com.autopartes.BackendAutoPartes.service;

import com.autopartes.BackendAutoPartes.model.Batch;
import com.autopartes.BackendAutoPartes.repository.BatchRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class BatchServiceTest {

    @Mock
    private BatchRepository batchRepository;

    @InjectMocks
    private BatchService batchService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateBatch_CalculatesSalePrice() {
        Batch batch = new Batch();
        batch.setLotCode("LOT2024001");
        batch.setPurchasePrice(120000);
        batch.setQuantity(50);

        when(batchRepository.save(any(Batch.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Batch savedBatch = batchService.createLot(1L, 2L, 50, 120000, "2 años", "Llantas premium", 1.0);

        assertEquals(126000, savedBatch.getSalePrice()); // 120000 + 5%
        verify(batchRepository, times(1)).save(savedBatch);
    }
}

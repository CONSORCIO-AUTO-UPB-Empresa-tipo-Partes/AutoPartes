package com.autopartes.BackendAutoPartes.service;

import com.autopartes.BackendAutoPartes.model.ItemType;
import com.autopartes.BackendAutoPartes.repository.ItemTypeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class ItemTypeServiceTest {

    @Mock
    private ItemTypeRepository itemTypeRepository;

    @InjectMocks
    private ItemTypeService itemTypeService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllProducts() {
        ItemType item1 = new ItemType(1L, "Producto A", null);
        ItemType item2 = new ItemType(2L, "Producto B", null);

        when(itemTypeRepository.findAll()).thenReturn(List.of(item1, item2));

        List<ItemType> products = itemTypeService.getAllProducts();

        assertEquals(2, products.size());
        verify(itemTypeRepository, times(1)).findAll();
    }
}

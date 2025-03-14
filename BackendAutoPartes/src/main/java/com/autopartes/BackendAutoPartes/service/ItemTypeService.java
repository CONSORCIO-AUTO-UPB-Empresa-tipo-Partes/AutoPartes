package com.autopartes.BackendAutoPartes.service;

import com.autopartes.BackendAutoPartes.model.ItemType;
import com.autopartes.BackendAutoPartes.repository.ItemTypeRepository;
import org.springframework.stereotype.Service;
import java.util.List;

/**
 * Servicio para la gestión de ItemType.
 * Proporciona métodos para obtener y buscar diferentes tipos de ítems en la base de datos.
 */
@Service
public class ItemTypeService {
    private final ItemTypeRepository itemTypeRepository;

    public ItemTypeService(ItemTypeRepository itemTypeRepository) {
        this.itemTypeRepository = itemTypeRepository;
    }

    /**
     * Obtiene todos los tipos de ítems disponibles en la base de datos.
     * @return Lista de todos los ItemType.
     */
    public List<ItemType> getAllItemTypes() {
        return itemTypeRepository.findAll();
    }

    /**
     * Busca tipos de ítems por nombre.
     * @param name Nombre o fragmento del nombre del ítem a buscar.
     * @return Lista de ItemType filtrada por nombre.
     */
    public List<ItemType> searchByName(String name) {
        return itemTypeRepository.findByNameContainingIgnoreCase(name);
    }

    /**
     * Busca tipos de ítems por código.
     * @param code Código o fragmento del código del ítem a buscar.
     * @return Lista de ítems que coincidan con el código.
     */
    public List<ItemType> searchByCode(String code) {
        return itemTypeRepository.findByCodeContainingIgnoreCase(code);
    }

    /**
     * Busca tipos de ítems por categoría.
     * @param category Categoría o fragmento del nombre de la categoría a buscar.
     * @return Lista de ítems de la categoría indicada.
     */
    public List<ItemType> searchByCategory(String category) {
        return itemTypeRepository.findByCategoryContainingIgnoreCase(category);
    }
}

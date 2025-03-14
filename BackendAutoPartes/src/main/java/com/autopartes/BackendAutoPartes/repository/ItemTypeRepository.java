package com.autopartes.BackendAutoPartes.repository;

import com.autopartes.BackendAutoPartes.model.ItemType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio para la gestión de entidades ItemType.
 * Proporciona métodos para realizar operaciones CRUD en la base de datos.
 */
@Repository // Indica que esta interfaz es un componente de repositorio en Spring
public interface ItemTypeRepository extends JpaRepository<ItemType, Long> {

    /**
     * Busca los tipos de ítems cuyo nombre contenga el valor especificado (sin distinguir mayúsculas o minúsculas).
     * @param name Nombre o fragmento del nombre del ítem a buscar.
     * @return Lista de ítems que coincidan con el criterio de búsqueda.
     */
    List<ItemType> findByNameContainingIgnoreCase(String name);

    /**
     * Busca los tipos de ítems cuyo código contenga el valor especificado (sin distinguir mayúsculas o minúsculas).
     * @param code Código o fragmento del código del ítem a buscar.
     * @return Lista de ítems que coincidan con el criterio de búsqueda.
     */
    List<ItemType> findByCodeContainingIgnoreCase(String code);

    /**
     * Busca los tipos de ítems cuya categoría contenga el valor especificado (sin distinguir mayúsculas o minúsculas).
     * @param category Categoría o fragmento de la categoría del ítem a buscar.
     * @return Lista de ítems que coincidan con el criterio de búsqueda.
     */
    List<ItemType> findByCategoryContainingIgnoreCase(String category);
}

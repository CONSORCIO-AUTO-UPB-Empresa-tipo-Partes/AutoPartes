package com.autopartes.BackendAutoPartes.service;

import com.autopartes.BackendAutoPartes.model.dto.Itemtype;
import com.autopartes.BackendAutoPartes.repository.ItemtypeRepository;
import com.autopartes.BackendAutoPartes.utils.ReusableServices;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service for managing Itemtype entities.
 */
@Service
public class ItemtypeService {

    /**
     * The repository for managing Itemtype entities.
     */
    private final ItemtypeRepository itemtypeRepository;

    /**
     * Constructor.
     *
     * @param itemtypeRepository The repository for managing Itemtype entities.
     */
    public ItemtypeService(ItemtypeRepository itemtypeRepository) {
        this.itemtypeRepository = itemtypeRepository;
    }

    /**
     * Finds all itemtypes.
     *
     * @return List containing all itemtypes.
     */
    public List<Itemtype> findAll() {
        return itemtypeRepository.findAll();
    }

    /**
     * Finds an itemtype by id.
     *
     * @param id The itemtype's id.
     * @return Optional containing the found itemtype or empty if not found.
     */
    public Optional<Itemtype> findById(Integer id) {
        return itemtypeRepository.findById(id);
    }

    /**
     * Saves an itemtype.
     *
     * @param item The itemtype to save.
     * @return The saved itemtype.
     */
    public Itemtype save(Itemtype item) {
        return itemtypeRepository.save(item);
    }

    /**
     * Deletes an itemtype by id.
     *
     * @param id The itemtype's id.
     */
    public void deleteById(Integer id) {
        itemtypeRepository.deleteById(id);
    }

    /**
     * Finds an itemtype by name.
     *
     * @param name The itemtype's name.
     * @return Optional containing the found itemtype or empty if not found.
     */
    public Optional<Itemtype> findByName(String name) {
        return ReusableServices.findByName("itemtype_name", findAll(), Itemtype::getItemname);
    }


}

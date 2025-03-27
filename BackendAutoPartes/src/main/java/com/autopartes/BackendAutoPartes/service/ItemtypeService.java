package com.autopartes.BackendAutoPartes.service;

     import com.autopartes.BackendAutoPartes.model.dto.Itemtype;
     import com.autopartes.BackendAutoPartes.model.dto.request.ItemtypeRequest;
     import com.autopartes.BackendAutoPartes.repository.ItemtypeRepository;
     import com.autopartes.BackendAutoPartes.utils.ReusableServices;
     import org.springframework.stereotype.Service;
     import org.springframework.transaction.annotation.Transactional;

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
             return itemtypeRepository.findById(id).map(this::mapToDto);
         }

         /**
          * Saves an itemtype.
          *
          * @param itemtypeRequest The itemtype to save.
          * @return The saved itemtype.
          */
         @Transactional
         public Itemtype save(ItemtypeRequest itemtypeRequest) {
             Itemtype entity = new Itemtype();
             entity.setItemname(itemtypeRequest.getItemname());
             entity.setImagepath(itemtypeRequest.getImagepath());
             return mapToDto(itemtypeRepository.save(entity));
         }

         /**
          * Deletes an itemtype by id.
          *
          * @param id The itemtype's id.
          */
         @Transactional
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

         private Itemtype mapToDto(Itemtype entity) {
             Itemtype dto = new Itemtype();
             dto.setId(entity.getId());
             dto.setItemname(entity.getItemname());
             dto.setImagepath(entity.getImagepath());
             return dto;
         }
     }
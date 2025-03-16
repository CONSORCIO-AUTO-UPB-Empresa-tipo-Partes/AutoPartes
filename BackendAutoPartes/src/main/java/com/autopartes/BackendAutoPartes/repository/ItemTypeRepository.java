package com.autopartes.BackendAutoPartes.repository;

import com.autopartes.BackendAutoPartes.model.ItemType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ItemTypeRepository extends JpaRepository<ItemType, Long> {
    List<ItemType> findByNameContainingIgnoreCase(String name);
}

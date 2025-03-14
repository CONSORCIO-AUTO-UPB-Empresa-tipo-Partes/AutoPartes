package com.autopartes.BackendAutoPartes.repository;

import com.autopartes.BackendAutoPartes.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartRepository extends JpaRepository<CartItem, Long> {
}

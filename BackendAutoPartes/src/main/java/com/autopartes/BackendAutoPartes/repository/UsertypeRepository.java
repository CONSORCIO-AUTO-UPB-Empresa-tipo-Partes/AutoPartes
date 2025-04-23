package com.autopartes.BackendAutoPartes.repository;

import com.autopartes.BackendAutoPartes.model.dto.Usertype;

import org.hibernate.usertype.UserType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

/**
 * Interface that extends JpaRepository for CRUD operations on the Usertype entity.
 */
public interface UsertypeRepository extends JpaRepository<Usertype, Integer> {

    Optional<Usertype> findByUsertypename(String usertypename);
}



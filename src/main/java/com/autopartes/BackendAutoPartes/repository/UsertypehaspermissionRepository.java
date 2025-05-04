package com.autopartes.BackendAutoPartes.repository;

import com.autopartes.BackendAutoPartes.model.dto.Usertypehaspermission;
import com.autopartes.BackendAutoPartes.model.dto.UsertypehaspermissionId;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Interface that extends JpaRepository for CRUD operations on the Usertypehaspermission entity.
 */
public interface UsertypehaspermissionRepository extends JpaRepository<Usertypehaspermission, UsertypehaspermissionId> {

}

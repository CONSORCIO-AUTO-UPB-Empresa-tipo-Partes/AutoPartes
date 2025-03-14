package com.autopartes.BackendAutoPartes.repository;

import com.autopartes.BackendAutoPartes.model.Permissions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PermissionsRepository extends JpaRepository<Permissions, Long> {
}

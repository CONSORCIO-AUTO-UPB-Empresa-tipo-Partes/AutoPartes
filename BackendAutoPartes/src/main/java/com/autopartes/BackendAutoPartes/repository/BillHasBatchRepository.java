package com.autopartes.BackendAutoPartes.repository;

import com.autopartes.BackendAutoPartes.model.BillHasBatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BillHasBatchRepository extends JpaRepository<BillHasBatch, Long> {
}

package com.autopartes.BackendAutoPartes.repository;

import com.autopartes.BackendAutoPartes.model.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {

    /**
     * Método para obtener todas las facturas dentro de un rango de fechas.
     * Spring Data JPA generará automáticamente la consulta SQL equivalente:
     *
     * SQL: SELECT * FROM bill WHERE date BETWEEN :startDate AND :endDate;
     *
     * @param startDate Fecha y hora de inicio del rango.
     * @param endDate Fecha y hora de fin del rango.
     * @return Lista de facturas dentro del rango de fechas especificado.
     */
    List<Bill> findByDateBetween(LocalDateTime startDate, LocalDateTime endDate);
}
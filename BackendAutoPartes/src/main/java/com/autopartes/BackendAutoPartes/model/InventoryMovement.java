package com.autopartes.BackendAutoPartes.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "inventory_movements")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class InventoryMovement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "lot_id", nullable = false)
    private Batch batch; // Lote afectado por el movimiento

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MovementType movementType; // INGRESO, SALIDA, TRASLADO

    private int quantity; // Cantidad de ítems movidos

    private LocalDate movementDate; // Fecha del movimiento

    @ManyToOne
    @JoinColumn(name = "destination_lot_id")
    private Batch destinationBatch; // Solo se usa en traslados
}

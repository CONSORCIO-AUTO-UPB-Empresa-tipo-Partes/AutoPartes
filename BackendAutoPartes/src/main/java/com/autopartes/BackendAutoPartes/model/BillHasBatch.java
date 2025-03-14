package com.autopartes.BackendAutoPartes.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "bill_has_batch")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BillHasBatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "bill_id", nullable = false)
    private Bill bill;

    @ManyToOne
    @JoinColumn(name = "batch_id", nullable = false)
    private Batch batch;

    private int amountSold;
}

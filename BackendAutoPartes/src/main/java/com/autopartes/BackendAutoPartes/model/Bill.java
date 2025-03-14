package com.autopartes.BackendAutoPartes.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String invoiceNumber;
    private LocalDateTime date;
    private double totalPrice;
    private double tax;
    private boolean hasDiscount;
    private double discountAmount;
    private double subtotalWithoutTax;

    @ManyToOne
    @JoinColumn(name = "person_id")
    private Person person;

    @OneToMany(mappedBy = "bill", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BillHasBatch> billHasBatches = new ArrayList<>(); // 🔹 Inicializamos la lista para evitar null

    public void addBillHasBatch(BillHasBatch billHasBatch) {
        this.billHasBatches.add(billHasBatch);
        billHasBatch.setBill(this);
    }
}

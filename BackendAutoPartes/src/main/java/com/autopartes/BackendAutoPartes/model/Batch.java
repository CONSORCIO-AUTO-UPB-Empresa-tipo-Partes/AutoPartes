package com.autopartes.BackendAutoPartes.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "lots")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Batch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String lotCode;
    private LocalDate date;

    @ManyToOne
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    private int quantity;

    @ManyToOne
    @JoinColumn(name = "item_id")
    private ItemType itemType;

    private double purchasePrice;

    @Column(nullable = false)
    private double salePrice = 0.0; // ✅ Se inicializa para evitar valores nulos

    private String warranty;
    private String description;
    private double trm;

    @Column(nullable = false, updatable = false)
    private int initialQuantity;

    private double profitMargin = 0.05; // ✅ Ahora es un atributo editable


    /**
     * Constructor personalizado para asegurarse de que el precio de venta se inicializa correctamente.
     */
    public Batch(String lotCode, Supplier supplier, int quantity, ItemType itemType,
                 double purchasePrice, String warranty, String description, double trm, int initialQuantity) {
        this.lotCode = lotCode;
        this.supplier = supplier;
        this.quantity = quantity;
        this.itemType = itemType;
        this.purchasePrice = purchasePrice;
        this.salePrice = calculateSalePrice(purchasePrice);
        this.warranty = warranty;
        this.description = description;
        this.trm = trm;
        this.initialQuantity = initialQuantity;
        this.date = LocalDate.now();
    }

    /**
     * Calcula el precio de venta con margen de ganancia.
     */
    private double calculateSalePrice(double purchasePrice) {
        return purchasePrice + (purchasePrice * profitMargin);
    }

    /**
     * Setter para `purchasePrice` que recalcula automáticamente `salePrice`.
     */
    public void setPurchasePrice(double purchasePrice) {
        this.purchasePrice = purchasePrice;
        this.salePrice = calculateSalePrice(purchasePrice);
    }

    /**
     * Setter para `profitMargin` que recalcula automáticamente `salePrice`.
     */
    public void setProfitMargin(double profitMargin) {
        if (profitMargin < 0 || profitMargin > 1) {
            throw new IllegalArgumentException("El margen de ganancia debe estar entre 0 y 1 (0% - 100%)");
        }
        this.profitMargin = profitMargin;
        this.salePrice = calculateSalePrice(this.purchasePrice); // Recalcula el precio de venta
    }

    /**
     * Getter explícito para `salePrice` para evitar problemas con Hibernate.
     */
    public double getSalePrice() {
        return this.salePrice;
    }

    /**
     * Setter personalizado para `initialQuantity` para evitar modificaciones posteriores.
     */
    public void setInitialQuantity(int initialQuantity) {
        if (this.initialQuantity == 0) {
            this.initialQuantity = initialQuantity;
        } else {
            throw new UnsupportedOperationException("Initial quantity cannot be modified once set.");
        }
    }
}
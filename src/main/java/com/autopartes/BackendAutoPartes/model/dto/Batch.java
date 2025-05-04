package com.autopartes.BackendAutoPartes.model.dto;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "batch", schema = "autopartes")
public class Batch {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "batch_seq")
    @SequenceGenerator(name = "batch_seq", sequenceName = "autopartes.batch_idbatch_seq", allocationSize = 1)
    @Column(name = "idbatch", nullable = false)
    private Integer idbatch;

    @Column(name = "datearrival", nullable = false)
    private Instant datearrival;

    @Column(name = "quantity", nullable = false)
    @NotNull
    @Min(0)
    private Integer quantity;


    @Column(name = "purchaseprice", nullable = false, precision = 10, scale = 2)
    private BigDecimal purchaseprice;

    @Column(name = "unitpurchaseprice", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitpurchaseprice;

    @Column(name = "unitsaleprice", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitsaleprice;

    @Column(name = "monthsofwarranty")
    private Integer monthsofwarranty;

    @Column(name = "itemdescription", length = 250)
    private String itemdescription;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "item_iditem", nullable = false)
    private Itemtype itemIditem;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "provider_idprovider", nullable = false)
    private Provider providerIdprovider;

    @Column(name = "warrantyindays", length = 45)
    private String warrantyindays;

    @Column(name = "havewarranty")
    private Boolean havewarranty;

    @Column(name = "initialquantity", nullable = false)
    private Integer initialquantity;

}
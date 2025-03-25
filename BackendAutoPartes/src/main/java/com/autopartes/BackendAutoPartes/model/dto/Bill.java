package com.autopartes.BackendAutoPartes.model.dto;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "bill", schema = "autopartes")
public class Bill {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "bill_seq")
    @SequenceGenerator(
            name = "bill_seq",
            sequenceName = "autopartes.bill_idbill_seq",
            allocationSize = 1
    )
    @Column(name = "idbill", nullable = false)
    private Integer id;

    @Column(name = "billdate", nullable = false)
    private Instant billdate;

    @Column(name = "totalprice", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalprice;

    @Column(name = "tax", precision = 10, scale = 2)
    private BigDecimal tax;

    @Column(name = "totalpricewithouttax", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalpricewithouttax;

    @Column(name = "havediscount")
    private Boolean havediscount;

    @Column(name = "discountrate", precision = 5, scale = 2)
    private BigDecimal discountrate;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "person_iddocument", nullable = false)
    private Person personIddocument;

}
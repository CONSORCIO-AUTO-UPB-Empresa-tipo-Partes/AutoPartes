package com.autopartes.BackendAutoPartes.model.dto;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@Entity
@Table(name = "billhasbatch", schema = "autopartes")
public class Billhasbatch {
    @EmbeddedId
    private BillhasbatchId id;

    @MapsId("billIdbill")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "bill_idbill", nullable = false)
    private Bill billIdbill;

    @MapsId("batchIdbatch")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "batch_idbatch", nullable = false)
    private Batch batchIdbatch;

    @Column(name = "amountsold")
    private Integer amountsold;

}
package com.autopartes.BackendAutoPartes.model.dto;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.Hibernate;

import java.util.Objects;

@Getter
@Setter
@Embeddable
public class BillhasbatchId implements java.io.Serializable {
    private static final long serialVersionUID = -5909641846624295873L;
    @Column(name = "bill_idbill", nullable = false)
    private Integer billIdbill;

    @Column(name = "batch_idbatch", nullable = false)
    private Integer batchIdbatch;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        BillhasbatchId entity = (BillhasbatchId) o;
        return Objects.equals(this.billIdbill, entity.billIdbill) &&
                Objects.equals(this.batchIdbatch, entity.batchIdbatch);
    }

    @Override
    public int hashCode() {
        return Objects.hash(billIdbill, batchIdbatch);
    }

}
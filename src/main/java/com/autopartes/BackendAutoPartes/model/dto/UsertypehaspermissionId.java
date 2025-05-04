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
public class UsertypehaspermissionId implements java.io.Serializable {
    private static final long serialVersionUID = -3996917158216274183L;
    @Column(name = "usertype_idtypeuser", nullable = false)
    private Integer usertypeIdtypeuser;

    @Column(name = "permissions_idpermissions", nullable = false)
    private Integer permissionsIdpermissions;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        UsertypehaspermissionId entity = (UsertypehaspermissionId) o;
        return Objects.equals(this.usertypeIdtypeuser, entity.usertypeIdtypeuser) &&
                Objects.equals(this.permissionsIdpermissions, entity.permissionsIdpermissions);
    }

    @Override
    public int hashCode() {
        return Objects.hash(usertypeIdtypeuser, permissionsIdpermissions);
    }

}